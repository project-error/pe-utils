import { CallbackFn } from "./types";

/**
 * A wrapper for handling NUI Callbacks
 * @typeParam T The data type of the data sent back to the client
 * @param event - The event name to listen for
 * @param callback - The callback function
 */
export const RegisterNuiCB = <T = any>(event: string, callback: CallbackFn<T>): void => {
  RegisterNuiCallbackType(event);
  on(`__cfx_nui:${event}`, callback);
};
