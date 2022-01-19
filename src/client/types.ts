export type NuiCallbackFunc = (val: any) => void;
export type CallbackFn<T> = (data: T, cb: NuiCallbackFunc) => void;
export type RPCListenerCb<T, R> = (data: T) => R;

export interface ClientUtilSettings {
  promiseTimeout: number;
  debugMode: boolean;
}

export interface ClientUtilsParams {
  promiseTimout?: number;
  debugMode?: boolean;
}

export interface LogLevels {
  0: "silly";
  1: "trace";
  2: "debug";
  3: "info";
  4: "warn";
  5: "error";
  6: "fatal";
}

export type LogLevelId = keyof LogLevels;

export type LogLevelName = LogLevels[LogLevelId];
