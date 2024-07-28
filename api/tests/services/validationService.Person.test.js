/* eslint-disable no-undef */
const validator = require('../../services/validationService');

const testPersonJson = `{
  "firstName": "Maria",
  "middleName": "",
  "lastName": "Montalban",
  "phone": "5123334444",
  "email": "maria.montalban@dot.com"
}`;

test('validate Person add - SUCCESS', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  const validationResult = validator.validateEntity('Person', 'add', personToValidate);
  expect(validationResult).toBe(null);
});

test('validate Person add - extraneous field (id)', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.id = 1;
  const validationResult = validator.validateEntity('Person', 'add', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('additionalProperties');
  expect(validationResult[0].params.additionalProperty).toBe('id');
});

test('validate Person add - missing firstName', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  delete personToValidate.firstName;
  const validationResult = validator.validateEntity('Person', 'add', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('required');
  expect(validationResult[0].params.missingProperty).toBe('firstName');
});

test('validate Person add - firstName empty', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.firstName = '';
  const validationResult = validator.validateEntity('Person', 'add', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/firstName$/);
  expect(validationResult[0].keyword).toBe('minLength');
  expect(validationResult[0].params.limit).toBe(1);
});

test('validate Person add - firstName too long', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.firstName = 'a'.repeat(21);
  const validationResult = validator.validateEntity('Person', 'add', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/firstName$/);
  expect(validationResult[0].keyword).toBe('maxLength');
  expect(validationResult[0].params.limit).toBe(20);
});

test('validate Person add - firstName invalid', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.firstName = 'Winnie%';
  const validationResult = validator.validateEntity('Person', 'add', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/firstName$/);
  expect(validationResult[0].keyword).toBe('pattern');
});

test('validate Person add - missing lastName', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  delete personToValidate.lastName;
  const validationResult = validator.validateEntity('Person', 'add', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('required');
  expect(validationResult[0].params.missingProperty).toBe('lastName');
});

test('validate Person add - lastName empty', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.lastName = '';
  const validationResult = validator.validateEntity('Person', 'add', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/lastName$/);
  expect(validationResult[0].keyword).toBe('minLength');
  expect(validationResult[0].params.limit).toBe(1);
});

test('validate Person add - lastName too long', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.lastName = 'a'.repeat(21);
  const validationResult = validator.validateEntity('Person', 'add', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/lastName$/);
  expect(validationResult[0].keyword).toBe('maxLength');
  expect(validationResult[0].params.limit).toBe(20);
});

test('validate Person add - lastName invalid', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.lastName = 'Winnie%';
  const validationResult = validator.validateEntity('Person', 'add', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/lastName$/);
  expect(validationResult[0].keyword).toBe('pattern');
});

test('validate Person add - SUCCESS missing phone', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  delete personToValidate.phone;
  const validationResult = validator.validateEntity('Person', 'add', personToValidate);
  expect(validationResult).toBe(null);
});

test('validate Person add - SUCCESS phone empty', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.phone = '';
  const validationResult = validator.validateEntity('Person', 'add', personToValidate);
  expect(validationResult).toBe(null);
});

test('validate Person add - phone too long', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.phone = '2'.repeat(11);
  const validationResult = validator.validateEntity('Person', 'add', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/phone$/);
  expect(validationResult[0].keyword).toBe('maxLength');
  expect(validationResult[0].params.limit).toBe(10);
});

test('validate Person add - phone invalid', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.phone = '@#$1235678';
  const validationResult = validator.validateEntity('Person', 'add', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/phone$/);
  expect(validationResult[0].keyword).toBe('pattern');
});

test('validate Person add - SUCCESS missing email', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  delete personToValidate.email;
  const validationResult = validator.validateEntity('Person', 'add', personToValidate);
  expect(validationResult).toBe(null);
});

test('validate Person add - SUCCESS email empty', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.email = '';
  const validationResult = validator.validateEntity('Person', 'add', personToValidate);
  expect(validationResult).toBe(null);
});

test('validate Person add - email too long', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.email = `${'a'.repeat(100)}@${'a'.repeat(96)}.org`;
  const validationResult = validator.validateEntity('Person', 'add', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/email$/);
  expect(validationResult[0].keyword).toBe('maxLength');
  expect(validationResult[0].params.limit).toBe(200);
});

test('validate Person add - email invalid', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.email = 'Boomer Graybeard (AOL)';
  const validationResult = validator.validateEntity('Person', 'add', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/email$/);
  expect(validationResult[0].keyword).toBe('pattern');
});

test('validate Person update - success', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.id = 1;
  const validationResult = validator.validateEntity('Person', 'update', personToValidate);
  expect(validationResult).toBe(null);
});

