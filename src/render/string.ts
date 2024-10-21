import { iterator, toArrayAsync } from "./iterator.ts";
import { StringBuilder } from "./stringBuilder.ts";

export interface Template {
  getString(): Promise<string>;
}

const DefaultToStrings = [
  (new Object()).toString(),
  Promise.resolve().toString(),
  iterator([]).toString(),
  (new Set()).toString(),
  (new Map()).toString(),
];

/** `ensureNoDefaultToString` ensures that the return value of the default `toString()` implementation of:
 * - `Object`: `"[object Object]"`.
 * - `Promise`: `"[object Promise]"`)
 * - `function* generator`: `"[object Generator]"`
 * - `Set`: `"[object Set]"`.
 * - `Map`: `"[object Map]"`.
 *
 * are not present in a string.
 *
 * An error is thrown if the default `toString()` values are detected anywhere in the string, otherwise the function
 * returns normally.
 *
 * This is useful to detect unwanted default `toString()` in template literal strings where an `Object`, `Promise`, ...,
 * value was not correctly formatted.
 *
 * Example:
 * ```
 * const fruitRattings = {
 *   "Orange": 5,
 *   "Mango": 10
 * };
 *
 * let text = `Fruit rattings: ${Object.entries(fruitRattings).map(([fruit, ratting]) => `${fruit}: ${ratting}`).join(",")}` // "Fruit rattings: Orange: 5,Mango: 10"
 * ensureNoDefaultToString(text) // Returns normally
 * text = `Fruit rattings: ${fruitRattings}` // "Fruit rattings: [object Object]"
 * ensureNoDefaultToString(text) // Will throw an error
 * ```
 */
export function ensureNoDefaultToString(value: string) {
  for (const objectString of DefaultToStrings) {
    const index = value.indexOf(objectString);

    if (index !== -1) {
      throw new Error(JSON.stringify({
        error: `found the value of the default \`toString()\` ('${objectString}') in the string`,
        index,
        string: value,
      }));
    }
  }
}

/**
 * `taggedTemplate` is a tag template literal function that returns a `Template`.
 *
 * The template literal is able to resolve `Promise`s and nested `Template` values.
 *
 * Example:
 *
 * ```
 * (await taggedTemplate`Hello ${"World"}`.getString()) === "Hello World"
 * ```
 */
export function taggedTemplate(strings: TemplateStringsArray, ...values: unknown[]): Template {
  const fragments: unknown[] = [strings[0]];

  for (let i = 0; i < values.length; i += 1) {
    fragments.push(values[i]);
    fragments.push(strings[i + 1]);
  }

  return new StringBuilder(fragments);
}

function hasEmpty(values: (unknown | unknown[])[]) {
  for (const value of values) {
    if (
      (value === undefined || value === null || value === ``) ||
      (Array.isArray(value) && (value.length === 0 || hasEmpty(value)))
    ) {
      return true;
    }
  }

  return false;
}

/**
 * `nonEmptyTaggedTemplate` ensures the template values are not "empty".
 *
 * The definition of "empty" is any value equal to:
 * - `undefined`.
 * - `null`.
 * - empty string (`""`).
 * - empty array / iterator (`[]`).
 *
 * If any of the template literal values are "empty" an empty string `Template` is returned.
 * Otherwise a `Template` with the template is returned (same behaviour of `taggedTemplate`).
 *
 * This allows to create conditional template literals where the template only "renders" if its
 * values are not "empty".
 *
 * Examples:
 *
 * ```
 * (await nonEmptyTaggedTemplate`Hello ${"World"}`.getString()) === "Hello World"
 * (await nonEmptyTaggedTemplate`Hello ${null}`.getString()) === "".
 * (await nonEmptyTaggedTemplate`Hello ${"World"}, I am ${undefined}`.getString()) === "".
 * ```
 */
export function nonEmptyTaggedTemplate(strings: TemplateStringsArray, ...values: unknown[]): Template {
  return new StringBuilder([
    (async () => {
      const resolvedValues = await toArrayAsync(values);

      if (hasEmpty(resolvedValues)) {
        return ``;
      }

      return taggedTemplate(strings, ...resolvedValues);
    })(),
  ]);
}
