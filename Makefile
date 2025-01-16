.DEFAULT_GOAL := help

SHELL := /bin/bash
CI_CONTAINER_IMAGE_NAME ?= nmfr/cv

export PROJECT_ROOT=$(shell pwd)

# make help # Display available commands.
# Only comments starting with "# make " will be printed.
.PHONY: help
help:
	@egrep "^# make " [Mm]akefile | cut -c 3-

# make test # Run the unit tests.
.PHONY: test
test:
	@deno test

# make clean # Clean up the generated files.
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
	cp generated/cv.html gh-pages/index.html

# make watch-html-and-diff # Watch the './genereted/cv.html' file for changes and calculate the image difference from the `https://cv.nunorodrigues.tech/` deployed version of the CV. The difference is a file saved in `./generated/difference.png`. This requires `node`, `puppeteer` and `magick` to be installed. Use the Dockerfile.diff container to run this.
.PHONY: watch-html-and-diff
watch-html-and-diff:
	@LTIME=`0`; \
	while true ; do \
		ATIME=`stat -c %Z /opt/app/generated/cv.html || echo "0"`; \
		echo "checking if 'generated/cv.html' changed, ATIME: $$ATIME"; \
		if [[ "$$ATIME" != "$$LTIME" ]] ; then \
			echo "change detected, generating image diff from 'https://cv.nunorodrigues.tech/'"; \
			node src/html-to-image/index.js; \
			( \
				magick compare -fuzz 1% generated/current.hd.dark.png generated/new.hd.dark.png generated/difference.hd.dark.png & \
				magick compare -fuzz 1% generated/current.hd.light.png generated/new.hd.light.png generated/difference.hd.light.png & \
				magick compare -fuzz 1% generated/current.mobile.dark.png generated/new.mobile.dark.png generated/difference.mobile.dark.png & \
				magick compare -fuzz 1% generated/current.mobile.light.png generated/new.mobile.light.png generated/difference.mobile.light.png & \
			); \
			echo "diff generated: 'generated/difference.*.png'"; \
			LTIME=$$ATIME; \
		fi; \
		sleep 1; \
	done;

# make container run="<command>" # Run a command from inside the container. Examples: `make container run="make spell-check"`.
.PHONY: container
container:
# If caching is enabled attempt to pull the container from the registry to fill the cache before the build.
	[[ "$$USE_CONTAINER_CACHE" == "true" ]] && (docker pull $(CI_CONTAINER_IMAGE_NAME)) || true
	docker build --target ci --tag $(CI_CONTAINER_IMAGE_NAME) --cache-from=$(CI_CONTAINER_IMAGE_NAME) --build-arg BUILDKIT_INLINE_CACHE=1 .
	docker run -v "$(CURDIR):/opt/app" $(CI_CONTAINER_IMAGE_NAME) $(run)
