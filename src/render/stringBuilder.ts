function* flatten(list: unknown[]): Generator {
  for (const item of list) {
    if (Array.isArray(item)) {
      yield* flatten(item);
    } else {
      yield item;
    }
  }
}

export class StringBuilder {
  static fromTaggedTemplate(strings: TemplateStringsArray, ...values: unknown[]) {
    const fragments: unknown[] = [strings[0]];

    for (let i = 0; i < values.length; i += 1) {
      fragments.push(values[i]);
      fragments.push(strings[i + 1]);
    }

    return new StringBuilder(fragments);
  }

  private fragments: unknown[] = [];

  constructor(fragments: unknown[] = []) {
    this.fragments = [...fragments];
  }

  private *iterateFragments(): Generator {
    for (const fragment of flatten(this.fragments)) {
      if (fragment instanceof StringBuilder) {
        yield* fragment.iterateFragments();
      } else {
        yield fragment;
      }
    }
  }

  add(value: unknown) {
    this.fragments.push(value);
  }

  toString(): string {
    throw new Error(`StringBuilder \`toString()\` should not be called, call \`generateString()\` instead`);
  }

  async generateString(): Promise<string> {
    const strings: string[] = [];

    for (let fragment of this.iterateFragments()) {
      if (fragment instanceof Promise) {
        fragment = await fragment;
      }

      strings.push(typeof fragment === `string` ? fragment : `${fragment}`);
    }

    return strings.join(``);
  }
}
