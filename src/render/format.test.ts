import { assertEquals } from "@std/assert";

import { Location } from "../model.ts";
import { formatCountry, formatDate, formatPhone, formatURL } from "./format.ts";

Deno.test(`formatCountry()`, () => {
  interface TestCase {
    input: Location | null | undefined;
    expected: string | null | undefined;
  }

  const testCases: TestCase[] = [
    { input: undefined, expected: undefined },
    { input: null, expected: null },
    { input: { countryCode: `PT` }, expected: `Portugal` },
    { input: { countryCode: `ES` }, expected: `Spain` },
    { input: { countryCode: `UK` }, expected: `United Kingdom` },
    { input: { countryCode: `US` }, expected: `United States` },
    { input: { countryCode: `FR`, country: `Alternative name` }, expected: `France` },
  ];

  for (const testCase of testCases) {
    const country = formatCountry(testCase.input);

    assertEquals(country, testCase.expected);
  }
});

Deno.test(`formatDate()`, () => {
  const testCases = [
    { input: undefined, expected: undefined },
    { input: null, expected: null },
    { input: new Date(`2222-13-01`), expected: undefined },
    { input: new Date(`2020-01-01`), expected: `Jan 2020` },
    { input: new Date(`2021-06-20`), expected: `Jun 2021` },
    { input: new Date(`2022-12-30`), expected: `Dec 2022` },
  ];

  for (const testCase of testCases) {
    const date = formatDate(testCase.input);

    assertEquals(date, testCase.expected);
  }
});

Deno.test(`formatPhone()`, () => {
  const testCases = [
    { input: undefined, expected: undefined },
    { input: null, expected: null },
    { input: ``, expected: `` },
    { input: `+351123456789`, expected: `+351123456789` },
    { input: `   +351987654321    `, expected: `+351987654321` },
    { input: `+351 555 444 333`, expected: `+351555444333` },
    { input: `   +351 555 666 777   `, expected: `+351555666777` },
    { input: ` 99 88 77 `, expected: `998877` },
  ];

  for (const testCase of testCases) {
    const phone = formatPhone(testCase.input);

    assertEquals(phone, testCase.expected);
  }
});

Deno.test(`formatURL()`, () => {
  const testCases = [
    { input: undefined, expected: undefined },
    { input: null, expected: null },
    { input: ``, expected: `` },
    { input: `http://some.address`, expected: `some.address` },
    { input: `http://some.other.address/`, expected: `some.other.address` },
    { input: `https://some.address/some/path`, expected: `some.address/some/path` },
    { input: `https://some.other.address/some/path/`, expected: `some.other.address/some/path` },
    { input: `https://some.address/some/path/#id`, expected: `some.address/some/path/#id` },
    {
      input: `https://some.other.address/some/path/#id?query=string`,
      expected: `some.other.address/some/path/#id?query=string`,
    },
  ];

  for (const testCase of testCases) {
    const url = formatURL(testCase.input);

    assertEquals(url, testCase.expected);
  }
});
