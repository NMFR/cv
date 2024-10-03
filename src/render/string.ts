import { StringBuilder } from "./stringBuilder.ts";

const DefaultToStrings = [(new Object()).toString(), Promise.resolve().toString()];

/** `ensureNoDefaultToString` ensures that the return value of the default `toString()` implementation of `Object`s
 * (`"[object Object]""`) or `Promise`s (`"[object Promise]""`) is not present in a string.
 *
 * An error is thrown if the default `toString()` values are detected anywhere in the string, otherwise the function
 * returns normally.
 *
 * This is useful to detect unwanted default `toString()` in template literal strings where an `Object` or `Promise`
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
 * `taggedTemplate` is a tag template literal function that returns a `StringBuilder`.
 *
 * The template literal is able to resolve `Promise`s and nested `StringBuilder` values.
 *
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
 * `nonEmptyTaggedTemplate` ensures the template values are not `null` or `undefined`.
 *
 * If all of the template literal values are not `null` or `undefined` a `StringBuilder`
 * with the template is returned (same behaviour of `taggedTemplate`).
 * If any of the template literal values are `null` or `undefined` an empty string `StringBuilder`
 * is returned.
 *
 * This allows to create conditional template literals where the template only "renders" if its
 * values are not `null` or `undefined`.
 *
 * Examples:
 *
 * ```
 * (await nonEmptyTaggedTemplate`Hello ${"World"}`.generateString()) === "Hello World"
 * (await nonEmptyTaggedTemplate`Hello ${null}`.generateString()) === "".
 * (await nonEmptyTaggedTemplate`Hello ${"World"}, I am ${undefined}`.generateString()) === "".
 * ```
 */
export function nonEmptyTaggedTemplate(strings: TemplateStringsArray, ...values: unknown[]) {
  return values.some((s) => s === null || s === undefined || s === ``)
    ? new StringBuilder()
    : taggedTemplate(strings, ...values);
}
