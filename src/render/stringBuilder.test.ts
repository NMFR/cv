import { assertEquals, assertThrows } from "jsr:@std/assert@1.0.6";

import { StringBuilder } from "./stringBuilder.ts";

Deno.test(`StringBuilder`, async (t) => {
  await t.step(`toString()`, (t) => {
    const builder = new StringBuilder();

    assertThrows(() => {
      builder.toString();
    });
  });
});
