/* eslint-disable no-undef */
const fs = require('fs');

jest.setTimeout(20000);

const knexEnvName = 'autotest_personService'; /* This should match a sqlite3 environment in the knex file */
// const knexEnvName = 'development'; /* This might not be idempotent*/

/* set up service */
const personService = require('../../services/personService')(knexEnvName);
const eventService = require('../../services/eventService')(knexEnvName);
const assignmentService = require('../../services/assignmentService')(knexEnvName);

beforeAll(async () => {
  /* delete database file if it exists (it should not) */
  if (personService.knexEnvironmentConfig.connection.filename
      && fs.existsSync(personService.knexEnvironmentConfig.connection.filename)) {
    fs.unlinkSync(personService.knexEnvironmentConfig.connection.filename);
  }
  /* use knex to populate a new sqlite3 database */
  await personService.knex.migrate.latest();
  await personService.knex.seed.run();
});
afterAll(async () => {
  /* destroy knex and delete the database file */
  await personService.knex.destroy();
  if (personService.knexEnvironmentConfig.connection.filename
      && fs.existsSync(personService.knexEnvironmentConfig.connection.filename)) {
    fs.unlinkSync(personService.knexEnvironmentConfig.connection.filename);
  }
});

test('personService.getAll() - success', async () => {
  const allPersons = await personService.getAll();
  expect(Array.isArray(allPersons)).toBe(true);
  expect(allPersons.length).toBeGreaterThanOrEqual(6);
  expect(allPersons[0]).toHaveProperty('id');
});

// #region personService.delete()

test('personService.delete() - success', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  const deleteResult = await personService.delete(personCreated.id);
  expect(deleteResult).toBe(1);

  const personFetched = await personService.find(personCreated.id);
  expect(personFetched).toBeUndefined();
});

test('personService.delete() - success - cascade assignments', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  const eventToCreate = {
    beginDttm: '2021-07-04 13:00:00.000',
    endDttm: '2021-07-04 13:00:00.000',
    timeZone: 'America/Chicago',
    eventTypeId: 1,
    peopleNeeded: 3,
    comment: '',
  };
  const eventCreated = await eventService.create(eventToCreate);
  expect(eventCreated).toHaveProperty('id');

  const assignmentToCreate = {
    eventId: eventCreated.id,
    personId: personCreated.id,
  };
  const assignmentCreated = await assignmentService.create(assignmentToCreate);
  expect(assignmentCreated).toHaveProperty('eventId');
  expect(assignmentCreated.eventId).toBe(eventCreated.id);
  expect(assignmentCreated).toHaveProperty('personId');
  expect(assignmentCreated.personId).toBe(personCreated.id);

  const deleteResult = await personService.delete(personCreated.id);
  expect(deleteResult).toBe(1);

  const personFetched = await personService.find(personCreated.id);
  expect(personFetched).toBeUndefined();

  const assignmentFetched = await assignmentService.find(personCreated.id, eventCreated.id);
  expect(assignmentFetched).toBeUndefined();
});

test('personService.delete() - not found', async () => {
  const allPersons = await personService.getAll();
  expect(Array.isArray(allPersons)).toBe(true);
  const greatestId = Math.max(...allPersons.map((person) => person.id));
  const deleteResult = await personService.delete(greatestId + 509);
  expect(deleteResult).toBe(0);
});

test('personService.delete() - invalid id', async () => {
  await expect(personService.delete('y')).rejects.toThrow('id is not a positive integer');
  await expect(personService.delete('-1')).rejects.toThrow('id is not a positive integer');
  await expect(personService.delete('0')).rejects.toThrow('id is not a positive integer');
  await expect(personService.delete('0.1')).rejects.toThrow('id is not a positive integer');
});

// #endregion personService.delete()

// #region personService.find()

test('personService.find() - success', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  const personFetched = await personService.find(personCreated.id);
  expect(personFetched).toEqual(personCreated);
});

