import { assertEquals, assertThrows } from "jsr:@std/assert@1.0.6";

import { ensureNoDefaultToString, nonEmptyTaggedTemplate, taggedTemplate } from "./string.ts";
import { iterator } from "./iterator.ts";

Deno.test(`ensureNoDefaultToString()`, async (t) => {
  await t.step(`valid`, () => {
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
      `aa bb cc [something Generator] dd ee`,
      `aa bb cc [something Set] dd ee`,
      `aa bb cc [something Map] dd ee`,
      `aa bb cc [object  Object] dd ee`,
      `aa bb cc [object something Object] dd ee`,
      `aa bb cc [object something else Object] dd ee`,
      `aa bb cc [object  Promise] dd ee`,
      `aa bb cc [object  Generator] dd ee`,
      `aa bb cc [object  Set] dd ee`,
      `aa bb cc [object  Map] dd ee`,
      `aa bb cc [object something Promise] dd ee`,
      `aa bb cc [object something Generator] dd ee`,
      `aa bb cc [object something Set] dd ee`,
      `aa bb cc [object something Map] dd ee`,
      `aa bb cc [object something else Promise] dd ee`,
      `aa bb cc [object something else Generator] dd ee`,
      `aa bb cc [object something else Set] dd ee`,
      `aa bb cc [object something else Map] dd ee`,
    ];

    for (const testCase of testCases) {
      ensureNoDefaultToString(testCase);
    }
  });

  await t.step(`invalid`, () => {
    const testCases = [
      {},
      new Object(),
      Promise.resolve(`a`),
      iterator([]),
      new Set(),
      new Map(),
    ].map((v) => [
      `${v}`,
      `    ${v}`,
      `${v}    `,
      `    ${v}    `,
      `aaa ${v}`,
      `${v} bbb`,
      `aaa ${v} bbb`,
      `aaa bbb ${v} cccc d`,
      `aaa bbb${v}cccc d`,
      `aaa bbb
${v}cccc d`,
      `aaa bbb${v}
cccc d`,
      `aaa bbb
${v}
cccc d`,
    ]).flat().concat([
      `aaa ${{}} bbb ${new Object()} cccc ${Promise.resolve(`a`)} d ${iterator([])} eeee`,
    ]);

    for (const testCase of testCases) {
      assertThrows(() => ensureNoDefaultToString(testCase));
    }
  });
});

Deno.test(`taggedTemplate()`, async (t) => {
  interface TestCase {
    buildString: (t: typeof taggedTemplate) => ReturnType<typeof taggedTemplate>;
    expected: string;
  }

  const testCases: { [name: string]: TestCase } = {
    "empty string": { buildString: (t) => t``, expected: `` },
    "whitespace string": {
      buildString: (t) =>
        t`
         `,
      expected: `
         `,
    },
    "string": { buildString: (t) => t`aaa bb ccccc`, expected: `aaa bb ccccc` },
    "multiline string": {
      buildString: (t) =>
        t`aaa
      bb ccccc`,
      expected: `aaa
      bb ccccc`,
    },
    "undefined": { buildString: (t) => t`aaa ${undefined} ccccc`, expected: `aaa  ccccc` },
    "null": { buildString: (t) => t`aaa ${null} ccccc`, expected: `aaa  ccccc` },
    "empty string value": { buildString: (t) => t`aaa ${``} ccccc`, expected: `aaa  ccccc` },
    "string value": { buildString: (t) => t`aaa ${`bb`} ccccc`, expected: `aaa bb ccccc` },
    "multiple string value": { buildString: (t) => t`${`aaa`} ${`bb`} ${`ccccc`}`, expected: `aaa bb ccccc` },
    "array value:": {
      buildString: (t) => t`aaa${[` `, undefined, `bb`, null, ` `, ``]}ccccc`,
      expected: `aaa bb ccccc`,
    },
    "array nested values:": {
      buildString: (t) => t`${[`aaa`, [` `], iterator([`bb`]), Promise.resolve(` `), t`ccccc`]}`,
      expected: `aaa bb ccccc`,
    },
    "iterator value:": {
      buildString: (t) => t`aaa${iterator([` `, undefined, `bb`, null, ` `, ``])}ccccc`,
      expected: `aaa bb ccccc`,
    },
    "iterator nested values:": {
      buildString: (t) => t`${iterator([`aaa`, [` `], iterator([`bb`]), Promise.resolve(` `), t`ccccc`])}`,
      expected: `aaa bb ccccc`,
    },
    "promise value": { buildString: (t) => t`aaa ${Promise.resolve(`bb`)} ccccc`, expected: `aaa bb ccccc` },
    "promise nested values": {
      buildString: (t) => t`${Promise.resolve([`aaa`, [` `], iterator([`bb`]), Promise.resolve(` `), t`ccccc`])}`,
      expected: `aaa bb ccccc`,
    },
    "taggedTemplate value": { buildString: (t) => t`aaa ${t`bb`} ccccc`, expected: `aaa bb ccccc` },
    "taggedTemplate nested values": {
      buildString: (t) => t`${[`aaa`, [` `], iterator([`bb`]), Promise.resolve(` `), t`ccccc`]}`,
      expected: `aaa bb ccccc`,
    },
    "multiple value combinations": {
      buildString: (t) =>
        t`aaa ${undefined}${null}${``}${[]}${iterator([])}${Promise.resolve(``)}${t``}${`bb`} ccccc ${[
          undefined,
          null,
          ``,
          `dddd`,
        ]} ${iterator([undefined, null, ``, `ee`])} ${Promise.resolve(`fff`)} ${t`gg`}`,
      expected: `aaa bb ccccc dddd ee fff gg`,
    },
    "multiple nested value combinations": {
      buildString: (t) =>
        t`aaa ${undefined}${null}${``}${[]}${iterator([])}${Promise.resolve(``)}${t``}${`bb`} ccccc ${[
          undefined,
          null,
          ``,
          `dddd`,
          [],
          [undefined, null, ``, ` `, `ee`, iterator([` `, `fff`]), Promise.resolve([` `, t`gg`]), t` `],
          iterator([]),
          iterator([]),
        ]}${
          iterator([
            undefined,
            null,
            ``,
            `hhh`,
            [],
            [undefined, null, ``, ` `, `i`, iterator([` `, `jjj`]), Promise.resolve([` `, t`k`]), t` `],
            iterator([]),
            iterator([]),
          ])
        }${
          Promise.resolve([
            undefined,
            null,
            ``,
            `ll`,
            [],
            [undefined, null, ``, ` `, `mm`, iterator([` `, `nnn`]), Promise.resolve([` `, t`o`]), t` `],
            iterator([]),
            iterator([]),
          ])
        }${t`${undefined}${null}${``}${`q`}${[]}${[
          undefined,
          null,
          ``,
          ` `,
          `r`,
          iterator([` `, `s`]),
          Promise.resolve([` `, t`t`]),
          t` `,
        ]}${iterator([])}${iterator([])}`}`,
      expected: `aaa bb ccccc dddd ee fff gg hhh i jjj k ll mm nnn o q r s t `,
    },
  };

  for (const [testName, testCase] of Object.entries(testCases)) {
    await t.step(testName, async () => {
      const template = testCase.buildString(taggedTemplate);
      const result = await template.getString();

      assertEquals(result, testCase.expected);
    });
  }
});

