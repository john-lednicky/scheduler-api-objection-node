/* eslint-disable no-undef */
const validator = require('../../services/validationService');

const testEventJson = `{
    "beginDttm" : "2021-10-13T13:00:00.000Z",
    "endDttm" : "2021-10-13T16:00:00.000Z",
    "timeZone": "America/Chicago",
    "eventTypeId": 1,
    "peopleNeeded" : 3, 
    "comment" : ""
}`;

test('validate Event add - SUCCESS', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  const validationResult = validator.validateEntity('Event', 'add', eventToValidate);
  expect(validationResult).toBe(null);
});

test('validate Event add - extraneous field (id)', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.id = 1;
  const validationResult = validator.validateEntity('Event', 'add', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('additionalProperties');
  expect(validationResult[0].params.additionalProperty).toBe('id');
});

test('validate Event add - missing beginDttm', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  delete eventToValidate.beginDttm;
  const validationResult = validator.validateEntity('Event', 'add', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('required');
  expect(validationResult[0].params.missingProperty).toBe('beginDttm');
});
test('validate Event add - beginDttm empty', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.beginDttm = '';
  const validationResult = validator.validateEntity('Event', 'add', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/beginDttm$/);
  expect(validationResult[0].keyword).toBe('pattern');
});
test('validate Event add - beginDttm invalid', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.beginDttm = '2021-10-13 13:00:00.000';
  const validationResult = validator.validateEntity('Event', 'add', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/beginDttm$/);
  expect(validationResult[0].keyword).toBe('pattern');
});

test('validate Event add - missing endDttm', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  delete eventToValidate.endDttm;
  const validationResult = validator.validateEntity('Event', 'add', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('required');
  expect(validationResult[0].params.missingProperty).toBe('endDttm');
});
test('validate Event add - endDttm empty', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.endDttm = '';
  const validationResult = validator.validateEntity('Event', 'add', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/endDttm$/);
  expect(validationResult[0].keyword).toBe('pattern');
});
test('validate Event add - endDttm invalid', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.endDttm = '2021-10-13 13:00:00.000';
  const validationResult = validator.validateEntity('Event', 'add', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/endDttm$/);
  expect(validationResult[0].keyword).toBe('pattern');
});

test('validate Event add - missing timeZone', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  delete eventToValidate.timeZone;
  const validationResult = validator.validateEntity('Event', 'add', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('required');
  expect(validationResult[0].params.missingProperty).toBe('timeZone');
});
test('validate Event add - timeZone empty', async () => {
  const eventTypeToValidate = JSON.parse(testEventJson);
  eventTypeToValidate.timeZone = '';
  const validationResult = validator.validateEntity('Event', 'add', eventTypeToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/timeZone$/);
  expect(validationResult[0].keyword).toBe('enum');
});
test('validate Event add - timeZone invalid', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.timeZone = 'Winnie%';
  const validationResult = validator.validateEntity('Event', 'add', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/timeZone$/);
  expect(validationResult[0].keyword).toBe('enum');
});

test('validate Event add - missing eventTypeId', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  delete eventToValidate.eventTypeId;
  const validationResult = validator.validateEntity('Event', 'add', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('required');
  expect(validationResult[0].params.missingProperty).toBe('eventTypeId');
});
test('validate Event add - eventTypeId invalid', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.eventTypeId = 0;
  const validationResult = validator.validateEntity('Event', 'add', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/eventTypeId$/);
  expect(validationResult[0].keyword).toBe('minimum');
});

test('validate Event add - SUCCESS missing peopleNeeded', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  delete eventToValidate.peopleNeeded;
  const validationResult = validator.validateEntity('Event', 'add', eventToValidate);
  expect(validationResult).toBe(null);
});
test('validate Event add - peopleNeeded too small', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.peopleNeeded = -1;
  const validationResult = validator.validateEntity('Event', 'add', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/peopleNeeded$/);
  expect(validationResult[0].keyword).toBe('minimum');
});
test('validate Event add - peopleNeeded too large', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.peopleNeeded = 30;
  const validationResult = validator.validateEntity('Event', 'add', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/peopleNeeded$/);
  expect(validationResult[0].keyword).toBe('maximum');
});