test('personService.find() - not found', async () => {
  const allPersons = await personService.getAll();
  expect(Array.isArray(allPersons)).toBe(true);
  const greatestId = Math.max(...allPersons.map((person) => person.id));
  const personFetched = await personService.find(greatestId + 45);
  expect(personFetched).toBeUndefined();
});

test('personService.find() - invalid id', async () => {
  await expect(personService.find('y')).rejects.toThrow('id is not a positive integer');
  await expect(personService.find('-1')).rejects.toThrow('id is not a positive integer');
  await expect(personService.find('0')).rejects.toThrow('id is not a positive integer');
  await expect(personService.find('0.1')).rejects.toThrow('id is not a positive integer');
});

// #endregion personService.find()

// #region personService.create()

test('personService.create() - success', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };

  const personCreated = await personService.create(personToCreate);

  expect(personCreated).toHaveProperty('id');

  personToCreate.id = personCreated.id;

  expect(personCreated.firstName).toEqual(personToCreate.firstName);
  expect(personCreated.middleName).toEqual(personToCreate.middleName);
  expect(personCreated.lastName).toEqual(personToCreate.lastName);
  expect(personCreated.phone).toEqual(personToCreate.phone);
  expect(personCreated.email).toEqual(personToCreate.email);

  const personFetched = await personService.find(personCreated.id);

  expect(personFetched.firstName).toEqual(personCreated.firstName);
  expect(personFetched.middleName).toEqual(personCreated.middleName);
  expect(personFetched.lastName).toEqual(personCreated.lastName);
  expect(personFetched.phone).toEqual(personCreated.phone);
  expect(personFetched.email).toEqual(personCreated.email);
});

test('personService.create() - validation error firstName too long', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  personToCreate.firstName = 'a'.repeat(21);
  await expect(personService.create(personToCreate)).rejects.toThrow('firstName: should NOT be longer than 20 characters');
});
test('personService.create() - validation error firstName missing', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  delete personToCreate.firstName;
  await expect(personService.create(personToCreate)).rejects.toThrow('firstName: is a required property');
});
test('personService.create() - validation error firstName empty string', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  personToCreate.firstName = '';
  await expect(personService.create(personToCreate)).rejects.toThrow('firstName: should match pattern');
});
test('personService.create() - validation error firstName has invalid characters', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  personToCreate.firstName = 'William0';
  await expect(personService.create(personToCreate)).rejects.toThrow('firstName: should match pattern');
});

test('personService.create() - validation error middleName too long', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  personToCreate.middleName = 'a'.repeat(21);
  await expect(personService.create(personToCreate)).rejects.toThrow('middleName: should NOT be longer than 20 characters');
});
test('personService.create() - validation error middleName has invalid characters', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  personToCreate.middleName = 'Bloop1';
  await expect(personService.create(personToCreate)).rejects.toThrow('middleName: should match pattern');
});

test('personService.create() - validation error lastName too long', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  personToCreate.lastName = 'a'.repeat(21);
  await expect(personService.create(personToCreate)).rejects.toThrow('lastName: should NOT be longer than 20 characters');
});
test('personService.create() - validation error lastName missing', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  delete personToCreate.lastName;
  await expect(personService.create(personToCreate)).rejects.toThrow('lastName: is a required property');
});
test('personService.create() - validation error lastName empty string', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  personToCreate.lastName = '';
  await expect(personService.create(personToCreate)).rejects.toThrow('lastName: should match pattern');
});
test('personService.create() - validation error lastName has invalid characters', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  personToCreate.lastName = 'Watkins^';
  await expect(personService.create(personToCreate)).rejects.toThrow('lastName: should match pattern');
});

test('personService.create() - validation error phone too long', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  personToCreate.phone = '1'.repeat(11);
  await expect(personService.create(personToCreate)).rejects.toThrow('phone: should match pattern');
});
test('personService.create() - validation error phone has invalid characters', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  personToCreate.phone = '5127A78888';
  await expect(personService.create(personToCreate)).rejects.toThrow('phone: should match pattern');
});

