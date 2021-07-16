const { defaults } = require('jest-config');

module.exports = {
  verbose: true,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/tests/db'],
};
