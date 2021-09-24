const { defaults } = require('jest-config');

module.exports = {
  verbose: true,
  bail: 10,
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '<rootDir>/tests/db',
    '<rootDir>/tests/sample.test.js',
  ],
};
