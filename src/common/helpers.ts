/**
 * Returns a uuid, prefixed by an iterator number, for added randomness.
 * Example: 7-2ammqh9cevf
 *
 * @export
 * @param {number} iterator Iterator value to prefix the uuid with
 * @return {*}  {string} uuid string
 */
export function PrefixedUUID(iterator: number): string {
  return `${iterator.toString(36)}-${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36)}`;
}
