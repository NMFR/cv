# Base stage, holds common tools used in the dev-container and ci stages.
FROM docker.io/denoland/deno:debian-1.46.3@sha256:b2a4dc2b3b101ef0b9d60075706b2e83f1f8ad017c008cb9f178a11b5b45a89d AS base

# Fix: https://github.com/hadolint/hadolint/wiki/DL4006
# Fix: https://github.com/koalaman/shellcheck/wiki/SC3014
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ENV DENO_DIR /deno

WORKDIR /opt/app

RUN apt-get update && \
  # Install: - hunspell: Spell checker.
  #          - make: Used as a task runner.
  #          - tidy: Used to format HTML files to valid XML so Hunspell can parse them correctly.
  # TODO: lock_versions to ensure deterministic behaviour.
  apt-get install -y hunspell make tidy && \
  # Clean up apt update and install unused artifacts.
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

FROM base AS dev-container

ENV GIT_EDITOR="code --wait"

ARG DEV_USER_ID=1000
ARG DEV_USER_NAME=dev
ARG DEV_GROUP_ID=${DEV_USER_ID}
ARG DEV_GROUP_NAME=${DEV_USER_NAME}

RUN apt-get update && \
  # Install: - curl: For http requests.
  #          - git: For version control.
  #          - less: To improve the shell read experience for bigger files.
  #          - sudo To allow the dev user to gain root level privileges.
  #          - zsh: For a more modern shell in the development environment.
  # TODO: lock_versions to ensure deterministic behaviour
  apt-get install -y curl git less sudo zsh && \
  # Clean up apt update and install unused artifacts.
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* && \
  # Set zsh as the default shell for the root user.
  chsh -s $(which zsh) && \
  # Install Oh My Zsh (to improve the development shell experience) for the root user.
  sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" && \
  # Create the development (non root) user and group and set its default shell to zsh.
  groupadd --gid ${DEV_GROUP_ID} ${DEV_GROUP_NAME} && \
  useradd --uid ${DEV_USER_ID} --gid ${DEV_GROUP_ID} --shell $(which zsh) --create-home ${DEV_USER_NAME} && \
  # Allow the development user to assume root privileges via sudo
  adduser ${DEV_USER_NAME} sudo && \
  echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
  # Make the development user the owner of the /opt/app and ${DENO_DIR} folders and their contents.
  chown -R -c ${DEV_USER_NAME} /opt/app && \
  mkdir -p ${DENO_DIR} && \
  chown -R -c ${DEV_USER_NAME} ${DENO_DIR}

USER ${DEV_USER_NAME}

# Install Oh My Zsh for the development user.
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

CMD [ "bash", "-c", "echo 'Dev container started, sleeping' &&  while :; do sleep 1; done;" ]

FROM base AS ci
