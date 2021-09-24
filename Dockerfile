FROM node:12-alpine@sha256:1ea5900145028957ec0e7b7e590ac677797fa8962ccec4e73188092f7bc14da5
RUN apk add dumb-init
ENV NODE_ENV production
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY --chown=node:node . .
RUN mkdir -p ./logs
RUN chown node:node ./logs
USER node
CMD ["dumb-init", "node", "./server.js"]