Deno.test(`nonEmptyTaggedTemplate()`, async (t) => {
  interface TestCase {
    buildString: (t: typeof nonEmptyTaggedTemplate) => ReturnType<typeof nonEmptyTaggedTemplate>;
    expected: string;
  }

  const testCases: { [name: string]: TestCase } = {
    "empty": { buildString: (t) => t``, expected: `` },
    "whitespace string": {
      buildString: (t) =>
        t`
         `,
      expected: `
         `,
    },
    "string": { buildString: (t) => t`aaa bb ccccc`, expected: `aaa bb ccccc` },
    "multiline string": {
      buildString: (t) =>
        t`aaa
      bb ccccc`,
      expected: `aaa
      bb ccccc`,
    },
    "string value": { buildString: (t) => t`aaa ${"bb"} ccccc`, expected: `aaa bb ccccc` },
    "undefined value": { buildString: (t) => t`a ${undefined} b`, expected: `` },
    "null value": { buildString: (t) => t`a ${null} b`, expected: `` },
    "empty string value": { buildString: (t) => t`a ${``} b`, expected: `` },
    "empty array value": { buildString: (t) => t`a ${[]} b`, expected: `` },
    "array value": { buildString: (t) => t`a${[` `, `b`, ` `]}c`, expected: `a b c` },
    "array with undefined value": { buildString: (t) => t`a${[` `, undefined, ` `]}c`, expected: `` },
    "array with null value": { buildString: (t) => t`a${[` `, null, ` `]}c`, expected: `` },
    "array with empty string value": { buildString: (t) => t`a${[` `, ``, ` `]}c`, expected: `` },
    "empty iterator": { buildString: (t) => t`a ${iterator([])} c`, expected: `` },
    "iterator value": { buildString: (t) => t`a${iterator([` `, `b`, ` `])}c`, expected: `a b c` },
    "iterator with undefined value": { buildString: (t) => t`a${iterator([` `, undefined, ` `])}c`, expected: `` },
    "iterator with null value": { buildString: (t) => t`a${iterator([` `, null, ` `])}c`, expected: `` },
    "iterator with empty string value": { buildString: (t) => t`a${iterator([` `, ``, ` `])}c`, expected: `` },
    "promise value": { buildString: (t) => t`a${Promise.resolve([` `, `b`, ` `])}c`, expected: `a b c` },
    "promise with undefined value": {
      buildString: (t) => t`a${Promise.resolve([` `, undefined, ` `])}c`,
      expected: ``,
    },
    "promise with null value": { buildString: (t) => t`a${Promise.resolve([` `, null, ` `])}c`, expected: `` },
    "promise with empty string value": { buildString: (t) => t`a${Promise.resolve([` `, ``, ` `])}c`, expected: `` },
    "promise with empty array value": { buildString: (t) => t`a ${Promise.resolve([])} c`, expected: `` },
    "promise with empty iterator value": { buildString: (t) => t`a ${Promise.resolve(iterator([]))} c`, expected: `` },
  };

  for (const [testName, testCase] of Object.entries(testCases)) {
    await t.step(testName, async () => {
      const template = testCase.buildString(nonEmptyTaggedTemplate);
      const result = await template.getString();

      assertEquals(result, testCase.expected);
    });
  }
});
