const createError = require('http-errors');
const AjvSource = require('ajv/dist/2020');

const { apiSchemas } = require('./jsonSchemaService');

const ajv = new AjvSource();
ajv.addVocabulary(['example']);

const validators = {
  Person: {
    add: ajv.compile(apiSchemas.personAddSchema),
    update: ajv.compile(apiSchemas.personUpdateSchema),
  },
  EventType: {
    add: ajv.compile(apiSchemas.eventTypeAddSchema),
    update: ajv.compile(apiSchemas.eventTypeUpdateSchema),
  },
  Event: {
    add: ajv.compile(apiSchemas.eventAddSchema),
    update: ajv.compile(apiSchemas.eventUpdateSchema),
  },
  Assignment: {
    add: ajv.compile(apiSchemas.assignmentAddSchema),
    update: ajv.compile(apiSchemas.assignmentUpdateSchema),
  },
};

exports.validateEntity = (entityName, operation, json) => {
  if (!validators[entityName]) {
    throw createError(400, `entityName must be "Person", "EventType", "Event", or "Assignment" (case-sensitive). You passed "${entityName}"`);
  }
  if (!validators[entityName][operation]) {
    throw createError(400, `operation must be "add" or "update" (case-sensitive). You passed "${operation}"`);
  }
  let returnValue = null;
  const valid = validators[entityName][operation](json);
  if (!valid) {
    returnValue = validators[entityName][operation].errors;
  }
  return returnValue;
};
