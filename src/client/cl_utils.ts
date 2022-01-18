import { PrefixedUUID } from "../common/helpers";
import { ClientUtilSettings, ClientUtilsParams, NuiCallbackFunc, RPCListenerCb } from "../common/types";

export class ClientUtils {
  private uidCounter = 0;
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

  /**
   * Change the settings for this instance by passing a new config
   * @param settings - Settings you wish to overwrite
   **/
  public setSettings(settings?: ClientUtilsParams): void {
    this._settings = {
      ...this._settings,
      ...settings,
    };
  }

  /**
   * Emit a promisified event towards the server which will resolve
   * once the server responds.
   * @param eventName - The event name
   * @param data - The data you wish to send with the request
   **/
  public emitNetPromise<T = any>(eventName: string, data: unknown): Promise<T> {
    return new Promise((resolve, reject) => {
      let hasTimedOut = false;

      setTimeout(() => {
        hasTimedOut = true;
        reject(`${eventName} has timed out after ${this._settings.promiseTimeout} ms`);
      }, this._settings.promiseTimeout);

      const uniqId = PrefixedUUID(this.uidCounter++);

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
   *  Will Register an NUI event callback that will immediately
   *  proxy to a server side promisified event of the same name. Once
   *  the server responds and resolves the promise on the client, this function will
   *  callback to the NUI and resolve the original HTTP request.
   *
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
   * Register a listener for the RPC system which can then be triggered by the server side RPC call.
   *
   * @param eventName - The event name to listen for
   * @param cb - The callback function that returns the desired value back to the server
   **/
  public registerRPCListener<T = any, R = any>(eventName: string, cb: RPCListenerCb<T, R>): void {
    onNet(eventName, (listenEventName: string, data: T) => {
      this.debugLog(`RPC called: ${eventName}`);

      Promise.resolve(cb(data))
        .then(retData => {
          this.debugLog(`RPC Data:`, data);
          emitNet(listenEventName, retData);
        })
        .catch(e => {
          console.error(`RPC Error in ${eventName}, ERR: ${e.message}`);
        });
    });
  }
}
