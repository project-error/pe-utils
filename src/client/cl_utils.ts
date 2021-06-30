import { v4 as uuidv4 } from "uuid";

interface ClientUtilSettings {
  promiseTimeout: number;
  debugMode: boolean;
}

interface ClientUtilsParams {
  promiseTimout?: number;
  debugMode?: boolean;
}

export type NuiCallbackFunc = (val: any) => void;

type RPCListenerCb<T, R> = (data: T) => R;

export default class ClientUtils {
  private _settings: ClientUtilSettings = {
    promiseTimeout: 15000,
    debugMode: false,
  };

  constructor(settings?: ClientUtilsParams) {
    this.setSettings(settings);
  }

  private debugLog(...args: any[]): void {
    if (!this._settings.debugMode) return;

    console.log(`^1[ClUtils]^0`, ...args);
  }

  public setSettings(settings?: ClientUtilsParams): void {
    this._settings = {
      ...this._settings,
      ...settings,
    };
  }

  public emitNetPromise<T = any>(eventName: string, data: unknown): Promise<T> {
    return new Promise((resolve, reject) => {
      let hasTimedOut = false;

      setTimeout(() => {
        hasTimedOut = true;
        reject(`${eventName} has timed out after ${this._settings.promiseTimeout} ms`);
      }, this._settings.promiseTimeout);

      const uniqId = uuidv4();

      const listenEventName = `${eventName}:${uniqId}`;

      emitNet(eventName, listenEventName, data);

      const handleListenEvent = (data: T) => {
        removeEventListener(listenEventName, handleListenEvent);
        if (hasTimedOut) return;
        resolve(data);
      };
      onNet(listenEventName, handleListenEvent);
    });
  }

  /**
   *  Will Register an NUI event listener that will immediately
   *  proxy to a server side event of the same name and wait
   *  for the response.
   *  @param event - The event name to listen for
   */
  public registerNuiProxy(event: string): void {
    RegisterNuiCallbackType(event);
    on(`__cfx_nui:${event}`, async (data: unknown, cb: NuiCallbackFunc) => {
      this.debugLog(`NUICallback processed: ${event}`);
      this.debugLog(`NUI CB Data:`, data);
      try {
        const res = await this.emitNetPromise(event, data);
        cb(res);
      } catch (e) {
        console.error("Error encountered while listening to resp. Error:", e);
        cb({ err: e });
      }
    });
  }

  /**
   * Register a client side RPC listener with a callback fn containing logic
   * @param eventName - The event name to listen for
   * @param cb - The callback function that returns the desired value back to the server
   **/
  public registerRPCListener<T = any, R = any>(eventName: string, cb: RPCListenerCb<T, R>): void {
    onNet(eventName, (listenEventName: string, data: T) => {
      this.debugLog(`RPC called: ${eventName}`);

      Promise.resolve(cb(data))
        .then((retData) => {
          this.debugLog(`RPC Data:`, data);
          emitNet(listenEventName, retData);
        })
        .catch((e) => {
          console.error(`RPC Error in ${eventName}, ERR: ${e.message}`);
        });
    });
  }
}
