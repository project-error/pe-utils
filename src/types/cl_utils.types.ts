export interface ClientUtilSettings {
  promiseTimeout: number;
  debugMode: boolean;
}

export interface ClientUtilsParams {
  promiseTimout?: number;
  debugMode?: boolean;
}

export type NuiCallbackFunc = (val: any) => void;

export type RPCListenerCb<T, R> = (data: T) => R;
