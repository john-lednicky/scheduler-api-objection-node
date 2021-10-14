const fs = require('fs');
const { format, parse } = require('date-fns');

//#region Setup
const jestConfig = require('../../jest.config.js');
jest.setTimeout(20000);

const knexEnvName = 'autotest_assignmentService'; /* This should match a sqlite3 environment in the knex file */
//const knexEnvName = 'development'; /* This might not be idempotent because it depends on the state of the external dev mysql database*/

/* set up service */
const assignmentService = require('../../services/assignmentService.js')(knexEnvName);
const eventService = require('../../services/eventService.js')(knexEnvName);
const personService = require('../../services/personService.js')(knexEnvName);

beforeAll(async () => {
  /* delete database file if it exists (it should not) */
  if (assignmentService.knexEnvironmentConfig.connection.filename
    && fs.existsSync(assignmentService.knexEnvironmentConfig.connection.filename)) {
    fs.unlinkSync(assignmentService.knexEnvironmentConfig.connection.filename);
  }
  /* use knex to populate a new sqllite3 database */
  await assignmentService.knex.migrate.latest();
  await assignmentService.knex.seed.run();
});
afterAll(async () => {
  /* destroy knex and delete the database file */
  await assignmentService.knex.destroy();
  if (assignmentService.knexEnvironmentConfig.connection.filename
    && fs.existsSync(assignmentService.knexEnvironmentConfig.connection.filename)) {
    fs.unlinkSync(assignmentService.knexEnvironmentConfig.connection.filename);
  }
});
//#endregion Setup

const createPersonEventPair = async () => {
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

  const eventToCreate = {
    "beginDttm": "2021-07-04 13:00:00.00",
    "endDttm": "2021-07-04 13:00:00.00",
    "eventTypeId": 1,
    "peopleNeeded": 3,
    "comment": "",
    "updateUser": "john.d.lednicky",
    "updateDttm": "2021-07-04 13:00:00.00"
  };
  const eventCreated = await eventService.create(eventToCreate);

  return {
    person: personCreated,
    event: eventCreated
  }
}

test('assignmentService.getAll() - success', async () => {
  const assignments = await assignmentService.getAll();
  expect(Array.isArray(assignments)).toBe(true);
  expect(assignments.length).toBeGreaterThanOrEqual(350);
  expect(assignments[0]).toHaveProperty('personId');
  expect(assignments[0]).toHaveProperty('eventId');
});

//#region assignmentService.delete() 

test('assignmentService.delete() - success', async () => {
  const { person, event } = await createPersonEventPair();
  const assignmentToCreate = {
    "personId": person.id,
    "eventId": event.id,
    "updateUser": "john.d.lednicky",
    "updateDttm": "2021-07-04 13:00:00.00"
  };
  const assignmentCreated = await assignmentService.create(assignmentToCreate);
  expect(assignmentCreated).toHaveProperty('personId');
  expect(assignmentCreated).toHaveProperty('eventId');

  const deleteResult = await assignmentService.delete(person.id, event.id);
  expect(deleteResult).toBe(1);

  const assignmentFetched = await assignmentService.find(person.id, event.id);
  expect(assignmentFetched).toBeUndefined();
});
test('assignmentService.delete() - not found', async () => {
  const assignments = await assignmentService.getAll();
  expect(Array.isArray(assignments)).toBe(true);
  const greatestId = Math.max.apply(Math, assignments.map((entity) => entity.personId));
  const deleteResult = await assignmentService.delete(greatestId + 305, 1);
  expect(deleteResult).toBe(0);
});
test('assignmentService.delete() - invalid id', async () => {
  await expect(assignmentService.delete('y', 1)).rejects.toThrow('personId is not a positive integer');
  await expect(assignmentService.delete('-1', 1)).rejects.toThrow('personId is not a positive integer');
  await expect(assignmentService.delete('0', 1)).rejects.toThrow('personId is not a positive integer');
  await expect(assignmentService.delete('0.1', 1)).rejects.toThrow('personId is not a positive integer');

  await expect(assignmentService.delete(1, 'y')).rejects.toThrow('eventId is not a positive integer');
  await expect(assignmentService.delete(1, '-1')).rejects.toThrow('eventId is not a positive integer');
  await expect(assignmentService.delete(1, '0')).rejects.toThrow('eventId is not a positive integer');
  await expect(assignmentService.delete(1, '0.1')).rejects.toThrow('eventId is not a positive integer');
});
test('assignmentService.delete() - missing id', async () => {
  await expect(assignmentService.delete(1)).rejects.toThrow('eventId is not a positive integer');
});

//#endregion assignmentService.delete() 

//#region assignmentService.find() 

