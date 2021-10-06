FROM node:12-alpine@sha256:1ea5900145028957ec0e7b7e590ac677797fa8962ccec4e73188092f7bc14da5
    # Add binary for init system.
    RUN apk add dumb-init

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
    COPY --chown=node:node app.js knexfile.js server.js ./
    COPY --chown=node:node db middleware models public routes services ./
    
    # Switch to low-privileged user.
    USER node

    # TODO Add an entrypoint script.
    
    CMD ["dumb-init", "node", "./server.js"]