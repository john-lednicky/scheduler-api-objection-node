test('Schemas from swaggerService equal schemas from files', () => {
  const swaggerDoc = require('../services/swaggerService').getDoc();

  const schemaNames = ['Person', 'Event', 'EventType', 'Assignment', 'Message', 'ErrorMessage'];

  schemaNames.forEach((schemaName) => {
    let schemaFromSwagger = swaggerDoc.components.schemas[schemaName];
    let schemaFromDisk = require(`../models/${schemaName}.json`);
    expect(schemaFromSwagger).toEqual(schemaFromDisk);
  });

});