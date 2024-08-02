module.exports = {
  verbose: true,
  silent: true,
  bail: 5,
  testTimeout: 30000,
  maxConcurrency: 2, 
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    'node_modules*',
    '/tests/db',
    'sample.test.js',
    'scratch.test.js',
  ],
};
