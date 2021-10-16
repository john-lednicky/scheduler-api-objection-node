/* eslint-disable no-new-object */
const messageSchema = require('../models/schemas/Message.json');
const errorMessageSchema = require('../models/schemas/ErrorMessage.json');

const personSchema = require('../models/schemas/Person.json');
const eventSchema = require('../models/schemas/Event.json');
const eventTypeSchema = require('../models/schemas/EventType.json');
const assignmentSchema = require('../models/schemas/Assignment.json');
const timeZoneSchema = require('../models/schemas/TimeZone.json');

const apiSchemas = {
  messageSchema,
  errorMessageSchema,
  timeZoneSchema,
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

Object.keys(apiSchemas).forEach((key) => {
  if (key.endsWith('Schema')) {
    if (key.endsWith('AddSchema')) {
      delete apiSchemas[key].properties.id;
      apiSchemas[key].required = apiSchemas[key].required.filter((r) => r !== 'id');
    }
    if (key.endsWith('UpdateSchema') || key.endsWith('AddSchema')) {
      delete apiSchemas[key].properties.updateUser;
      delete apiSchemas[key].properties.updateDttm;
      apiSchemas[key].required = apiSchemas[key].required.filter((r) => r !== 'updateUser' && r !== 'updateDttm');
    }
  }
});

const dbSchemas = {
  personSchema: JSON.parse(JSON.stringify(personSchema)),
  eventSchema: JSON.parse(JSON.stringify(eventSchema)),
  eventTypeSchema: JSON.parse(JSON.stringify(eventTypeSchema)),
  assignmentSchema: JSON.parse(JSON.stringify(assignmentSchema)),
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

exports.apiSchemas = apiSchemas;
exports.dbSchemas = dbSchemas;
