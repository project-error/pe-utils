import { ServerErrorCodes } from "../misc";

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