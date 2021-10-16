/* eslint-disable no-console */
/* eslint-disable no-undef */
const { apiSchemas, dbSchemas } = require('../../services/jsonSchemaService');

test('jsonSchemaService runs', async () => {
  expect(apiSchemas).toBeDefined();
  expect(dbSchemas).toBeDefined();
});