test('personService.create() - validation error email too long', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  personToCreate.email = `dot${'a'.repeat(190)}@dot.com`;
  await expect(personService.create(personToCreate)).rejects.toThrow('email: should NOT be longer than 200 characters');
});
test('personService.create() - validation error email does not match pattern', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  personToCreate.email = 'william.watkins';

  await expect(personService.create(personToCreate)).rejects.toThrow('email: should match pattern');
});

/*
test('personService.create() - validation error updateUser too long', async () => {
  const personToCreate = {
    'firstName': 'William',
    'middleName': '',
    'lastName': 'Watkins',
    'phone': '5127778888',
    'email': 'william.watkins@scratch.com',
    'updateUser': 'a'.repeat(46),
    'updateDttm': '2021-07-04 13:00:00.00'
  };
  await expect(personService.create(personToCreate))
    .rejects.toThrow('updateUser: should NOT be longer than 45 characters');
});
test('personService.create() - validation error updateUser missing', async () => {
  const personToCreate = {
    'firstName': 'William',
    'middleName': '',
    'lastName': 'Watkins',
    'phone': '5127778888',
    'email': 'william.watkins@scratch.com',
    'updateDttm': '2021-07-04 13:00:00.00'
  };
  await expect(personService.create(personToCreate))
    .rejects.toThrow('updateUser: is a required property');
});
test('personService.create() - validation error updateUser empty string', async () => {
  const personToCreate = {
    'firstName': 'William',
    'middleName': '',
    'lastName': 'Watkins',
    'phone': '5127778888',
    'email': 'william.watkins@scratch.com',
    'updateUser': '',
    'updateDttm': '2021-07-04 13:00:00.00'
  };
  await expect(personService.create(personToCreate))
    .rejects.toThrow('should NOT be shorter than 1 characters');
  await expect(personService.create(personToCreate))
    .rejects.toThrow('updateUser: should match pattern');
});
test('personService.create() - validation error updateUser has updateUser characters', async () => {
  const personToCreate = {
    'firstName': 'William',
    'middleName': '',
    'lastName': 'Watkins',
    'phone': '5127778888',
    'email': 'william.watkins@scratch.com',
    'updateUser': 'john.d.ledni$cky',
    'updateDttm': '2021-07-04 13:00:00.00'
  };
  await expect(personService.create(personToCreate))
    .rejects.toThrow('updateUser: should match pattern');
});

test('personService.create() - validation error updateDttm missing', async () => {
  const personToCreate = {
    'firstName': 'William',
    'middleName': '',
    'lastName': 'Watkins',
    'phone': '5127778888',
    'email': 'william.watkins@scratch.com',
    'updateUser': 'john.d.lednicky'
  };
  await expect(personService.create(personToCreate))
    .rejects.toThrow('updateDttm: is a required property');
});
test('personService.create() - validation error updateDttm empty string', async () => {
  const personToCreate = {
    'firstName': 'William',
    'middleName': '',
    'lastName': 'Watkins',
    'phone': '5127778888',
    'email': 'william.watkins@scratch.com',
    'updateUser': 'john.d.lednick',
    'updateDttm': ''
  };
  await expect(personService.create(personToCreate))
    .rejects.toThrow('updateDttm: should match pattern');
});
test('personService.create() - validation error updateDttm has invalid characters', async () => {
  const personToCreate = {
    'firstName': 'William',
    'middleName': '',
    'lastName': 'Watkins',
    'phone': '5127778888',
    'email': 'william.watkins@scratch.com',
    'updateUser': 'john.d.ledni$cky',
    'updateDttm': '7-4-2021'
  };
  await expect(personService.create(personToCreate))
    .rejects.toThrow('updateDttm: should match pattern');
});
*/
// #endregion personService.create()

// #region personService.update()

