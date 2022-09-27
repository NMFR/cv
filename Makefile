.DEFAULT_GOAL := help

SHELL := /bin/bash
DOCKER_IMAGE_NAME ?= nmfr/cv

export PROJECT_ROOT=$(shell pwd)

# make help # Display available commands.
# Only comments starting with "# make " will be printed.
.PHONY: help
help:
	@egrep "^# make " [Mm]akefile | cut -c 3-

# make generate-html # Generate the CV in HTML format.
.PHONY: generate-html
generate-html:
	@mkdir -p generated
	npm install
	npm run export-html

# make clean # Clean up the generated files.
.PHONY: clean
clean:
	@rm -rf generated
	@mkdir -p generated

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
	hunspell -d en_US -l -H -p spell-check-exclude.dic README.md

# make spell-check-format-exclude-file # Format the spell-check-exclude.dic file used to exclude spell checker errors. This will sort and remove duplicate lines from the file.
.PHONY: spell-check-format-exclude-file
spell-check-format-exclude-file:
	SPELL_CHECK_FORMAT_RESULT=$$(cat spell-check-exclude.dic | egrep . | sort | uniq) && echo "$${SPELL_CHECK_FORMAT_RESULT}" > spell-check-exclude.dic

.PHONY: ci-container-build
ci-container-build:
# Use Github container registry as a container build image cache
	docker pull $(DOCKER_IMAGE_NAME) || true
	docker build --target build -t $(DOCKER_IMAGE_NAME) --cache-from=$(DOCKER_IMAGE_NAME) .
	docker push $(DOCKER_IMAGE_NAME) || true

.PHONY: ci-spell-check
ci-spell-check:
	docker run $(DOCKER_IMAGE_NAME) make spell-check