test('assignmentService.find() - success', async () => {
  const { person, event } = await createPersonEventPair();
  const assignmentToCreate = {
    "personId": person.id,
    "eventId": event.id,
    "updateUser": "john.d.lednicky",
    "updateDttm": "2021-07-04 13:00:00.00"
  };
  const assignmentCreated = await assignmentService.create(assignmentToCreate);
  expect(assignmentCreated).toHaveProperty('personId');
  expect(assignmentCreated).toHaveProperty('eventId');

  const assignmentFetched = await assignmentService.find(assignmentCreated.personId, assignmentCreated.eventId);
  assignmentCreated.updateDttm = assignmentFetched.updateDttm;
  expect(assignmentFetched).toEqual(assignmentCreated);
});

test('assignmentService.find() - not found', async () => {
  const assignments = await assignmentService.getAll();
  expect(Array.isArray(assignments)).toBe(true);
  const greatestId = Math.max.apply(Math, assignments.map((entity) => entity.personId));
  const assignmentFetched = await assignmentService.find(greatestId + 65, 1);
  expect(assignmentFetched).toBeUndefined();
});

test('assignmentService.find() - invalid id', async () => {
  await expect(assignmentService.find('y', 1)).rejects.toThrow('personId is not a positive integer');
  await expect(assignmentService.find('-1', 1)).rejects.toThrow('personId is not a positive integer');
  await expect(assignmentService.find('0', 1)).rejects.toThrow('personId is not a positive integer');
  await expect(assignmentService.find('0.1', 1)).rejects.toThrow('personId is not a positive integer');

  await expect(assignmentService.find(1, 'y')).rejects.toThrow('eventId is not a positive integer');
  await expect(assignmentService.find(1, '-1')).rejects.toThrow('eventId is not a positive integer');
  await expect(assignmentService.find(1, '0')).rejects.toThrow('eventId is not a positive integer');
  await expect(assignmentService.find(1, '0.1')).rejects.toThrow('eventId is not a positive integer');
});
test('assignmentService.find() - missing id', async () => {
  await expect(assignmentService.find(1)).rejects.toThrow('eventId is not a positive integer');
});

//#endregion assignmentService.find() 

//#region assignmentService.create()

test('assignmentService.create() - success', async () => {
  const { person, event } = await createPersonEventPair();
  const assignmentToCreate = {
    "personId": person.id,
    "eventId": event.id,
    "updateUser": "john.d.lednicky",
    "updateDttm": "2021-07-04 13:00:00.00"
  };
  const assignmentCreated = await assignmentService.create(assignmentToCreate);
  expect(assignmentCreated).toHaveProperty('personId');
  expect(assignmentCreated).toHaveProperty('eventId');

  if (assignmentService.knexEnvironmentConfig.client == 'mysql2') {
    assignmentToCreate.updateDttm = parse(assignmentToCreate.updateDttm, 'yyyy-MM-dd HH:mm:ss.SS', new Date());
    assignmentCreated.updateDttm = parse(assignmentCreated.updateDttm, 'yyyy-MM-dd HH:mm:ss.SS', new Date());
  }

  expect(assignmentCreated).toEqual(assignmentToCreate);

  const assignmentFetched = await assignmentService.find(assignmentCreated.personId, assignmentCreated.eventId);

  expect(assignmentFetched).toEqual(assignmentCreated);
});

