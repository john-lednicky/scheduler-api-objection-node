#!/usr/bin/env node
const app = require('./app.js');

const port = process.env.PORT || '3333';

try {
  app.listen(port);
  console.log(`Server running on port ${port}`);
} catch (err) {
  console.log(err);
}
