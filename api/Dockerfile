FROM node:16-alpine
# FROM node:16-bullseye ## Use debian base image for debugging
    # Add binary for init system.
    RUN apk add dumb-init
    # RUN apt-get update ## debian installer
    # RUN apt-get install dumb-init ## debian installer

    # Make log directory, this will be a mount point.
    RUN mkdir -p ./logs
    RUN chown node:node ./logs

    # Set working directory and node environment variable.
    WORKDIR /app
    ENV NODE_ENV production

    # Copy the dependency files and install dependencies.
    COPY --chown=node:node package.json yarn.lock ./
    RUN yarn install --production --frozen-lockfile

    # Copy specific code files and directories.
    COPY --chown=node:node ./ /app

    # Copy self-signed lednicky.localhost cert.
    COPY --chown=node:node ./proxy/config/lednicky.localhost.crt /app/certs/lednicky.localhost.crt
    # Remove proxy subdirectory.
    RUN rm -rf /app/proxy

    # Switch to low-privileged user.
    USER node

    # Use init system
    CMD ["dumb-init", "node", "./server.js"]