test('assignmentService.create() - personId missing', async () => {
  const { person, event } = await createPersonEventPair();
  const assignmentToCreate = {
    "eventId": event.id,
    "updateUser": "john.d.lednicky",
    "updateDttm": "2021-07-04 13:00:00.00"
  };
  await expect(assignmentService.create(assignmentToCreate)).rejects.toThrow('personId: is a required property');
});
test('assignmentService.create() - eventId missing', async () => {
  const { person, event } = await createPersonEventPair();
  const assignmentToCreate = {
    "personId": person.id,
    "updateUser": "john.d.lednicky",
    "updateDttm": "2021-07-04 13:00:00.00"
  };
  await expect(assignmentService.create(assignmentToCreate)).rejects.toThrow('eventId: is a required property');
});
test('assignmentService.create() - personId invalid - not a positive integer', async () => {
  const { person, event } = await createPersonEventPair();
  const assignmentToCreate = {
    "personId": -1,
    "eventId": event.id,
    "updateUser": "john.d.lednicky",
    "updateDttm": "2021-07-04 13:00:00.00"
  };
  await expect(assignmentService.create(assignmentToCreate)).rejects.toThrow('personId: should be >= 1');
});
test('assignmentService.create() - eventId invalid - not a positive integer', async () => {
  const { person, event } = await createPersonEventPair();
  const assignmentToCreate = {
    "personId": person.id,
    "eventId": -1,
    "updateUser": "john.d.lednicky",
    "updateDttm": "2021-07-04 13:00:00.00"
  };
  await expect(assignmentService.create(assignmentToCreate)).rejects.toThrow('eventId: should be >= 1');
});
test('assignmentService.create() - personId invalid - not a positive integer', async () => {
  const { person, event } = await createPersonEventPair();
  const assignmentToCreate = {
    "personId": 'a',
    "eventId": event.id,
    "updateUser": "john.d.lednicky",
    "updateDttm": "2021-07-04 13:00:00.00"
  };
  await expect(assignmentService.create(assignmentToCreate)).rejects.toThrow('personId: should be integer');
});
test('assignmentService.create() - eventId invalid - not a positive integer', async () => {
  const { person, event } = await createPersonEventPair();
  const assignmentToCreate = {
    "personId": person.id,
    "eventId": 'a',
    "updateUser": "john.d.lednicky",
    "updateDttm": "2021-07-04 13:00:00.00"
  };
  await expect(assignmentService.create(assignmentToCreate)).rejects.toThrow('eventId: should be integer');
});
test('assignmentService.create() - personId invalid - no related record', async () => {
  const allPersons = await personService.getAll();
  expect(Array.isArray(allPersons)).toBe(true);
  const greatestId = Math.max.apply(Math, allPersons.map((person) => person.id));

  const { person, event } = await createPersonEventPair();
  const assignmentToCreate = {
    "personId": greatestId + 1547,
    "eventId": event.id,
    "updateUser": "john.d.lednicky",
    "updateDttm": "2021-07-04 13:00:00.00"
  };
  await expect(assignmentService.create(assignmentToCreate)).rejects.toThrow(/(a foreign key constraint fail)|(FOREIGN KEY constraint failed)/);
});
test('assignmentService.create() - eventId invalid - no related record', async () => {
  const allEvents = await eventService.getAll();
  expect(Array.isArray(allEvents)).toBe(true);
  const greatestId = Math.max.apply(Math, allEvents.map((event) => event.id));

  const { person, event } = await createPersonEventPair();
  const assignmentToCreate = {
    "personId": person.id,
    "eventId": greatestId + 2547,
    "updateUser": "john.d.lednicky",
    "updateDttm": "2021-07-04 13:00:00.00"
  };
  await expect(assignmentService.create(assignmentToCreate)).rejects.toThrow(/(a foreign key constraint fail)|(FOREIGN KEY constraint failed)/);
});

test('assignmentService.create() - validation error updateUser too long', async () => {
  const assignmentToCreate = {
    "name": "Test",
    "description": "",
    'updateUser': 'a'.repeat(46),
    'updateDttm': '2021-07-04 13:00:00.00'
  };
  await expect(assignmentService.create(assignmentToCreate)).rejects.toThrow('updateUser: should NOT be longer than 45 characters');
});
test('assignmentService.create() - validation error updateUser missing', async () => {
  const assignmentToCreate = {
    "name": "Invalid@",
    "description": "",
    'updateDttm': '2021-07-04 13:00:00.00'
  };
  await expect(assignmentService.create(assignmentToCreate)).rejects.toThrow('updateUser: is a required property');
});
test('assignmentService.create() - validation error updateUser empty string', async () => {
  const assignmentToCreate = {
    "name": "Test",
    "description": "",
    'updateUser': '',
    'updateDttm': '2021-07-04 13:00:00.00'
  };
  await expect(assignmentService.create(assignmentToCreate)).rejects.toThrow('updateUser: should match pattern "^[a-zA-Z0-9 .-@]+$", should NOT be shorter than 1 characters');
});
test('assignmentService.create() - validation error updateUser has updateUser characters', async () => {
  const assignmentToCreate = {
    "name": "Test",
    "description": "",
    'updateUser': 'john.d.ledni$cky',
    'updateDttm': '2021-07-04 13:00:00.00'
  };
  await expect(assignmentService.create(assignmentToCreate)).rejects.toThrow('updateUser: should match pattern "^[a-zA-Z0-9 .-@]+$"');
});

test('assignmentService.create() - validation error updateDttm missing', async () => {
  const assignmentToCreate = {
    "name": "Test",
    "description": "",
    'updateUser': 'john.d.lednicky'
  };
  await expect(assignmentService.create(assignmentToCreate)).rejects.toThrow('updateDttm: is a required property');
});
test('assignmentService.create() - validation error updateDttm empty string', async () => {
  const assignmentToCreate = {
    "name": "Test",
    "description": "",
    'updateUser': 'john.d.lednick',
    'updateDttm': ''
  };
  await expect(assignmentService.create(assignmentToCreate)).rejects.toThrow('updateDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
});
test('assignmentService.create() - validation error updateDttm has invalid characters', async () => {
  const assignmentToCreate = {
    "name": "Test",
    "description": "",
    'updateUser': 'john.d.ledni$cky',
    'updateDttm': '7-4-2021'
  };
  await expect(assignmentService.create(assignmentToCreate)).rejects.toThrow('updateDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
});
//#endregion assignmentService.create()

