import { assertEquals } from "jsr:@std/assert@1.0.6";

import { isIterable, iterator } from "./iterator.ts";

Deno.test(`iterator()`, async (t) => {
});

Deno.test(`isIterable()`, async (t) => {
  const testCases = [
    { input: undefined, expected: false },
    { input: null, expected: false },
    { input: 0, expected: false },
    { input: 1, expected: false },
    { input: ``, expected: false },
    { input: {}, expected: false },
    { input: new Object(), expected: false },
    { input: [], expected: true },
    { input: [1, 2, 3], expected: true },
    { input: iterator([]), expected: true },
    { input: new Set(), expected: false },
    { input: new Map(), expected: true },
  ];

  for (const testCase of testCases) {
    await t.step(`Test case "${testCase.input}"`, () => {
      assertEquals(isIterable(testCase.input), testCase.expected);
    });
  }
});
