/**
 * Returns a uuid, prefixed by an iterator number, for added randomness.
 * Example: `7-2ammqh9cevf`
 *
 * @param iterator Iterator value to prefix the uuid with
 * @returns UUID string
 */
export function PrefixedUUID(iterator: number): string {
  return `${iterator.toString(36)}-${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36)}`;
}