test('personService.update() - success', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  personToCreate.id = personCreated.id;
  personToCreate.middleName = 'Wilberforce';

  const personUpdated = await personService.update(personToCreate);
  expect(personUpdated.firstName).toEqual(personToCreate.firstName);
  expect(personUpdated.middleName).toEqual(personToCreate.middleName);
  expect(personUpdated.lastName).toEqual(personToCreate.lastName);
  expect(personUpdated.phone).toEqual(personToCreate.phone);
  expect(personUpdated.email).toEqual(personToCreate.email);
  expect(personUpdated.middleName).toEqual('Wilberforce');

  const personFetched = await personService.find(personUpdated.id);
  expect(personFetched).toEqual(personUpdated);
});
test('personService.update() - validation error firstName too long', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  personToCreate.id = personCreated.id;
  personToCreate.firstName = 'a'.repeat(21);

  await expect(personService.update(personToCreate)).rejects.toThrow('firstName: should NOT be longer than 20 characters');
});
test('personService.update() - validation error firstName missing', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  personToCreate.id = personCreated.id;
  delete personToCreate.firstName;

  await expect(personService.update(personToCreate)).rejects.toThrow('firstName: is a required property');
});
test('personService.udpate() - validation error firstName empty string', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  personToCreate.id = personCreated.id;
  personToCreate.firstName = '';

  await expect(personService.update(personToCreate)).rejects.toThrow('firstName: should match pattern');
  await expect(personService.update(personToCreate)).rejects.toThrow('should NOT be shorter than 1 characters');
});
test('personService.update() - validation error firstName has invalid characters', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  personToCreate.id = personCreated.id;
  personToCreate.firstName = '876TGF#';

  await expect(personService.update(personToCreate)).rejects.toThrow('firstName: should match pattern');
});
test('personService.update() - validation error middleName too long', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  personToCreate.id = personCreated.id;
  personToCreate.middleName = 'a'.repeat(21);

  await expect(personService.update(personToCreate)).rejects.toThrow('middleName: should NOT be longer than 20 characters');
});
test('personService.update() - validation error middleName has invalid characters', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  personToCreate.id = personCreated.id;
  personToCreate.middleName = 'INvalid^';

  await expect(personService.update(personToCreate)).rejects.toThrow('middleName: should match pattern');
});
test('personService.update() - validation error lastName too long', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  personToCreate.id = personCreated.id;
  personToCreate.lastName = 'a'.repeat(21);

  await expect(personService.update(personToCreate)).rejects.toThrow('lastName: should NOT be longer than 20 characters');
});
test('personService.update() - validation error lastName missing', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  personToCreate.id = personCreated.id;
  delete personToCreate.lastName;

  await expect(personService.update(personToCreate)).rejects.toThrow('lastName: is a required property');
});
test('personService.update() - validation error lastName empty string', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  personToCreate.id = personCreated.id;
  personToCreate.lastName = '';

  await expect(personService.update(personToCreate)).rejects.toThrow('lastName: should match pattern');
  await expect(personService.update(personToCreate)).rejects.toThrow('should NOT be shorter than 1 characters');
});
test('personService.update() - validation error lastName has invalid characters', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  personToCreate.id = personCreated.id;
  personToCreate.lastName = 'Barg5%Flap';

  await expect(personService.update(personToCreate)).rejects.toThrow('lastName: should match pattern');
});

test('personService.update() - validation error phone too long', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  personToCreate.id = personCreated.id;
  personToCreate.phone = '9'.repeat(11);

  await expect(personService.update(personToCreate)).rejects.toThrow('phone: should match pattern');
  await expect(personService.update(personToCreate)).rejects.toThrow('should NOT be longer than 10 characters');
});
test('personService.update() - validation error phone has invalid characters', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  personToCreate.id = personCreated.id;
  personToCreate.phone = '55542a7874';

  await expect(personService.update(personToCreate)).rejects.toThrow('phone: should match pattern');
});

test('personService.update() - validation error email too long', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  personToCreate.id = personCreated.id;
  personToCreate.email = `dot${'a'.repeat(190)}@dot.com`;

  await expect(personService.update(personToCreate)).rejects.toThrow('email: should NOT be longer than 200 characters');
});
test('personService.update() - validation error email is invalid', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  personToCreate.id = personCreated.id;
  personToCreate.email = 'william.watkins';

  await expect(personService.update(personToCreate)).rejects.toThrow('email: should match pattern');
});

