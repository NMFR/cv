import { assertEquals } from "jsr:@std/assert@1.0.6";

import { isIterable, iterator } from "./iterator.ts";

Deno.test(`iterator()`, async (t) => {
  const testCases = [
    { input: [], expected: [] },
    { input: [1, 2, 3], expected: [1, 2, 3] },
    { input: [`1`, `2`, `3`], expected: [`1`, `2`, `3`] },
    { input: [], expected: [] },
    { input: new Set([1, 2, 3]), expected: [1, 2, 3] },
    { input: new Set([`1`, `2`, `3`]), expected: [`1`, `2`, `3`] },
    { input: new Map(), expected: [] },
    { input: new Map([[`1`, 1], [`2`, 2], [`3`, 3]]), expected: [[`1`, 1], [`2`, 2], [`3`, 3]] },
    { input: iterator([]), expected: [] },
    { input: iterator([1, 2, 3]), expected: [1, 2, 3] },
    { input: iterator([`1`, `2`, `3`]), expected: [`1`, `2`, `3`] },
  ];

  for (const testCase of testCases) {
    await t.step(`Test case "${JSON.stringify(testCase.input)}"`, () => {
      assertEquals([...iterator(testCase.input)], testCase.expected);
    });
  }
});

Deno.test(`isIterable()`, async (t) => {
  const testCases = [
    { input: undefined, expected: false },
    { input: null, expected: false },
    { input: 0, expected: false },
    { input: 1, expected: false },
    { input: 1.23, expected: false },
    { input: true, expected: false },
    { input: false, expected: false },
    { input: ``, expected: false },
    { input: `abc`, expected: false },
    { input: {}, expected: false },
    { input: new Object(), expected: false },
    { input: [], expected: true },
    { input: [1, 2, 3], expected: true },
    { input: iterator([]), expected: true },
    { input: new Set(), expected: true },
    { input: new Map(), expected: true },
  ];

  for (const testCase of testCases) {
    await t.step(`Test case "${testCase.input}"`, () => {
      assertEquals(isIterable(testCase.input), testCase.expected);
    });
  }
});
