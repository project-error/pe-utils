import { ServerErrorCodes, ServerStatus, PrefixedUUID } from "../misc";

import {
  CBSignature,
  PromiseEventResp,
  PromiseRequest,
  ServerPromiseResp,
  ServerUtilSettings,
} from "../types";

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
   * @param eventName The event name to listen for
   * @param cb A callback function that takes the req and resp objects as its arguments
   **/
  public onNetPromise<T = any, P = any>(eventName: string, cb: CBSignature<T, P>): void {
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

      Promise.resolve(cb(promiseRequest, promiseResp)).catch((e) => {
        console.error(`Error in onNetPromise (${eventName}), ERROR: ${e.message}`);

        promiseResp({ status: ServerStatus.Error, errorMsg: ServerErrorCodes.UnknownError });
      });
    });
  }

  /**
   * For calling RPC events registered on the client. RPC events will trigger on the client and
   * return client data which is dependent on the logic of the RPC callback.
   * @param eventName The event name to trigger
   * @param src The source of the player to call the RPC event on
   * @param data Any data you wish to pass to the client during this RPC request
   **/
  public callClientRPC<T = any>(
    eventName: string,
    src: number | string,
    data?: unknown
  ): Promise<T> {
    return new Promise((res, rej) => {
      let hasTimedout = false;

      setTimeout(() => {
        hasTimedout = true;
        rej(`RPC Call: ${eventName} timed out after ${this._utilSettings.rpcTimeout} `);
      }, this._utilSettings.rpcTimeout);

      const uniqId = PrefixedUUID(this.uidCounter++);

      const listenEventName = `${eventName}:${uniqId}`;

      emitNet(eventName, src, listenEventName, data);

      const handleClientResp = (data: T) => {
        removeEventListener(listenEventName, handleClientResp);
        if (hasTimedout) return;
        res(data);
      };

      onNet(listenEventName, handleClientResp);
    });
  }
}
