/* eslint-disable no-undef */
const validator = require('../../services/validationService');

test('validate Person add - success', async () => {
  const personToValidate = {
    firstName: 'Maria',
    middleName: '',
    lastName: 'Montalban',
    phone: '5123334444',
    email: 'maria.montalban@dot.com',
  };
  const validationResult = validator.validateEntity('Person', 'add', personToValidate);
  expect(validationResult).toBeFalsy();
});

test('validate Person update - success', async () => {
  const personToValidate = {
    id: 1,
    firstName: 'Maria',
    middleName: '',
    lastName: 'Montalban',
    phone: '5123334444',
    email: 'maria.montalban@dot.com',
  };
  const validationResult = validator.validateEntity('Person', 'update', personToValidate);
  expect(validationResult).toBeFalsy();
});
