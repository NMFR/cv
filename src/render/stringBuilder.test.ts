import { assertEquals, assertThrows } from "jsr:@std/assert@1.0.6";

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
    const testCases = [
      { fragments: [], expected: `` },
      { fragments: [``], expected: `` },
      { fragments: [``, ``], expected: `` },
      { fragments: [undefined], expected: `` },
      { fragments: [undefined, undefined], expected: `` },
      { fragments: [null], expected: `` },
      { fragments: [null, null], expected: `` },
      { fragments: [[]], expected: `` },
      { fragments: [[], []], expected: `` },
      { fragments: [iterator([])], expected: `` },
      { fragments: [iterator([]), iterator([])], expected: `` },
      { fragments: [``, undefined, null, [], [``, undefined, null, [], [``, undefined, null, []]]], expected: `` },
      { fragments: [Promise.resolve(``)], expected: `` },
      { fragments: [Promise.resolve(undefined)], expected: `` },
      { fragments: [Promise.resolve(null)], expected: `` },
      { fragments: [Promise.resolve([])], expected: `` },
      {
        fragments: [Promise.resolve(``), Promise.resolve(undefined), Promise.resolve(null), Promise.resolve([])],
        expected: ``,
      },
      {
        fragments: [
          Promise.resolve(``),
          Promise.resolve(undefined),
          Promise.resolve(null),
          Promise.resolve([``, undefined, null, [], Promise.resolve(``), Promise.resolve([``, undefined, null, []])]),
        ],
        expected: ``,
      },
      { fragments: [new StringBuilder([])], expected: `` },
      { fragments: [new StringBuilder([``])], expected: `` },
      { fragments: [new StringBuilder([undefined])], expected: `` },
      { fragments: [new StringBuilder([null])], expected: `` },
      { fragments: [new StringBuilder([new StringBuilder([``])])], expected: `` },
      { fragments: [new StringBuilder([``, new StringBuilder([``])])], expected: `` },
      {
        fragments: [new StringBuilder([``, undefined, null, [], new StringBuilder([``, undefined, null, []])])],
        expected: ``,
      },
      {
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
      { fragments: [`a`], expected: `a` },
      { fragments: [`a`, `b`], expected: `ab` },
      { fragments: [`a`, `b`, `c`], expected: `abc` },
      { fragments: [`a`, undefined, `b`, null, `c`], expected: `abc` },
      { fragments: [[`a`]], expected: `a` },
      { fragments: [[`a`, `b`]], expected: `ab` },
      { fragments: [[`a`, `b`], `c`], expected: `abc` },
      { fragments: [[`a`, `b`], [`c`]], expected: `abc` },
      { fragments: [[`a`], [`b`], [`c`]], expected: `abc` },
      { fragments: [[`a`, [`b`, [`c`]]]], expected: `abc` },
      {
        fragments: [[`a`, undefined, [null, `b`, undefined, [null, `c`, undefined], null], null], null],
        expected: `abc`,
      },
      { fragments: [Promise.resolve(`a`)], expected: `a` },
      { fragments: [Promise.resolve([`a`, `b`, [`c`], Promise.resolve(`d`)])], expected: `abcd` },
      { fragments: [new StringBuilder([`a`])], expected: `a` },
      { fragments: [new StringBuilder([`a`, `b`, [`c`], new StringBuilder([`d`])])], expected: `abcd` },
      {
        fragments: [
          undefined,
          `a a`,
          `bb`,
          null,
          [
            `ccc`,
            Promise.resolve(`dd dd`),
            null,
            Promise.resolve([
              null,
              `ee e ee`,
              Promise.resolve(`fff f ff`),
              new StringBuilder([``, `gg g gg`, undefined, [`hh  h  hh`], Promise.resolve(`ii`)]),
            ]),
          ],
          Promise.resolve(`jj`),
          Promise.resolve([
            null,
            `k`,
            Promise.resolve(`ll`),
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
    ];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];

      const builder = new StringBuilder();

      for (const fragment of testCase.fragments) {
        builder.add(fragment);
      }

      const text = await builder.getString();

      assertEquals(text, testCase.expected, `test case index: ${i}`);
    }
  });
});
