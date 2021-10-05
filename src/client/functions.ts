import { NuiCallbackFunc } from "../types";

type CallbackFn<T> = (data: T, cb: NuiCallbackFunc) => void;

/**
 * A wrapper for handling NUI Callbacks
 *  @param event - The event name to listen for
 *  @param callback - The callback function
 */
export const RegisterNuiCB = <T = any>(event: string, callback: CallbackFn<T>): void => {
  RegisterNuiCallbackType(event);
  on(`__cfx_nui:${event}`, callback);
};


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const uuidV4 = (options?: any, buf?: any, offset?: any) => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}