/** `isIterable` is a type guard to check if a value is an `Object` and an `Iterable`.
 *
 * Note that this function will return false for `string`s, they are `Iterable` but are not `Object`s.
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

/** `flattenAsync` returns a function generator iterator that will yield all values of its `collection` parameters
 * and the values of any nested `Array`s / `Iterator`s.
 * Basically it flattens a nested collection of `Iterator`s to a single `Iterator`.
 *
 * It also resolves all nested `Promise`s to their values.
 *
 * Example:
 * ```
 * flattenAsync(iterator([1, [2, Promise.resolve([3, iterator([4, Promise.resolve([5])])])]])) // equivalent to [1,2,3,4,5]
 * ```
 */
export async function* flattenAsync(
  collection: Iterable<unknown | Promise<unknown> | Iterable<unknown>>,
): AsyncGenerator {
  for (let item of collection) {
    if (item instanceof Promise) {
      item = await item;
    }

    if (isIterable(item)) {
      yield* flattenAsync(item);
    } else {
      yield item;
    }
  }
}

/** `toArrayAsync` converts a set of nested `Iterable`s to nested set of `Array`s.
 * This allows to iterate over the collection multiple times.
 * As opposed to a single iteration with the usage of some iterators like function generators.
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
