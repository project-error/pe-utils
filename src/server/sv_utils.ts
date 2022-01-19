import { PrefixedUUID } from "../common/helpers";
import {
  NetPromiseCallback,
  PromiseEventResp,
  PromiseRequest,
  ServerErrorCodes,
  ServerPromiseResp,
  ServerStatus,
  ServerUtilSettings,
} from "./types";

export class ServerUtils {
  private uidCounter = 0;
  private readonly _utilSettings: ServerUtilSettings = {
    debugMode: false,
    rpcTimeout: 10000,
  };

  public constructor(settings?: Partial<ServerUtilSettings>) {
    this._utilSettings = { ...this._utilSettings, ...settings };
  }

  private debugLog(...args: unknown[]) {
    if (!this._utilSettings.debugMode) return;
    console.log(`^3[SvUtils]^1`, ...args);
  }

  /**
   * The method used whenever handling a promisified event sent by the Client Utils instance
   * @typeParam T Request data type
   * @typeParam P Response data type
   * @param eventName The event name to listen for
   * @param callback A callback function which provides the request and response data to the caller
   **/
  public onNetPromise<T = any, P = any>(eventName: string, callback: NetPromiseCallback<T, P>): void {
    onNet(eventName, (respEventName: string, data: T) => {
      const src = global.source;

      const promiseRequest: PromiseRequest<T> = {
        source: src,
        data,
      };

      this.debugLog(`NetPromise received for ${eventName}, src: ${src}`);
      this.debugLog("Data:", data);

      const promiseResp: PromiseEventResp<P> = (data: ServerPromiseResp<P>) => {
        this.debugLog(`PromiseResp: s m  = ${src}, e = ${respEventName}`);
        this.debugLog(`RetData`, data);
        emitNet(respEventName, src, data);
      };

      Promise.resolve(callback(promiseRequest, promiseResp)).catch(e => {
        console.error(`Error in onNetPromise (${eventName}), ERROR: ${e.message}`);

        promiseResp({ status: ServerStatus.Error, errorMsg: ServerErrorCodes.UnknownError });
      });
    });
  }

  /**
   * For calling RPC events registered on the client. RPC events will trigger on the client and
   * return client data which is dependent on the logic of the RPC callback.
   * @typeParam T The return data type of the RPC callback
   * @param eventName The RPC name to call
   * @param src The source of the player to call the RPC event on
   * @param data Optional data to pass to the client through the RPC callback
   **/
  public callClientRPC<T = any>(eventName: string, src: number | string, data?: unknown): Promise<T> {
    return new Promise((resolve, reject) => {
      let hasTimedout = false;

      setTimeout(() => {
        hasTimedout = true;
        reject(`RPC Call: ${eventName} timed out after ${this._utilSettings.rpcTimeout}`);
      }, this._utilSettings.rpcTimeout);

      const uniqId = PrefixedUUID(this.uidCounter++);

      const listenEventName = `${eventName}:${uniqId}`;

      emitNet(eventName, src, listenEventName, data);

      const handleClientResp = (data: T) => {
        removeEventListener(listenEventName, handleClientResp);
        if (hasTimedout) return;
        resolve(data);
      };

      onNet(listenEventName, handleClientResp);
    });
  }
}
