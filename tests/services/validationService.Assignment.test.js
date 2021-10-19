/* eslint-disable no-undef */
const validator = require('../../services/validationService');

const testAssignmentJson = `{
  "personId": 1,
  "eventId": 1
}`;

test('validate Assignment add - SUCCESS', async () => {
  const assignmentToValidate = JSON.parse(testAssignmentJson);
  const validationResult = validator.validateEntity('Assignment', 'add', assignmentToValidate);
  expect(validationResult).toBe(null);
});

test('validate Assignment add - extraneous field (name)', async () => {
  const assignmentToValidate = JSON.parse(testAssignmentJson);
  assignmentToValidate.name = 'gandalf';
  const validationResult = validator.validateEntity('Assignment', 'add', assignmentToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('additionalProperties');
  expect(validationResult[0].params.additionalProperty).toBe('name');
});

test('validate Assignment add - missing personId', async () => {
  const assignmentToValidate = JSON.parse(testAssignmentJson);
  delete assignmentToValidate.personId;
  const validationResult = validator.validateEntity('Assignment', 'add', assignmentToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('required');
  expect(validationResult[0].params.missingProperty).toBe('personId');
});

test('validate Assignment add - missing eventId', async () => {
  const assignmentToValidate = JSON.parse(testAssignmentJson);
  delete assignmentToValidate.eventId;
  const validationResult = validator.validateEntity('Assignment', 'add', assignmentToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('required');
  expect(validationResult[0].params.missingProperty).toBe('eventId');
});

test('validate Assignment add - personId invalid', async () => {
  const assignmentToValidate = JSON.parse(testAssignmentJson);
  assignmentToValidate.personId = 0;
  const validationResult = validator.validateEntity('Assignment', 'add', assignmentToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/personId$/);
  expect(validationResult[0].keyword).toBe('minimum');
});

test('validate Assignment add - eventId invalid', async () => {
  const assignmentToValidate = JSON.parse(testAssignmentJson);
  assignmentToValidate.personId = 0;
  const validationResult = validator.validateEntity('Assignment', 'add', assignmentToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/personId$/);
  expect(validationResult[0].keyword).toBe('minimum');
});
