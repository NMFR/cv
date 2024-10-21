# CV

This repository generates the CV (Curriculum Vitae) present in https://cv.nunorodrigues.tech/.

Originally [Node.js](https://nodejs.org/en), [jsonresume](https://jsonresume.org/) and [jsonresume-theme-even](https://github.com/rbardini/jsonresume-theme-even) were used to generate the CV from a [`cv.yaml`](./cv.yaml) file.
This was replaced with [Deno](https://deno.com/) (as the Javascript / Typescript engine), [Javascript tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates) (replacing all dependencies) to generate the CV theme / template and a [`cv.ts`](src/cv.ts) file that uses a Typescript interface that loosely complies with the [jsonresume schema](https://jsonresume.org/schema).
The reason for the change was to:

-   Simplify.
-   Get rid of dependencies that often require updates due to vulnerability discovery.
-   Allow theme customization.

The CV contents are declared in the [`src/cv.ts`](src/cv.ts) file.
The CV theme / template is defined in [`src/render/html/html.ts`](src/render/html/html.ts).
The generated [`generated/cv.html`](generated/cv.html) output is formatted using `deno fmt`.
Static assets to be added to the generated HTML should be placed in the [`gh-pages`](gh-pages) folder.
[Github pages](https://pages.github.com/) is used to serve the CV HTML from the `gh-pages` branch on https://nmfr.github.io/cv.
The [Github pages](https://pages.github.com/) is configured to use https://cv.nunorodrigues.tech/ as a [custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages).

## Getting started

[VS Code](https://code.visualstudio.com/) + [development container](https://code.visualstudio.com/docs/remote/containers) is the recommended IDE.
The [development container](https://code.visualstudio.com/docs/remote/containers) comes with all the required tools installed.
If not using the recommended IDE make sure the following tools are installed:

-   [GNU Make](https://www.gnu.org/software/make/) version >= `4.3` (used as a task runner).
-   [Deno](https://deno.com/) version == `1.46.3`.
-   [tidy](https://linux.die.net/man/1/tidy) (required to format the HTML to a valid XML so the spell checker can parse it).
-   [Hunspell](https://hunspell.github.io/) (spell checker).

The following commands can be run:

-   Display available commands:

    ```sh
    make help
    ```

-   Generate the CV in HTML format:

    ```sh
    make generate-html
    ```

    The CV contents are read from [`src/cv.ts`](src/cv.ts) and generated to [`generated/cv.html`](./generated/cv.html).

-   Spell check the HTML generated CV:

    ```sh
    make spell-check
    ```

    The CV HTML file will be generated by this command.
    Spell check errors MUST be fixed in the [`src/cv.ts`](src/cv.ts) file or an exclude entry added in the [`spell-check-exclude.dic`](./spell-check-exclude.dic) dictionary file.

-   Format the [`spell-check-exclude.dic`](./spell-check-exclude.dic) dictionary file used to exclude spell checker errors:

    ```sh
    make format-spell-check-exclude-file
    ```

    This will sort and remove duplicate lines from the file.

## Spell check

[Hunspell](http://hunspell.github.io/) is used to spell check the HTML generated CV.

[Hunspell](http://hunspell.github.io/) is very sensitive to the HTML formatting, particularly to HTML empty tags without the closing `/`.
If the HTML file is not compliant with the XHTML format, [Hunspell](http://hunspell.github.io/) will not properly parse the file.
To fix this, the CV HTML file is formatted to XHTML with [tidy](https://linux.die.net/man/1/tidy) before being parsed by [Hunspell](http://hunspell.github.io/) to spell check its contents.

The [`spell-check-exclude.dic`](./spell-check-exclude.dic) dictionary file is used to exclude spell checker errors.
If [Hunspell](http://hunspell.github.io/) is reporting false spelling errors, add the words to this file to fix the errors.
The file uses the format defined [here](https://man.archlinux.org/man/hunspell.5.en).

## Diff

If using the recommended IDE ([development container](https://code.visualstudio.com/docs/remote/containers)) or the [`docker-compose.yaml`](docker-compose.yaml) directly the diff container ([`Dockerfile.diff`](Dockerfile.diff)) is running and listening to changes on the [`generated/cv.html`](./generated/cv.html) output file.
Any change to the output file will trigger a script that will produce an image difference between https://nmfr.github.io/cv and [`generated/cv.html`](./generated/cv.html).

Here is what the script will do every time the [`generated/cv.html`](./generated/cv.html) file is changed / re generated:

-   Use [puppeteer](https://pptr.dev/) to take a screenshot of the current version of the CV present in https://nmfr.github.io/cv.
    This screenshot is saved on the [`generated/current.png`](generated/current.png) file.
-   Use [puppeteer](https://pptr.dev/) to take a screenshot of the updated [`generated/cv.html`](./generated/cv.html).
    This screenshot is saved on the [`generated/this.png`](generated/this.png) file.
-   Use [ImageMagick](https://imagemagick.org/index.php) to create an image with the difference between the two screenshots.
    This image difference is saved on the [`generated/difference.png`](generated/difference.png) file.

Example:

-   https://nmfr.github.io/cv ([`generated/current.png`](generated/current.png)):

    ![generated/current.png](examples/diff/current.png)

-   [`generated/cv.html`](./generated/cv.html) ([`generated/this.png`](generated/this.png)):

    ![generated/this.png](examples/diff/this.png)

-   Difference ([`generated/difference.png`](generated/difference.png)):

    ![generated/difference.png](examples/diff/difference.png)

## Continuous integration

Every pull request made against `master` will trigger the [CI github workflow](.github/workflows/ci.yaml) to:

-   Run the unit tests.
-   Run the spell checker.

## Continuous delivery

Every push to `master` will trigger the [CD github workflow](.github/workflows/cd.yaml) to:

-   Generate the CV in HTML format.
-   Copy the generated assets to the [`gh-pages`](gh-pages) folder.
-   Push the contents of the [`gh-pages`](gh-pages) folder to the `gh-pages` branch root.

The `gh-pages` branch uses [Github pages](https://pages.github.com/) to expose the branch's content in https://nmfr.github.io/cv.
The content is also available in https://cv.nunorodrigues.tech/ as a [Github pages](https://pages.github.com/) custom domain.

Any additional static assets that should be exposed together with the CV should be placed in the [`gh-pages`](gh-pages) folder.
