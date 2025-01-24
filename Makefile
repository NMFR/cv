.DEFAULT_GOAL := help

SHELL := /bin/bash
PWD := $(shell pwd)
CI_CONTAINER_IMAGE_NAME ?= nmfr/cv

# make help # Display available commands.
# Only comments starting with "# make " will be printed.
.PHONY: help
help:
	@egrep "^# make " [Mm]akefile | cut -c 3-

# make test # Run the unit tests.
.PHONY: test
test:
	@deno test

# make clean # Clean up the generated files (`./generated/`).
.PHONY: clean
clean:
	@rm -rf generated
	@mkdir -p generated
	@chmod o+rw generated

# make generate-html # Generate the CV in HTML format.
.PHONY: generate-html
generate-html: clean
	ln -s ${PWD}/gh-pages/* ${PWD}/generated/
	deno run --allow-read=src/render/html/css/,src/render/html/icons/ src/render-html.ts > ./generated/cv.html
	deno fmt --unstable-html ./generated/cv.html
# convert the cv.html to cv.pdf
# missing the --deny-read="/home/dev/.ssh" due to root read bug (https://github.com/denoland/deno/issues/27622).
	deno run --allow-read --allow-write="/tmp/,${PWD}/generated/" --allow-run="/usr/bin/google-chrome-stable" --allow-net --allow-env --allow-sys="homedir" src/html-to-pdf.ts "file://${PWD}/generated/cv.html" generated/cv.pdf

# make generate-html-with-diff # Generate the CV in HTML format and generate the visual difference between the deployed version (`https://cv.nunorodrigues.tech/`) and the current changes (`./generated/*`).
.PHONY: generate-html-with-diff
generate-html-with-diff: generate-html
	echo "generating image diff"; \
	deno run --allow-read --allow-write="/tmp/,${PWD}/generated/" --allow-run="/usr/bin/google-chrome-stable" --allow-net --allow-env --allow-sys="homedir" src/diff.ts; \
	( \
		magick compare -fuzz 1% generated/current.hd.dark.png generated/new.hd.dark.png generated/difference.hd.dark.png & \
		magick compare -fuzz 1% generated/current.hd.light.png generated/new.hd.light.png generated/difference.hd.light.png & \
		magick compare -fuzz 1% generated/current.mobile.dark.png generated/new.mobile.dark.png generated/difference.mobile.dark.png & \
		magick compare -fuzz 1% generated/current.mobile.light.png generated/new.mobile.light.png generated/difference.mobile.light.png & \
		magick -density 300 generated/current.pdf -quality 100 -append -background none -alpha off generated/current.pdf.png & \
		magick -density 300 generated/new.pdf -quality 100 -append -background none -alpha off generated/new.pdf.png \
	); \
	# Wait 1 second for the *.pdf.png files to flush. \
	sleep 1; \
	magick compare -fuzz 1% generated/current.pdf.png generated/new.pdf.png generated/difference.pdf.png; \
	echo "diff generated: 'generated/difference.*.png'";

# make spell-check # Spell check the CV HTML file.
.PHONY: spell-check
spell-check: generate-html
	tidy -o generated/cv.tidy.html -i -asxml -q --show-warnings false generated/cv.html | exit 0
	@SPELL_CHECK_RESULT=$$(hunspell -d en_US -l -H -p spell-check-exclude.dic generated/cv.tidy.html) && \
	rm generated/cv.tidy.html && \
	(([[ $${SPELL_CHECK_RESULT} == "" ]] && echo "No spelling errors found.") || \
	(echo -e "Spelling errors found:\n\n$${SPELL_CHECK_RESULT}\n" && exit 1))

# make spell-check-readme # Spell check the README.md file.
.PHONY: spell-check-readme
spell-check-readme:
	@SPELL_CHECK_RESULT=$$(hunspell -d en_US -l -H -p spell-check-exclude.dic README.md) && \
	(([[ $${SPELL_CHECK_RESULT} == "" ]] && echo "No spelling errors found.") || \
	(echo -e "Spelling errors found:\n\n$${SPELL_CHECK_RESULT}\n" && exit 1))

# make format-spell-check-exclude-file # Format the spell-check-exclude.dic file used to exclude spell checker errors. This will sort and remove duplicate lines from the file.
.PHONY: format-spell-check-exclude-file
format-spell-check-exclude-file:
	SPELL_CHECK_FORMAT_RESULT=$$(cat spell-check-exclude.dic | egrep . | sort | uniq) && echo "$${SPELL_CHECK_FORMAT_RESULT}" > spell-check-exclude.dic

# make prepare-gh-pages # Prepare the gh-pages folder to be deployed. This will copy the generated CV to the gh-pages folder making sure the HTML file is renamed to "index.html". Note that this command expects the contents of the `generated` folder to already be generated.
.PHONY: prepare-gh-pages
prepare-gh-pages:
	find generated/* -depth -type f -o -type d | xargs -I % cp -n % gh-pages/

# make container run="<command>" # Run a command from inside the container. Examples: `make container run="make spell-check"`.
.PHONY: container
container:
# If caching is enabled attempt to pull the container from the registry to fill the cache before the build.
	[[ "$$USE_CONTAINER_CACHE" == "true" ]] && (docker pull $(CI_CONTAINER_IMAGE_NAME)) || true
	docker build --target ci --tag $(CI_CONTAINER_IMAGE_NAME) --cache-from=$(CI_CONTAINER_IMAGE_NAME) --build-arg BUILDKIT_INLINE_CACHE=1 .
	docker run --init -v "$(CURDIR):/opt/app" $(CI_CONTAINER_IMAGE_NAME) $(run)
