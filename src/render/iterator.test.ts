import { assertEquals } from "jsr:@std/assert@1.0.6";

import { isIterable, iterator } from "./iterator.ts";

Deno.test(`iterator()`, async (t) => {
  const testCases = {
    "empty array": { input: [], expected: [] },
    "array of strings": { input: [`1`, `2`, `3`], expected: [`1`, `2`, `3`] },
    "empty set": { input: new Set([]), expected: [] },
    "set of strings": { input: new Set([`1`, `2`, `3`]), expected: [`1`, `2`, `3`] },
    "empty map": { input: new Map(), expected: [] },
    "map of string keys and number values": {
      input: new Map([[`1`, 1], [`2`, 2], [`3`, 3]]),
      expected: [[`1`, 1], [`2`, 2], [`3`, 3]],
    },
    "empty function generator iterator": { input: iterator([]), expected: [] },
    "function generator iterator of strings": { input: iterator([`1`, `2`, `3`]), expected: [`1`, `2`, `3`] },
  };

  for (const [testName, testCase] of Object.entries(testCases)) {
    await t.step(testName, () => {
      assertEquals([...iterator(testCase.input)], testCase.expected);
    });
  }
});

Deno.test(`isIterable()`, async (t) => {
  const testCases = {
    "undefined": { input: undefined, expected: false },
    "null": { input: null, expected: false },
    "0": { input: 0, expected: false },
    "1": { input: 1, expected: false },
    "1.23": { input: 1.23, expected: false },
    "true": { input: true, expected: false },
    "false": { input: false, expected: false },
    "empty string": { input: ``, expected: false },
    "string": { input: `abc`, expected: false },
    "empty object literal": { input: {}, expected: false },
    "object literal": { input: { "a": "b" }, expected: false },
    "new Object()": { input: new Object(), expected: false },
    "empty array": { input: [], expected: true },
    "array of numbers": { input: [1, 2, 3], expected: true },
    "empty function generator iterator": { input: iterator([]), expected: true },
    "function generator iterator of numbers": { input: iterator([1, 2, 3]), expected: true },
    "empty set": { input: new Set(), expected: true },
    "set of numbers": { input: new Set([1, 2, 3]), expected: true },
    "empty map": { input: new Map(), expected: true },
    "map of string keys and number values": { input: new Map([[`1`, 1], [`2`, 2], [`3`, 3]]), expected: true },
  };

  for (const [testName, testCase] of Object.entries(testCases)) {
    await t.step(testName, () => {
      assertEquals(isIterable(testCase.input), testCase.expected);
    });
  }
});