test('validate Event add - SUCCESS missing comment', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  delete eventToValidate.comment;
  const validationResult = validator.validateEntity('Event', 'add', eventToValidate);
  expect(validationResult).toBe(null);
});
test('validate Event add - SUCCESS comment empty', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.comment = '';
  const validationResult = validator.validateEntity('Event', 'add', eventToValidate);
  expect(validationResult).toBe(null);
});
test('validate Event add - comment too long', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.comment = 'a'.repeat(501);
  const validationResult = validator.validateEntity('Event', 'add', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/comment$/);
  expect(validationResult[0].keyword).toBe('maxLength');
  expect(validationResult[0].params.limit).toBe(500);
});
test('validate Event add - comment invalid', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.comment = '@#$12356*^$#78';
  const validationResult = validator.validateEntity('Event', 'add', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/comment$/);
  expect(validationResult[0].keyword).toBe('pattern');
});
test('validate Event update - success', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.id = 1;
  const validationResult = validator.validateEntity('Event', 'update', eventToValidate);
  expect(validationResult).toBe(null);
});

test('validate Event update - missing id', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  const validationResult = validator.validateEntity('Event', 'update', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('required');
  expect(validationResult[0].params.missingProperty).toBe('id');
});
test('validate Event update - id invalid', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.id = 1;
  eventToValidate.id = 'Winnie%';
  const validationResult = validator.validateEntity('Event', 'update', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/id$/);
  expect(validationResult[0].keyword).toBe('type');
});

test('validate Event update - missing beginDttm', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.id = 1;
  delete eventToValidate.beginDttm;
  const validationResult = validator.validateEntity('Event', 'update', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('required');
  expect(validationResult[0].params.missingProperty).toBe('beginDttm');
});
test('validate Event update - beginDttm empty', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.id = 1;
  eventToValidate.beginDttm = '';
  const validationResult = validator.validateEntity('Event', 'update', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/beginDttm$/);
  expect(validationResult[0].keyword).toBe('pattern');
});
test('validate Event update - beginDttm too long', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.id = 1;
  eventToValidate.beginDttm = '2021-10-13T13:00:00.000ZZ';
  const validationResult = validator.validateEntity('Event', 'update', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/beginDttm$/);
  expect(validationResult[0].keyword).toBe('pattern');
});

test('validate Event update - missing endDttm', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.id = 1;
  delete eventToValidate.endDttm;
  const validationResult = validator.validateEntity('Event', 'update', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('required');
  expect(validationResult[0].params.missingProperty).toBe('endDttm');
});
test('validate Event update - endDttm empty', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.id = 1;
  eventToValidate.endDttm = '';
  const validationResult = validator.validateEntity('Event', 'update', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/endDttm$/);
  expect(validationResult[0].keyword).toBe('pattern');
});
test('validate Event update - endDttm too long', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.id = 1;
  eventToValidate.endDttm = '2021-10-13T13:00:00.000ZZ';
  const validationResult = validator.validateEntity('Event', 'update', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/endDttm$/);
  expect(validationResult[0].keyword).toBe('pattern');
});

test('validate Event update - timeZone invalid', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.id = 1;
  eventToValidate.timeZone = 'Winnie%';
  const validationResult = validator.validateEntity('Event', 'update', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/timeZone$/);
  expect(validationResult[0].keyword).toBe('enum');
});

test('validate Event update - SUCCESS missing peopleNeeded', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.id = 1;
  delete eventToValidate.peopleNeeded;
  const validationResult = validator.validateEntity('Event', 'update', eventToValidate);
  expect(validationResult).toBe(null);
});
test('validate Event update - peopleNeeded too small', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.id = 1;
  eventToValidate.peopleNeeded = -1;
  const validationResult = validator.validateEntity('Event', 'update', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/peopleNeeded$/);
  expect(validationResult[0].keyword).toBe('minimum');
});
test('validate Event update - peopleNeeded too large', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.id = 1;
  eventToValidate.peopleNeeded = 30;
  const validationResult = validator.validateEntity('Event', 'update', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/peopleNeeded$/);
  expect(validationResult[0].keyword).toBe('maximum');
});

test('validate Event update - SUCCESS missing comment', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.id = 1;
  delete eventToValidate.comment;
  const validationResult = validator.validateEntity('Event', 'update', eventToValidate);
  expect(validationResult).toBe(null);
});
test('validate Event update - SUCCESS comment empty', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.id = 1;
  eventToValidate.comment = '';
  const validationResult = validator.validateEntity('Event', 'update', eventToValidate);
  expect(validationResult).toBe(null);
});
test('validate Event update - comment too long', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.id = 1;
  eventToValidate.comment = '2'.repeat(501);
  const validationResult = validator.validateEntity('Event', 'update', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/comment$/);
  expect(validationResult[0].keyword).toBe('maxLength');
  expect(validationResult[0].params.limit).toBe(500);
});
test('validate Event update - comment invalid', async () => {
  const eventToValidate = JSON.parse(testEventJson);
  eventToValidate.id = 1;
  eventToValidate.comment = '@#$1235678';
  const validationResult = validator.validateEntity('Event', 'update', eventToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/comment$/);
  expect(validationResult[0].keyword).toBe('pattern');
});