/*
test('personService.update() - validation error updateUser too long', async () => {
  const personToCreate = {
    firstName: 'William',
    middleName: '',
    lastName: 'Watkins',
    phone: '5127778888',
    email: 'william.watkins@scratch.com',
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  personToCreate.id = personCreated.id;
  personToCreate.updateUser = 'a'.repeat(46);

  await expect(personService.update(personToCreate))
    .rejects.toThrow('updateUser: should NOT be longer than 45 characters');
});
test('personService.update() - validation error updateUser missing', async () => {
  const personToCreate = {
    'firstName': 'William',
    'middleName': '',
    'lastName': 'Watkins',
    'phone': '5127778888',
    'email': 'william.watkins@scratch.com',
    'updateUser': 'john.d.lednicky',
    'updateDttm': '2021-07-04 13:00:00.00'
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  delete personCreated.updateUser;

  await expect(personService.update(personCreated))
    .rejects.toThrow('updateUser: is a required property');
});
test('personService.update() - validation error updateUser empty string', async () => {
  const personToCreate = {
    'firstName': 'William',
    'middleName': '',
    'lastName': 'Watkins',
    'phone': '5127778888',
    'email': 'william.watkins@scratch.com',
    'updateUser': 'john.d.lednicky',
    'updateDttm': '2021-07-04 13:00:00.00'
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  personCreated.updateUser = '';

  await expect(personService.update(personCreated))
    .rejects.toThrow('updateUser: should match pattern');
  await expect(personService.update(personCreated))
    .rejects.toThrow('should NOT be shorter than 1 characters');
});
test('personService.update() - validation error updateUser has invalid characters', async () => {
  const personToCreate = {
    'firstName': 'William',
    'middleName': '',
    'lastName': 'Watkins',
    'phone': '5127778888',
    'email': 'william.watkins@scratch.com',
    'updateUser': 'john.d.lednicky',
    'updateDttm': '2021-07-04 13:00:00.00'
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  personCreated.updateUser = 'john.d.ledni&^y';

  await expect(personService.update(personCreated))
    .rejects.toThrow('updateUser: should match pattern');
});

test('personService.update() - validation error updateDttm missing', async () => {
  const personToCreate = {
    'firstName': 'William',
    'middleName': '',
    'lastName': 'Watkins',
    'phone': '5127778888',
    'email': 'william.watkins@scratch.com',
    'updateUser': 'john.d.lednicky',
    'updateDttm': '2021-07-04 13:00:00.00'
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  delete personCreated.updateDttm;

  await expect(personService.update(personCreated))
    .rejects.toThrow('updateDttm: is a required property');
});
test('personService.update() - validation error updateDttm empty string', async () => {
  const personToCreate = {
    'firstName': 'William',
    'middleName': '',
    'lastName': 'Watkins',
    'phone': '5127778888',
    'email': 'william.watkins@scratch.com',
    'updateUser': 'john.d.lednicky',
    'updateDttm': '2021-07-04 13:00:00.00'
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  personCreated.updateDttm = '';

  await expect(personService.update(personCreated))
    .rejects.toThrow('updateDttm: should match pattern');
});
test('personService.create() - validation error updateDttm is invalid', async () => {
  const personToCreate = {
    'firstName': 'William',
    'middleName': '',
    'lastName': 'Watkins',
    'phone': '5127778888',
    'email': 'william.watkins@scratch.com',
    'updateUser': 'john.d.lednicky',
    'updateDttm': '2021-07-04 13:00:00.00'
  };
  const personCreated = await personService.create(personToCreate);
  expect(personCreated).toHaveProperty('id');

  personCreated.updateDttm = '7-4-2021';

  await expect(personService.update(personCreated))
    .rejects.toThrow('updateDttm: should match pattern');
});
*/
// #endregion personService.update()
