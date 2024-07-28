/* eslint-disable no-undef */
const validator = require('../../services/validationService');

const testEventTypeJson = `{
  "name": "Test Event",
  "description": "Description of the test event."
}`;

test('validate EventType add - SUCCESS', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  const validationResult = validator.validateEntity('EventType', 'add', eventTypeToValidate);
  expect(validationResult).toBe(null);
});

test('validate EventType add - extraneous field (id)', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  eventTypeToValidate.id = 1;
  const validationResult = validator.validateEntity('EventType', 'add', eventTypeToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('additionalProperties');
  expect(validationResult[0].params.additionalProperty).toBe('id');
});

test('validate EventType add - missing name', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  delete eventTypeToValidate.name;
  const validationResult = validator.validateEntity('EventType', 'add', eventTypeToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('required');
  expect(validationResult[0].params.missingProperty).toBe('name');
});

test('validate EventType add - name empty', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  eventTypeToValidate.name = '';
  const validationResult = validator.validateEntity('EventType', 'add', eventTypeToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/name$/);
  expect(validationResult[0].keyword).toBe('minLength');
  expect(validationResult[0].params.limit).toBe(1);
});

test('validate EventType add - name too long', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  eventTypeToValidate.name = 'a'.repeat(26);
  const validationResult = validator.validateEntity('EventType', 'add', eventTypeToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/name$/);
  expect(validationResult[0].keyword).toBe('maxLength');
  expect(validationResult[0].params.limit).toBe(25);
});

test('validate EventType add - name invalid', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  eventTypeToValidate.name = 'Winnie%';
  const validationResult = validator.validateEntity('EventType', 'add', eventTypeToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/name$/);
  expect(validationResult[0].keyword).toBe('pattern');
});

test('validate EventType add - SUCCESS missing description', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  delete eventTypeToValidate.description;
  const validationResult = validator.validateEntity('EventType', 'add', eventTypeToValidate);
  expect(validationResult).toBe(null);
});

test('validate EventType add - SUCCESS description empty', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  eventTypeToValidate.description = '';
  const validationResult = validator.validateEntity('EventType', 'add', eventTypeToValidate);
  expect(validationResult).toBe(null);
});

test('validate EventType add - description too long', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  eventTypeToValidate.description = 'a'.repeat(251);
  const validationResult = validator.validateEntity('EventType', 'add', eventTypeToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/description$/);
  expect(validationResult[0].keyword).toBe('maxLength');
  expect(validationResult[0].params.limit).toBe(250);
});

test('validate EventType add - description invalid', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  eventTypeToValidate.description = '@#$1235678';
  const validationResult = validator.validateEntity('EventType', 'add', eventTypeToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/description$/);
  expect(validationResult[0].keyword).toBe('pattern');
});

test('validate EventType update - success', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  eventTypeToValidate.id = 1;
  const validationResult = validator.validateEntity('EventType', 'update', eventTypeToValidate);
  expect(validationResult).toBe(null);
});

test('validate EventType update - missing id', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  const validationResult = validator.validateEntity('EventType', 'update', eventTypeToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('required');
  expect(validationResult[0].params.missingProperty).toBe('id');
});

test('validate EventType update - id invalid', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  eventTypeToValidate.id = 1;
  eventTypeToValidate.id = 'Winnie%';
  const validationResult = validator.validateEntity('EventType', 'update', eventTypeToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/id$/);
  expect(validationResult[0].keyword).toBe('type');
});

test('validate EventType update - missing name', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  eventTypeToValidate.id = 1;
  delete eventTypeToValidate.name;
  const validationResult = validator.validateEntity('EventType', 'update', eventTypeToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('required');
  expect(validationResult[0].params.missingProperty).toBe('name');
});

test('validate EventType update - name empty', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  eventTypeToValidate.id = 1;
  eventTypeToValidate.name = '';
  const validationResult = validator.validateEntity('EventType', 'update', eventTypeToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/name$/);
  expect(validationResult[0].keyword).toBe('minLength');
  expect(validationResult[0].params.limit).toBe(1);
});

test('validate EventType update - name too long', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  eventTypeToValidate.id = 1;
  eventTypeToValidate.name = 'a'.repeat(26);
  const validationResult = validator.validateEntity('EventType', 'update', eventTypeToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/name$/);
  expect(validationResult[0].keyword).toBe('maxLength');
  expect(validationResult[0].params.limit).toBe(25);
});

test('validate EventType update - name invalid', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  eventTypeToValidate.id = 1;
  eventTypeToValidate.name = 'Winnie%';
  const validationResult = validator.validateEntity('EventType', 'update', eventTypeToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/name$/);
  expect(validationResult[0].keyword).toBe('pattern');
});

test('validate EventType update - SUCCESS missing description', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  eventTypeToValidate.id = 1;
  delete eventTypeToValidate.description;
  const validationResult = validator.validateEntity('EventType', 'update', eventTypeToValidate);
  expect(validationResult).toBe(null);
});

test('validate EventType update - SUCCESS description empty', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  eventTypeToValidate.id = 1;
  eventTypeToValidate.description = '';
  const validationResult = validator.validateEntity('EventType', 'update', eventTypeToValidate);
  expect(validationResult).toBe(null);
});

test('validate EventType update - description too long', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  eventTypeToValidate.id = 1;
  eventTypeToValidate.description = '2'.repeat(251);
  const validationResult = validator.validateEntity('EventType', 'update', eventTypeToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/description$/);
  expect(validationResult[0].keyword).toBe('maxLength');
  expect(validationResult[0].params.limit).toBe(250);
});

test('validate EventType update - description invalid', async () => {
  const eventTypeToValidate = JSON.parse(testEventTypeJson);
  eventTypeToValidate.id = 1;
  eventTypeToValidate.description = '@#$1235678';
  const validationResult = validator.validateEntity('EventType', 'update', eventTypeToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/description$/);
  expect(validationResult[0].keyword).toBe('pattern');
});
