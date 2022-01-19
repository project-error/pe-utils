export type PromiseEventResp<T> = (returnData: ServerPromiseResp<T>) => void;
export type NetPromiseCallback<T, P> = (reqObj: PromiseRequest<T>, resp: PromiseEventResp<P>) => void;

export const enum ServerErrorCodes {
  UnknownError = "UNKNOWN_ERROR",
  TimedOut = "TIMED_OUT",
  NotAllowed = "NOT_ALLOWED",
  ServerError = "SERVER_ERROR",
  InvalidData = "INVALID_DATA",
}

export const enum ServerStatus {
  OK = "ok",
  Error = "error",
}

export interface ServerPromiseResp<T = undefined> {
  errorMsg?: ServerErrorCodes;
  status: "ok" | "error";
  data?: T;
}

export interface PromiseRequest<T = any> {
  data: T;
  source: number;
}

export interface ServerUtilSettings {
  debugMode: boolean;
  rpcTimeout: number;
}
