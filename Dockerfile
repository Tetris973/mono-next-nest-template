# Platform is necessary otherwise when building the image on mac, the platform is ARM
# We use node:20.13.1-bookworm-slim because:
# 1. It's based on Debian Bookworm (stable, long support)
# 2. Uses Node.js LTS version for stability
# 3. Slim variant reduces image size and potential vulnerabilities
# 4. Maintains glibc compatibility for better runtime support
FROM --platform=linux/amd64 node:20.13.1-bookworm-slim

# Install OpenSSL needed for Prisma
RUN apt-get update -y && \
    apt-get install -y openssl libssl-dev ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install pnpm
ARG PNPM_VERSION=9.x
RUN npm install -g pnpm@${PNPM_VERSION}

# Set shell for pnpm
SHELL ["/bin/bash", "-c"]

# Set up pnpm
ENV SHELL="/bin/bash"
RUN pnpm setup
ENV PNPM_HOME="/root/.pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

# Install dotenv-cli
RUN pnpm add -g dotenv-cli

# Set the pnpm store directory
# This is necessary for the cache to work on gitlab runners and custom runners
# The /builds/.pnpm-store path is the default one, but we put it here to document
RUN pnpm config set store-dir /builds/.pnpm-store

CMD ["node"]