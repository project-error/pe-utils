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


