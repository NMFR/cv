import { assert, assertEquals } from "jsr:@std/assert@1.0.6";

import { isIterable, iterator, toArrayWithPromiseResolution } from "./iterator.ts";

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

Deno.test(`toArrayWithPromiseResolution()`, async (t) => {
  const testCases = {
    "empty array": { input: [], expected: [] },
    "array": { input: [1, 2, 3], expected: [1, 2, 3] },
    "array with promises": { input: [1, Promise.resolve(2), Promise.resolve(3)], expected: [1, 2, 3] },
    "nested array with promises": {
      input: [1, Promise.resolve(2), [Promise.resolve(3), [4, Promise.resolve(5)]]],
      expected: [1, 2, [3, [4, 5]]],
    },
    "empty iterator": { input: iterator([]), expected: [] },
    "iterator": { input: iterator([1, 2, 3]), expected: [1, 2, 3] },
    "iterator with promises": { input: iterator([1, Promise.resolve(2), Promise.resolve(3)]), expected: [1, 2, 3] },
    "nested iterator with promises": {
      input: iterator([1, Promise.resolve(2), iterator([Promise.resolve(3), iterator([4, Promise.resolve(5)])])]),
      expected: [1, 2, [3, [4, 5]]],
    },
    "nested iterator and array with promises": {
      input: iterator([1, Promise.resolve(2), [Promise.resolve(3), iterator([4, Promise.resolve(5)])]]),
      expected: [1, 2, [3, [4, 5]]],
    },
    "doc example": { input: iterator([1, iterator([2, Promise.resolve(3)])]), expected: [1, [2, 3]] },
  };

  for (const [testName, testCase] of Object.entries(testCases)) {
    await t.step(testName, async () => {
      const result = await toArrayWithPromiseResolution(testCase.input);

      assert(Array.isArray(result));
      assertEquals(result, testCase.expected);
    });
  }
});
