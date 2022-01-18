export enum ServerErrorCodes {
  UnknownError = "UNKNOWN_ERROR",
  TimedOut = "TIMED_OUT",
  NotAllowed = "NOT_ALLOWED",
  ServerError = "SERVER_ERROR",
  InvalidData = "INVALID_DATA",
}

export enum ServerStatus {
  OK = "ok",
  Error = "error",
}

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
export interface PromiseRequest<T = any> {
  data: T;
  source: number;
}

export interface ServerPromiseResp<T = undefined> {
  errorMsg?: ServerErrorCodes;
  status: "ok" | "error";
  data?: T;
}

export interface ServerUtilSettings {
  debugMode: boolean;
  rpcTimeout: number;
}

export type PromiseEventResp<T> = (returnData: ServerPromiseResp<T>) => void;

export type CBSignature<T, P> = (reqObj: PromiseRequest<T>, resp: PromiseEventResp<P>) => void;