test('validate Person update - missing id', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  const validationResult = validator.validateEntity('Person', 'update', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('required');
  expect(validationResult[0].params.missingProperty).toBe('id');
});

test('validate Person update - missing firstName', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.id = 1;
  delete personToValidate.firstName;
  const validationResult = validator.validateEntity('Person', 'update', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('required');
  expect(validationResult[0].params.missingProperty).toBe('firstName');
});

test('validate Person update - firstName empty', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.id = 1;
  personToValidate.firstName = '';
  const validationResult = validator.validateEntity('Person', 'update', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/firstName$/);
  expect(validationResult[0].keyword).toBe('minLength');
  expect(validationResult[0].params.limit).toBe(1);
});

test('validate Person update - firstName too long', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.id = 1;
  personToValidate.firstName = 'a'.repeat(21);
  const validationResult = validator.validateEntity('Person', 'update', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/firstName$/);
  expect(validationResult[0].keyword).toBe('maxLength');
  expect(validationResult[0].params.limit).toBe(20);
});

test('validate Person update - firstName invalid', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.id = 1;
  personToValidate.firstName = 'Winnie%';
  const validationResult = validator.validateEntity('Person', 'update', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/firstName$/);
  expect(validationResult[0].keyword).toBe('pattern');
});

test('validate Person update - missing lastName', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.id = 1;
  delete personToValidate.lastName;
  const validationResult = validator.validateEntity('Person', 'update', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].keyword).toBe('required');
  expect(validationResult[0].params.missingProperty).toBe('lastName');
});

test('validate Person update - lastName empty', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.id = 1;
  personToValidate.lastName = '';
  const validationResult = validator.validateEntity('Person', 'update', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/lastName$/);
  expect(validationResult[0].keyword).toBe('minLength');
  expect(validationResult[0].params.limit).toBe(1);
});

test('validate Person update - lastName too long', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.id = 1;
  personToValidate.lastName = 'a'.repeat(21);
  const validationResult = validator.validateEntity('Person', 'update', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/lastName$/);
  expect(validationResult[0].keyword).toBe('maxLength');
  expect(validationResult[0].params.limit).toBe(20);
});

test('validate Person update - lastName invalid', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.id = 1;
  personToValidate.lastName = 'Winnie%';
  const validationResult = validator.validateEntity('Person', 'update', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/lastName$/);
  expect(validationResult[0].keyword).toBe('pattern');
});

test('validate Person update - SUCCESS missing phone', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.id = 1;
  delete personToValidate.phone;
  const validationResult = validator.validateEntity('Person', 'update', personToValidate);
  expect(validationResult).toBe(null);
});

test('validate Person update - SUCCESS phone empty', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.id = 1;
  personToValidate.phone = '';
  const validationResult = validator.validateEntity('Person', 'update', personToValidate);
  expect(validationResult).toBe(null);
});

test('validate Person update - phone too long', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.id = 1;
  personToValidate.phone = '2'.repeat(11);
  const validationResult = validator.validateEntity('Person', 'update', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/phone$/);
  expect(validationResult[0].keyword).toBe('maxLength');
  expect(validationResult[0].params.limit).toBe(10);
});

test('validate Person update - phone invalid', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.id = 1;
  personToValidate.phone = '@#$1235678';
  const validationResult = validator.validateEntity('Person', 'update', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/phone$/);
  expect(validationResult[0].keyword).toBe('pattern');
});

test('validate Person update - SUCCESS missing email', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.id = 1;
  delete personToValidate.email;
  const validationResult = validator.validateEntity('Person', 'update', personToValidate);
  expect(validationResult).toBe(null);
});

test('validate Person update - SUCCESS email empty', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.id = 1;
  personToValidate.email = '';
  const validationResult = validator.validateEntity('Person', 'update', personToValidate);
  expect(validationResult).toBe(null);
});

test('validate Person update - email too long', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.id = 1;
  personToValidate.email = `${'a'.repeat(100)}@${'a'.repeat(96)}.org`;
  const validationResult = validator.validateEntity('Person', 'update', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/email$/);
  expect(validationResult[0].keyword).toBe('maxLength');
  expect(validationResult[0].params.limit).toBe(200);
});

test('validate Person update - email invalid', async () => {
  const personToValidate = JSON.parse(testPersonJson);
  personToValidate.id = 1;
  personToValidate.email = 'Boomer Graybeard (AOL)';
  const validationResult = validator.validateEntity('Person', 'update', personToValidate);
  expect(validationResult).not.toBe(null);
  expect(Array.isArray(validationResult)).toBe(true);
  expect(validationResult.length).toBe(1);
  expect(validationResult[0].instancePath).toMatch(/email$/);
  expect(validationResult[0].keyword).toBe('pattern');
});
