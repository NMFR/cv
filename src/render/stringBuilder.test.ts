import { assertEquals, assertThrows } from "@std/assert";

import { StringBuilder } from "./stringBuilder.ts";
import { iterator } from "./iterator.ts";

Deno.test(`StringBuilder`, async (t) => {
  await t.step(`toString()`, (t) => {
    const builder = new StringBuilder();

    assertThrows(() => {
      builder.toString();
    });
  });

  await t.step(`getString() doc example`, async (t) => {
    const builder = new StringBuilder();

    builder.add(`a `);
    builder.add(Promise.resolve(`bb `));
    builder.add([`ccc `, `ddd `]);
    builder.add(new StringBuilder([`ee `, Promise.resolve(`f`)]));

    const text = await builder.getString();

    assertEquals(text, "a bb ccc ddd ee f");
  });

  await t.step(`getString()`, async (t) => {
    const testCases = {
      "empty": { fragments: [], expected: `` },
      "empty string": { fragments: [``], expected: `` },
      "multiple empty strings": { fragments: [``, ``], expected: `` },
      "undefined": { fragments: [undefined], expected: `` },
      "multiple undefined": { fragments: [undefined, undefined], expected: `` },
      "null": { fragments: [null], expected: `` },
      "multiple null": { fragments: [null, null], expected: `` },
      "empty array": { fragments: [[]], expected: `` },
      "multiple empty array": { fragments: [[], []], expected: `` },
      "empty iterator": { fragments: [iterator([])], expected: `` },
      "multiple empty iterator": { fragments: [iterator([]), iterator([])], expected: `` },
      "mix of empty string, undefined, null, nested array and iterator": {
        fragments: [
          ``,
          undefined,
          null,
          [],
          [``, undefined, null, [], [``, undefined, null, []]],
          iterator([iterator([``, undefined, null, []])]),
        ],
        expected: ``,
      },
      "empty string promise": { fragments: [Promise.resolve(``)], expected: `` },
      "undefined promise": { fragments: [Promise.resolve(undefined)], expected: `` },
      "null promise": { fragments: [Promise.resolve(null)], expected: `` },
      "empty array promise": { fragments: [Promise.resolve([])], expected: `` },
      "mix of empty promises": {
        fragments: [Promise.resolve(``), Promise.resolve(undefined), Promise.resolve(null), Promise.resolve([])],
        expected: ``,
      },
      "mix of nested empty promises": {
        fragments: [
          Promise.resolve(``),
          Promise.resolve(undefined),
          Promise.resolve(null),
          Promise.resolve([``, undefined, null, [], Promise.resolve(``), Promise.resolve([``, undefined, null, []])]),
        ],
        expected: ``,
      },
      "empty StringBuilder": { fragments: [new StringBuilder([])], expected: `` },
      "empty string StringBuilder": { fragments: [new StringBuilder([``])], expected: `` },
      "undefined StringBuilder": { fragments: [new StringBuilder([undefined])], expected: `` },
      "null StringBuilder": { fragments: [new StringBuilder([null])], expected: `` },
      "nested empty StringBuilder": { fragments: [new StringBuilder([new StringBuilder([``])])], expected: `` },
      "nested StringBuilder and empty string": {
        fragments: [new StringBuilder([``, new StringBuilder([``])])],
        expected: ``,
      },
      "mix of empty StringBuilder": {
        fragments: [new StringBuilder([``, undefined, null, [], new StringBuilder([``, undefined, null, []])])],
        expected: ``,
      },
      "all nested empty values": {
        fragments: [
          ``,
          undefined,
          null,
          [],
          Promise.resolve(``),
          Promise.resolve(undefined),
          Promise.resolve(null),
          Promise.resolve([]),
          new StringBuilder([]),
          new StringBuilder([``]),
          new StringBuilder([undefined]),
          new StringBuilder([null]),
          new StringBuilder([[]]),
          [
            ``,
            undefined,
            null,
            Promise.resolve(``),
            Promise.resolve(undefined),
            Promise.resolve(null),
            Promise.resolve([]),
            new StringBuilder([]),
            new StringBuilder([``]),
            new StringBuilder([undefined]),
            new StringBuilder([null]),
            new StringBuilder([[]]),
          ],
          Promise.resolve([
            ``,
            undefined,
            null,
            Promise.resolve(``),
            Promise.resolve(undefined),
            Promise.resolve(null),
            Promise.resolve([]),
            new StringBuilder([]),
            new StringBuilder([``]),
            new StringBuilder([undefined]),
            new StringBuilder([null]),
            new StringBuilder([[]]),
          ]),
          new StringBuilder([
            ``,
            undefined,
            null,
            Promise.resolve(``),
            Promise.resolve(undefined),
            Promise.resolve(null),
            Promise.resolve([]),
            new StringBuilder([]),
            new StringBuilder([``]),
            new StringBuilder([undefined]),
            new StringBuilder([null]),
            new StringBuilder([[]]),
          ]),
        ],
        expected: ``,
      },
      "single string": { fragments: [`a`], expected: `a` },
      "three strings": { fragments: [`a`, `b`, `c`], expected: `abc` },
      "strings with undefined and null": { fragments: [`a`, undefined, `b`, null, `c`, ``], expected: `abc` },
      "array with single string": { fragments: [[`a`]], expected: `a` },
      "array with two strings": { fragments: [[`a`, `b`]], expected: `ab` },
      "string and string array": { fragments: [[`a`, `b`], `c`], expected: `abc` },
      "multiple string arrays": { fragments: [[`a`, `b`], [`c`]], expected: `abc` },
      "nested string arrays": { fragments: [[`a`, [`b`, [`c`]]]], expected: `abc` },
      "nested array with strings, undefined and null": {
        fragments: [[`a`, undefined, [null, `b`, undefined, [null, `c`, undefined], null, ``], null], null],
        expected: `abc`,
      },
      "iterator with single string": { fragments: [iterator([`a`])], expected: `a` },
      "iterator with two strings": { fragments: [iterator([`a`, `b`])], expected: `ab` },
      "string and string iterator": { fragments: [iterator([`a`, `b`]), `c`], expected: `abc` },
      "multiple string iterator": { fragments: [iterator([`a`, `b`]), iterator([`c`])], expected: `abc` },
      "nested string iterator": { fragments: [iterator([`a`, iterator([`b`, iterator([`c`])])])], expected: `abc` },
      "nested iterator with strings, undefined and null": {
        fragments: [
          iterator([
            `a`,
            undefined,
            iterator([null, `b`, undefined, iterator([null, `c`, undefined]), null, ``]),
            null,
          ]),
          null,
        ],
        expected: `abc`,
      },
      "string promise": { fragments: [Promise.resolve(`a`)], expected: `a` },
      "nested string array promise": {
        fragments: [Promise.resolve([`a`, `b`, [`c`], Promise.resolve(`d`)])],
        expected: `abcd`,
      },
      "string StringBuilder": { fragments: [new StringBuilder([`a`])], expected: `a` },
      "nested string StringBuilder": {
        fragments: [new StringBuilder([`a`, `b`, [`c`], new StringBuilder([`d`])])],
        expected: `abcd`,
      },
      "multiple nested values": {
        fragments: [
          undefined,
          `a a`,
          iterator([`b`, `b`]),
          null,
          [
            `ccc`,
            Promise.resolve(`dd dd`),
            null,
            Promise.resolve([
              null,
              `ee e ee`,
              Promise.resolve(`fff f ff`),
              new StringBuilder([``, `gg g gg`, undefined, [`hh  `, iterator([`h`, `  hh`])], Promise.resolve(`ii`)]),
            ]),
          ],
          Promise.resolve(`jj`),
          Promise.resolve([
            null,
            `k`,
            Promise.resolve(iterator([`ll`])),
            undefined,
            new StringBuilder([`mm`, Promise.resolve(`nn`)]),
          ]),
          new StringBuilder([]),
          new StringBuilder([undefined, `oo`, null]),
          new StringBuilder([[
            [`pp`],
            Promise.resolve(`qq`),
            new StringBuilder([`rr`, new StringBuilder([Promise.resolve(`ss`)])]),
          ]]),
        ],
        expected: `a abbcccdd ddee e eefff f ffgg g gghh  h  hhiijjkllmmnnooppqqrrss`,
      },
    };

    for (const [testName, testCase] of Object.entries(testCases)) {
      await t.step(testName, async () => {
        const builder = new StringBuilder();

        for (const fragment of testCase.fragments) {
          builder.add(fragment);
        }

        const text = await builder.getString();

        assertEquals(text, testCase.expected);
      });
    }
  });
});
