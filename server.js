#!/usr/bin/env node
/* eslint-disable no-console */
const app = require('./app');

const port = process.env.PORT || '3333';

try {
  app.listen(port);
  console.log(`Server listening on port ${port}`);
} catch (err) {
  console.log(err);
}
