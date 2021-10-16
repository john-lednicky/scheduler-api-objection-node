module.exports = {
  verbose: true,
  bail: 10,
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    'node_modules*',
    '/tests/db',
    'sample.test.js',
    'scratch.test.js',
  ],
};
