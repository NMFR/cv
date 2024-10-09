/** `iterator` returns a function generator iterator that yields the values of its `collection` parameter. */
export function* iterator(collection: Iterable<unknown>) {
  for (const item of collection) {
    yield item;
  }
}

/** `isIterable` is a type guard to check if a value is an `Iterable`.
 *
 * Note that this method only returns true for `Object` iterators, so `string`s will return false even
 * though they are iterable.
 */
export function isIterable(value: unknown): value is Iterable<unknown> {
  return value instanceof Object && Symbol.iterator in value;
}
