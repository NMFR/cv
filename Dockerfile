# Base stage, holds common tools used in the dev-container and ci stages.
FROM docker.io/denoland/deno:debian-2.1.7@sha256:e5ee37d73f071d9bc93f9e7b8e65bb14a0efd7478c103bf91d9ac7b199089f14 AS base

# Fix: https://github.com/hadolint/hadolint/wiki/DL4006
# Fix: https://github.com/koalaman/shellcheck/wiki/SC3014
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Reset the entrypoint, the parent image configured a entrypoint for the deno CLI that it is unused in our use case.
ENTRYPOINT []

ENV DENO_DIR /deno

WORKDIR /opt/app

# Configure default locale (important for chrome-headless-shell).
ENV LANG=en_US.UTF-8

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# If running Docker >= 1.13.0 use docker run's --init arg to reap zombie processes, otherwise
# uncomment the following lines to have `dumb-init` as PID 1
# ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_x86_64 /usr/local/bin/dumb-init
# RUN chmod +x /usr/local/bin/dumb-init
# ENTRYPOINT ["dumb-init", "--"]

# Non root user details.
ARG USER_ID=1000
ARG USER_NAME=dev
ARG GROUP_ID=${USER_ID}
ARG GROUP_NAME=${USER_NAME}

RUN \
  # Create the non root user and group.
  groupadd --gid ${GROUP_ID} ${GROUP_NAME} && \
  useradd --uid ${USER_ID} --gid ${GROUP_ID} --create-home ${USER_NAME} && \
  # Make the development user the owner of the /opt/app and ${DENO_DIR} folders and their contents.
  chown -R -c ${USER_NAME} /opt/app && \
  mkdir -p ${DENO_DIR} && \
  chown -R -c ${USER_NAME} ${DENO_DIR} && \
  # Install tools and dependencies.
  # TODO: lock_versions to ensure deterministic behaviour
  apt-get update && \
  apt-get install -y --no-install-recommends \
  # Install hunspell, used as a spell checker.
  hunspell \
  # Install make, used as a task runner.
  make \
  # Install tidy, used to format HTML files to valid XML so Hunspell can parse them correctly.
  tidy \
  # Install curl, used as a HTTP client CLI.
  curl \
  # Install public trusted certificate authoraties (needed for HTTPS requests).
  ca-certificates \
  # Install unzip, used as a decompresser (needed to unpack chrome binary).
  unzip \
  # Install Chrome dependencies (https://pptr.dev/troubleshooting#chrome-doesnt-launch-on-linux).
  fonts-ipafont-gothic \
  fonts-wqy-zenhei \
  fonts-thai-tlwg \
  fonts-khmeros \
  fonts-kacst \
  fonts-freefont-ttf \
  fonts-liberation \
  dbus \
  dbus-x11 \
  libxss1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  xdg-utils && \
  # Clean up apt update and install unused artifacts.
  apt-get clean && \
  apt-get autoremove && \
  rm -rf /var/lib/apt/lists/* && \
  # Download and install chrome:
  mkdir -p /tmp/chrome && \
  curl -sL https://storage.googleapis.com/chrome-for-testing-public/129.0.6668.100/linux64/chrome-linux64.zip -o /tmp/chrome/chrome-linux64.zip && \
  mkdir -p /opt/google/chrome && \
  unzip /tmp/chrome/chrome-linux64.zip -d /opt/google/chrome && \
  ln -s /opt/google/chrome/chrome-linux64/chrome /usr/bin/google-chrome-stable && \
  rm -Rf /tmp/chrome

USER ${USER_NAME}

# Install deno.json dependencies.
COPY deno.json deno.lock ./
RUN deno install

# ImageMagick builder stage, used to build the magick binary.
# magick is used in the dev-container stage for HTML visual diff tool by
# comparing screenshots of the current version of the CV with the in progress version.
FROM docker.io/debian:stable-20250113-slim@sha256:b5ace515e78743215a1b101a6f17e59ed74b17132139ca3af3c37e605205e973 AS magick-builder

RUN apt-get update && \
  # Install ImageMagick build dependencies.
  # TODO: lock_versions to ensure deterministic behaviour.
  apt-get install -y \
  autoconf \
  pkg-config \
  build-essential \
  libpng-dev \
  # Install curl, needed to download the magick release.
  curl && \
  # Clean up apt update and install unused artifacts.
  apt-get clean && \
  apt-get autoremove && \
  rm -rf /var/lib/apt/lists/* && \
  # Build ImageMagick from source.
  curl -sL "https://github.com/ImageMagick/ImageMagick/archive/refs/tags/7.1.1-39.tar.gz" -o /tmp/ImageMagick.tar.gz && \
  tar xzf /tmp/ImageMagick.tar.gz --directory /tmp && \
  mkdir -p /tmp/ImageMagick && \
  cd /tmp/ImageMagick && \
  sh /tmp/ImageMagick-7.1.1-39/configure --prefix=/usr/local --with-bzlib=yes --with-fontconfig=yes --with-freetype=yes --with-gslib=yes --with-gvc=yes --with-jpeg=yes --with-jp2=yes --with-png=yes --with-tiff=yes --with-xml=yes --with-gs-font-dir=yes --disable-shared --enable-delegate-build && \
  make -j && \
  make install && \
  rm -rf /tmp/*

FROM base AS dev-container

# Copy the magick binary and config files from the magick-builder stage.
COPY --from=magick-builder /usr/local/bin/magick /usr/local/bin/magick
COPY --from=magick-builder /usr/local/share/ImageMagick-7/ /usr/local/share/ImageMagick-7/
COPY --from=magick-builder /usr/local/etc/ImageMagick-7/ /usr/local/etc/ImageMagick-7/

ENV GIT_EDITOR="code --wait"

USER root

RUN apt-get update && \
  # Install tools and dependencies.
  # TODO: lock_versions to ensure deterministic behaviour
  apt-get install -y --no-install-recommends \
  # Install libgomp1, a shared library required to run magick.
  libgomp1 \
  # Install ghostscript, required by magick to run magick convert pdf to png.
  ghostscript \
  # Install git, used for version control.
  git \
  # Install ssh, required for git pull / push and other git remote operations.
  openssh-client \
  # Install less, used to improve the shell read experience for bigger files.
  less \
  # Install sudo, used to allow the dev user to gain root level privileges.
  sudo \
  # Install zsh, a more modern shell in the development environment.
  zsh && \
  # Clean up apt update and install unused artifacts.
  apt-get clean && \
  apt-get autoremove && \
  rm -rf /var/lib/apt/lists/* && \
  # Set zsh as the default shell for the root user.
  chsh -s $(which zsh) && \
  # Install Oh My Zsh (to improve the development shell experience) for the root user.
  sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" && \
  # Set zsh as the default shell for the development (non root) user.
  chsh -s $(which zsh) ${USER_NAME} && \
  # Allow the development user to assume root privileges via sudo.
  adduser ${USER_NAME} sudo && \
  echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER ${USER_NAME}

# Install Oh My Zsh for the development user.
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

CMD [ "bash", "-c", "echo 'Dev container started, sleeping' &&  while :; do sleep 1; done;" ]

FROM base AS ci
