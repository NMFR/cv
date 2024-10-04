import { assertEquals, assertThrows } from "jsr:@std/assert@1.0.6";

import { StringBuilder } from "./stringBuilder.ts";

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
      { fragments: [undefined], expected: `` },
      { fragments: [null], expected: `` },
      { fragments: [`a`], expected: `a` },
      { fragments: [`a`, `b`], expected: `ab` },
      { fragments: [`a`, `b`, []], expected: `ab` },
    ];

    for (const testCase of testCases) {
      const builder = new StringBuilder();

      for (const fragment of testCase.fragments) {
        builder.add(fragment);
      }

      const text = await builder.getString();

      assertEquals(text, testCase.expected);
    }
  });
});
