import { ServerErrorCodes, ServerStatus } from "../misc/constants";
import { v4 as uuidv4 } from "uuid";

export interface PromiseRequest<T = any> {
  data: T;
  source: number;
}

export interface ServerPromiseResp<T = undefined> {
  errorMsg?: ServerErrorCodes;
  status: "ok" | "error";
  data?: T;
}

interface ServerUtilSettings {
  debugMode: boolean;
  rpcTimeout: number;
}

export type PromiseEventResp<T> = (returnData: ServerPromiseResp<T>) => void;

export type CBSignature<T, P> = (reqObj: PromiseRequest<T>, resp: PromiseEventResp<P>) => void;

export default class ServerUtils {
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

      const uniqId = uuidv4();

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
