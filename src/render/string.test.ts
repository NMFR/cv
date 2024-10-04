import { assertEquals, assertThrows } from "jsr:@std/assert@1.0.6";

import { ensureNoDefaultToString, nonEmptyTaggedTemplate, taggedTemplate } from "./string.ts";

Deno.test(`ensureNoDefaultToString()`, async (t) => {
  await t.step(`valid`, async (t) => {
    const testCases = [
      ``,
      `   `,
      `a bb ccc dddd dddd eee ff h`,
      `a bb ccc
      dddd dddd
      eee ff h`,
      `   a bb ccc dddd dddd eee ff h   `,
      `aa bb cc [something] dd ee`,
      `aa bb cc [object something] dd ee`,
      `aa bb cc [something Object] dd ee`,
      `aa bb cc [something Promise] dd ee`,
      `aa bb cc [object  Object] dd ee`,
      `aa bb cc [object something Object] dd ee`,
      `aa bb cc [object something else Object] dd ee`,
      `aa bb cc [object  Promise] dd ee`,
      `aa bb cc [object something Promise] dd ee`,
      `aa bb cc [object something else Promise] dd ee`,
    ];

    for (const testCase of testCases) {
      await t.step(`Test case "${testCase}"`, () => {
        ensureNoDefaultToString(testCase);
      });
    }
  });

  await t.step(`invalid`, async (t) => {
    const testCases = [
      `${{}}`,
      `${new Object()}`,
      `${Promise.resolve(`a`)}`,
      `    ${{}}`,
      `${new Object()}     `,
      `aaa bbb ${Promise.resolve(`a`)}`,
      `${Promise.resolve(`a`)} cccc d`,
      `aaa bbb ${Promise.resolve(`a`)} cccc d`,
    ];

    for (const testCase of testCases) {
      await t.step(`Test case "${testCase}"`, () => {
        assertThrows(() => ensureNoDefaultToString(testCase));
      });
    }
  });
});

Deno.test(`taggedTemplate()`, async () => {
  interface TestCase {
    buildString: (t: typeof taggedTemplate) => ReturnType<typeof taggedTemplate>;
    expected: string;
  }

  const testCases: TestCase[] = [
    { buildString: (t) => t``, expected: `` },
    { buildString: (t) => t`  `, expected: `  ` },
    { buildString: (t) => t`aaa bb ccccc`, expected: `aaa bb ccccc` },
    {
      buildString: (t) =>
        t`aaa
      bb ccccc`,
      expected: `aaa
      bb ccccc`,
    },
    { buildString: (t) => t`aaa ${"bb"} ccccc`, expected: `aaa bb ccccc` },
    { buildString: (t) => t`aaa ${Promise.resolve("bb")} ccccc`, expected: `aaa bb ccccc` },
    { buildString: (t) => t`aaa ${t`bb`} ccccc`, expected: `aaa bb ccccc` },
    { buildString: (t) => t`aaa ${t`${"bb"} ${Promise.resolve("ccccc")}`}`, expected: `aaa bb ccccc` },
    {
      buildString: (t) => t`aaa ${t`${"bb"} ${Promise.resolve("ccccc")} ${t`${Promise.resolve("ddddd")}`}`}`,
      expected: `aaa bb ccccc ddddd`,
    },
    { buildString: (t) => t`aaa ${["bb", "cc"]} ccccc`, expected: `aaa bbcc ccccc` },
    {
      buildString: (t) => t`${"aaa"} ${["bb", "cc"]} ${Promise.resolve("ccccc")} ${t`ddd ${"eeee"} fff`}`,
      expected: `aaa bbcc ccccc ddd eeee fff`,
    },
  ];

  for (const testCase of testCases) {
    const template = testCase.buildString(taggedTemplate);
    const result = await template.getString();

    assertEquals(result, testCase.expected);
  }
});

Deno.test(`nonEmptyTaggedTemplate()`, async () => {
  interface TestCase {
    buildString: (t: typeof nonEmptyTaggedTemplate) => ReturnType<typeof nonEmptyTaggedTemplate>;
    expected: string;
  }

  const testCases: TestCase[] = [
    { buildString: (t) => t``, expected: `` },
    { buildString: (t) => t`  `, expected: `  ` },
    { buildString: (t) => t`aaa bb ccccc`, expected: `aaa bb ccccc` },
    {
      buildString: (t) =>
        t`aaa
      bb ccccc`,
      expected: `aaa
      bb ccccc`,
    },
    { buildString: (t) => t`aaa ${"bb"} ccccc`, expected: `aaa bb ccccc` },
    { buildString: (t) => t`aaa ${Promise.resolve("bb")} ccccc`, expected: `aaa bb ccccc` },
    { buildString: (t) => t`aaa ${["bb", "cc"]} ccccc`, expected: `aaa bbcc ccccc` },
    { buildString: (t) => t`${undefined}`, expected: `` },
    { buildString: (t) => t`${null}`, expected: `` },
    { buildString: (t) => t`  ${undefined}   `, expected: `` },
    { buildString: (t) => t`  ${null}   `, expected: `` },
    { buildString: (t) => t`aa bb ${undefined}`, expected: `` },
    { buildString: (t) => t`aa bb ${null}`, expected: `` },
    { buildString: (t) => t`${undefined} cccc ddd`, expected: `` },
    { buildString: (t) => t`${null} cccc ddd`, expected: `` },
    { buildString: (t) => t`aa bb ${undefined} cccc ddd`, expected: `` },
    { buildString: (t) => t`aa bb ${null} cccc ddd`, expected: `` },
    { buildString: (t) => t`aa bb ${undefined} cccc ${null} ddd`, expected: `` },
    { buildString: (t) => t`aa bb ${"bb"} ${undefined} cccc ${null} ddd`, expected: `` },
    { buildString: (t) => t`aa bb ${undefined} cc ${"bb"} cc ${null} ddd`, expected: `` },
    { buildString: (t) => t`aa bb ${undefined} cccc ${null} d ${"bb"} dd`, expected: `` },
    { buildString: (t) => t`aa bb ${undefined} cccc d ${"bb"} dd`, expected: `` },
    { buildString: (t) => t`aa bb cccc ${null} d ${"bb"} dd`, expected: `` },
  ];

  for (const testCase of testCases) {
    const template = testCase.buildString(nonEmptyTaggedTemplate);
    const result = await template.getString();

    assertEquals(result, testCase.expected);
  }
});
