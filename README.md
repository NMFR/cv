# CV

Generate a CV (Curriculum Vitae) using [jsonresume](https://jsonresume.org/).

The CV contents are present in the [`cv.json`](./cv.json) file.

## Getting started

From within the [container](./Dockerfile) the following commands can be run:

-   Display available commands:

    ```sh
    make help
    ```

-   Generate the CV in HTML format:

    ```sh
    make generate-html
    ```

    The CV contents are read from [`cv.json`](./cv.json) and generated to [`generated/cv.html`](./generated/cv.html).

-   Spell check the HTML generated CV:

    ```sh
    make spell-check
    ```

    The CV HTML file will be generated by this command.
    Spell check errors MUST be fixed in the [`cv.json`](./cv.json) file or an exclude entry added in the [`spell-check-exclude.dic`](./spell-check-exclude.dic) dictionary file.

-   Format the [`spell-check-exclude.dic`](./spell-check-exclude.dic) dictionary file used to exclude spell checker errors:

    ```sh
    make spell-check-format-exclude-file
    ```

    This will sort and remove duplicate lines from the file.

## Spell check

[Hunspell](http://hunspell.github.io/) is used to spell check the HTML generated CV.

[Hunspell](http://hunspell.github.io/) is very sensitive to the HTML formatting, particularly to HTML empty tags without the closing `/`.
If the HTML file is not complaint with the XHTML format, [Hunspell](http://hunspell.github.io/) will not properly parse the file.
To fix this, the HTML generated CV is formatted to XHTML with [tidy](https://linux.die.net/man/1/tidy) before being parsed by [Hunspell](http://hunspell.github.io/) to spell check its contents.

The [`spell-check-exclude.dic`](./spell-check-exclude.dic) dictionary file is used to exclude spell checker errors.
If [Hunspell](http://hunspell.github.io/) is reporting false spelling errors, add the words to this file to fix the errors.
The file uses the format defined [here](https://man.archlinux.org/man/hunspell.5.en).
