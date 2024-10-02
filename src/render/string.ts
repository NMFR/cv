import { StringBuilder } from "./stringBuilder.ts";

const ObjectToStrings = [`[object Object]`, `[object Promise]`];

export function ensureNoObjectToString(value: string) {
  for (const objectString of ObjectToStrings) {
    const index = value.indexOf(objectString);

    if (index !== -1) {
      throw new Error(JSON.stringify({
        error: `found an objects that was incorreclty serialized '${objectString}' in the string`,
        index,
        string: value,
      }));
    }
  }
}

/**
 * A tag template literal function that returns a `StringBuilder`.
 * Example:
 *
 * ```
 * (await taggedTemplate`Hello ${"World"}`.generateString()) === "Hello World"
 * ```
 */
export function taggedTemplate(strings: TemplateStringsArray, ...values: unknown[]) {
  return StringBuilder.fromTaggedTemplate(strings, ...values);
}

/**
 * A non empty values tag template literal function.
 * It returns a `StringBuilder` if all values are non null / undefined.
 * Otherwise it returns an empty string.
 *
 * This allows to create conditional string fragments.
 *
 * Examples:
 *
 * ```
 * (await nonEmptyTaggedTemplate`Hello ${"World"}`.generateString()) === "Hello World"
 * (await nonEmptyTaggedTemplate`Hello ${null}`.generateString()) === "".
 * (await nonEmptyTaggedTemplate`Hello ${undefined}`.generateString()) === "".
 * ```
 */
export function nonEmptyTaggedTemplate(strings: TemplateStringsArray, ...values: unknown[]) {
  return values.some((s) => s === null || s === undefined || s === ``) ? `` : taggedTemplate(strings, ...values);
}
