function* flatten(list: unknown[]): Generator {
  for (const item of list) {
    if (Array.isArray(item)) {
      yield* flatten(item);
    } else {
      yield item;
    }
  }
}

/** `StringBuilder` helps build a string from fragments.
 *
 * Fragments can be strings, `Array`s, `Promise`s, nested `StringBuilder`s or anything with a `toString()` method.
 * `Promise`s will be awaited and resolved.
 * `Array`s will be iterated and their items resolved to a string.
 * Nested `StringBuilder` will have their fragments resolved to a string.
 *
 * Example:
 *
 * ```
 * const builder = new StringBuilder();
 * builder.add(`a `);
 * builder.add(Promise.resolve(`bb `));
 * builder.add([`ccc `, `ddd `]);
 * builder.add(new StringBuilder([`ee `, Promise.resolve(`f`)]));
 *
 * const text = await builder.getString(); // "a bb ccc ddd ee f"
 * ```
 */
export class StringBuilder {
  private fragments: unknown[] = [];

  constructor(fragments: unknown[] = []) {
    this.fragments = [...fragments];
  }

  private *iterateFragments(): Generator {
    for (const fragment of flatten(this.fragments)) {
      if (fragment instanceof StringBuilder) {
        yield* fragment.iterateFragments();
      } else {
        yield fragment;
      }
    }
  }

  /** `add()` adds a fragment to the `StringBuilder`. */
  add(value: unknown) {
    this.fragments.push(value);
  }

  /** `toString()` will always throw an error.
   *
   * The string generation needs to be async because `StringBuilder` awaits and resolves `Promise`s.
   * The `Object` `toString()` method espects a `string` as its return type and not a `Promise`
   * so this method cannot be used.
   *
   * To avoid mistakes of calling `toString()` and expecting it to return the `StringBuilder` `string`
   * the method throws an error.
   */
  toString(): string {
    throw new Error("`toString()` should not be called, call `getString()` instead");
  }

  /** `getString()` returns the string created by resolving and joining all the `StringBuilder` fragments. */
  async getString(): Promise<string> {
    const strings: string[] = [];

    for (let fragment of this.iterateFragments()) {
      if (fragment instanceof Promise) {
        fragment = await fragment;
      }

      if (fragment === undefined || fragment === null) {
        continue;
      }

      strings.push(typeof fragment === `string` ? fragment : `${fragment}`);
    }

    return strings.join(``);
  }
}
