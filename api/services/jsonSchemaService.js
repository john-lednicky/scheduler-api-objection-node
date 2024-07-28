/* eslint-disable no-new-object */
const messageSchema = require('../models/schemas/Message.json');
const errorMessageSchema = require('../models/schemas/ErrorMessage.json');

const personSchema = require('../models/schemas/Person.json');
const eventSchema = require('../models/schemas/Event.json');
const eventTypeSchema = require('../models/schemas/EventType.json');
const assignmentSchema = require('../models/schemas/Assignment.json');
const timeZoneSchema = require('../models/schemas/TimeZone.json');

/*
  Swagger Schemas are based on the schema files, adjusted for context.
  For Add operations, the ID is not required.
  For Add and Update operations, audit fields are not required,
  because they're added later in the stack.
 */
const swaggerSchemas = {
  messageSchema: JSON.parse(JSON.stringify(messageSchema)),
  errorMessageSchema: JSON.parse(JSON.stringify(errorMessageSchema)),
  timeZoneSchema: JSON.parse(JSON.stringify(timeZoneSchema)),
  personSchema: JSON.parse(JSON.stringify(personSchema)),
  personAddSchema: JSON.parse(JSON.stringify(personSchema)),
  personUpdateSchema: JSON.parse(JSON.stringify(personSchema)),
  eventSchema: JSON.parse(JSON.stringify(eventSchema)),
  eventAddSchema: JSON.parse(JSON.stringify(eventSchema)),
  eventUpdateSchema: JSON.parse(JSON.stringify(eventSchema)),
  eventTypeSchema: JSON.parse(JSON.stringify(eventTypeSchema)),
  eventTypeAddSchema: JSON.parse(JSON.stringify(eventTypeSchema)),
  eventTypeUpdateSchema: JSON.parse(JSON.stringify(eventTypeSchema)),
  assignmentSchema: JSON.parse(JSON.stringify(assignmentSchema)),
  assignmentAddSchema: JSON.parse(JSON.stringify(assignmentSchema)),
  assignmentUpdateSchema: JSON.parse(JSON.stringify(assignmentSchema)),
};

Object.keys(swaggerSchemas).forEach((key) => {
  if (key.endsWith('Schema')) {
    if (key.endsWith('AddSchema')) {
      delete swaggerSchemas[key].properties.id;
      swaggerSchemas[key].title += ' (insert)';
      swaggerSchemas[key].required = swaggerSchemas[key].required.filter((r) => r !== 'id');
    }
    if (key.endsWith('UpdateSchema')) {
      swaggerSchemas[key].title += ' (update)';
    }
    if (key.endsWith('UpdateSchema') || key.endsWith('AddSchema')) {
      delete swaggerSchemas[key].properties.updateUser;
      delete swaggerSchemas[key].properties.updateDttm;
      swaggerSchemas[key].required = swaggerSchemas[key].required.filter((r) => r !== 'updateUser' && r !== 'updateDttm');
    }
  }
});

const removeExampleNodes = (schema) => {
  // Create a deep copy of the schema
  const newSchema = JSON.parse(JSON.stringify(schema));

  // Remove the "example" node from each of the fields
  Object.keys(newSchema.properties).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(newSchema.properties[key], 'example')) {
      delete newSchema.properties[key].example;
    }
  });
  return newSchema;
};

/*
The schemas have an example node that is used only in the swagger documentation.
Remove them for the validators at the API layer and the db layer.
 */
const apiSchemas = {
  messageSchema: removeExampleNodes(swaggerSchemas.messageSchema),
  errorMessageSchema: removeExampleNodes(swaggerSchemas.errorMessageSchema),
  timeZoneSchema: removeExampleNodes(swaggerSchemas.timeZoneSchema),
  personSchema: removeExampleNodes(swaggerSchemas.personSchema),
  personAddSchema: removeExampleNodes(swaggerSchemas.personAddSchema),
  personUpdateSchema: removeExampleNodes(swaggerSchemas.personUpdateSchema),
  eventSchema: removeExampleNodes(swaggerSchemas.eventSchema),
  eventAddSchema: removeExampleNodes(swaggerSchemas.eventAddSchema),
  eventUpdateSchema: removeExampleNodes(swaggerSchemas.eventUpdateSchema),
  eventTypeSchema: removeExampleNodes(swaggerSchemas.eventTypeSchema),
  eventTypeAddSchema: removeExampleNodes(swaggerSchemas.eventTypeAddSchema),
  eventTypeUpdateSchema: removeExampleNodes(swaggerSchemas.eventTypeUpdateSchema),
  assignmentSchema: removeExampleNodes(swaggerSchemas.assignmentSchema),
  assignmentAddSchema: removeExampleNodes(swaggerSchemas.assignmentAddSchema),
  assignmentUpdateSchema: removeExampleNodes(swaggerSchemas.assignmentUpdateSchema),
};

const dbSchemas = {
  personSchema: removeExampleNodes(personSchema),
  eventSchema: removeExampleNodes(eventSchema),
  eventTypeSchema: removeExampleNodes(eventTypeSchema),
  assignmentSchema: removeExampleNodes(assignmentSchema),
};
const sqlDateDescription = 'The date and time the event begins, in SQL format (ISO 8601, section 5.6, UTC without the Z or T delimiters), milliseconds optional.';
const sqlDatePattern = dbSchemas.eventSchema.properties.beginDttm.pattern.replace('T', ' ').replace('Z', '');
dbSchemas.eventSchema.properties.beginDttm.description = sqlDateDescription;
dbSchemas.eventSchema.properties.beginDttm.pattern = sqlDatePattern;
dbSchemas.eventSchema.properties.endDttm.description = sqlDateDescription;
dbSchemas.eventSchema.properties.endDttm.pattern = sqlDatePattern;

dbSchemas.personSchema.required = dbSchemas.personSchema.required.filter((r) => r !== 'id');
dbSchemas.eventSchema.required = dbSchemas.eventSchema.required.filter((r) => r !== 'id');
dbSchemas.eventTypeSchema.required = dbSchemas.eventTypeSchema.required.filter((r) => r !== 'id');

exports.swaggerSchemas = swaggerSchemas;
exports.apiSchemas = apiSchemas;
exports.dbSchemas = dbSchemas;
