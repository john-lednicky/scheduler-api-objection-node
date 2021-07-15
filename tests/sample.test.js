/* https://jestjs.io/docs/getting-started */
function sum(a, b) {
  return a + b;
}

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('Schemas from swaggerService equal schemas from files', () => {
  const swaggerDoc = require('../services/swaggerService').getDoc();

  const schemaNames = ['Person', 'Event', 'EventType', 'Assignment', 'Message', 'ErrorMessage'];

  schemaNames.forEach((schemaName) => {
    let schemaFromSwagger = swaggerDoc.components.schemas[schemaName];
    let schemaFromDisk = require(`../models/${schemaName}.json`);
    expect(schemaFromSwagger).toEqual(schemaFromDisk);
  });

});