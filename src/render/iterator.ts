/** `isIterable` is a type guard to check if a value is an `Iterable`.
 *
 * Note that this method only returns true for `Object` iterators, so `string`s will return false even
 * though they are iterable.
 */
export function isIterable(value: unknown): value is Iterable<unknown> {
  return value instanceof Object && Symbol.iterator in value;
}

/** `iterator` returns a function generator iterator that yields the values of its `collection` parameter. */
export function* iterator(collection: Iterable<unknown>) {
  for (const item of collection) {
    yield item;
  }
}

/** `toArrayAsync` converts a nested `Iterable` to nested `Array`s allowing to iterate over the collection multiple times.
 * As opposed to a single time with the usage of some iterators like function generators.
 *
 * It also resolves all nested `Promise`s to their values.
 *
 * Example:
 * ```
 * await toArrayAsync(iterator([1,iterator([2, Promise.resolve(3)])])) // [1,[2,3]]
 * ```
 */
export async function toArrayAsync(
  list: Iterable<unknown | Promise<unknown> | Iterable<unknown>>,
): Promise<(unknown | unknown[])[]> {
  const result: unknown[] = [];

  for (let item of list) {
    if (item instanceof Promise) {
      item = await item;
    }

    if (isIterable(item)) {
      result.push(await toArrayAsync(item));
    } else {
      result.push(item);
    }
  }

  return result;
}
