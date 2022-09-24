FROM node:18.9.0-bullseye-slim@sha256:f3ecbc009558021098b634afe45ee6179aaa80a65501cd90dad65e0db9490af5 as base

RUN apt-get update && \
  # TODO: lock_versions to ensure deterministic behaviour
  apt-get install -y git curl make hunspell tidy

FROM base as dev-container

RUN apt-get update && \
  # TODO: lock_versions to ensure deterministic behaviour
  apt-get install -y zsh less && \
  chsh -s $(which zsh) && \
  sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
