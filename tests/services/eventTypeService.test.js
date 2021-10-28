/* eslint-disable no-undef */
const fs = require('fs');

// #region Setup

jest.setTimeout(20000);

const knexEnvName = 'autotest_eventTypeService'; /* This should match a sqlite3 environment in the knex file */
// const knexEnvName = 'development'; /* This might not be idempotent. */

/* set up service */
const eventTypeService = require('../../services/eventTypeService')(knexEnvName);

beforeAll(async () => {
  /* delete database file if it exists (it should not) */
  if (eventTypeService.knexEnvironmentConfig.connection.filename
      && fs.existsSync(eventTypeService.knexEnvironmentConfig.connection.filename)) {
    fs.unlinkSync(eventTypeService.knexEnvironmentConfig.connection.filename);
  }
  /* use knex to populate a new sqlite3 database */
  await eventTypeService.knex.migrate.latest();
  await eventTypeService.knex.seed.run();
});
afterAll(async () => {
  /* destroy knex and delete the database file */
  await eventTypeService.knex.destroy();
  if (eventTypeService.knexEnvironmentConfig.connection.filename
      && fs.existsSync(eventTypeService.knexEnvironmentConfig.connection.filename)) {
    fs.unlinkSync(eventTypeService.knexEnvironmentConfig.connection.filename);
  }
});
// #endregion Setup

test('eventTypeService.getAll() - success', async () => {
  const eventTypes = await eventTypeService.getAll();
  expect(Array.isArray(eventTypes)).toBe(true);
  expect(eventTypes.length).toBeGreaterThanOrEqual(4);
  expect(eventTypes[0]).toHaveProperty('id');
});

// #region eventTypeService.delete()

test('eventTypeService.delete() - success', async () => {
  const eventTypeToCreate = {
    name: 'Test Event Type',
    description: '',
  };
  const eventTypeCreated = await eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp());
  expect(eventTypeCreated).toHaveProperty('id');

  const deleteResult = await eventTypeService.delete(eventTypeCreated.id);
  expect(deleteResult).toBe(1);

  const eventTypeFetched = await eventTypeService.find(eventTypeCreated.id);
  expect(eventTypeFetched).toBeUndefined();
});

test('eventTypeService.delete() - not found', async () => {
  const eventTypes = await eventTypeService.getAll();
  expect(Array.isArray(eventTypes)).toBe(true);
  const greatestId = Math.max(...eventTypes.map((entity) => entity.id));
  const deleteResult = await eventTypeService.delete(greatestId + 509);
  expect(deleteResult).toBe(0);
});

test('eventTypeService.delete() - invalid id', async () => {
  await expect(eventTypeService.delete('y')).rejects.toThrow('id is not a positive integer');
  await expect(eventTypeService.delete('-1')).rejects.toThrow('id is not a positive integer');
  await expect(eventTypeService.delete('0')).rejects.toThrow('id is not a positive integer');
  await expect(eventTypeService.delete('0.1')).rejects.toThrow('id is not a positive integer');
});

// #endregion eventTypeService.delete()

// #region eventTypeService.find()

test('eventTypeService.find() - success', async () => {
  const eventTypeToCreate = {
    name: 'Test Event Type',
    description: '',
  };
  const eventTypeCreated = await eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp());
  expect(eventTypeCreated).toHaveProperty('id');

  const eventTypeFetched = await eventTypeService.find(eventTypeCreated.id);
  expect(eventTypeFetched.id).toEqual(eventTypeCreated.id);
  expect(eventTypeFetched.name).toEqual(eventTypeCreated.name);
  expect(eventTypeFetched.description).toEqual(eventTypeCreated.description);
});

test('eventTypeService.find() - not found', async () => {
  const eventTypes = await eventTypeService.getAll();
  expect(Array.isArray(eventTypes)).toBe(true);
  const greatestId = Math.max(...eventTypes.map((entity) => entity.id));
  const eventTypeFetched = await eventTypeService.find(greatestId + 45);
  expect(eventTypeFetched).toBeUndefined();
});

test('eventTypeService.find() - invalid id', async () => {
  await expect(eventTypeService.find('y')).rejects.toThrow('id is not a positive integer');
  await expect(eventTypeService.find('-1')).rejects.toThrow('id is not a positive integer');
  await expect(eventTypeService.find('0')).rejects.toThrow('id is not a positive integer');
  await expect(eventTypeService.find('0.1')).rejects.toThrow('id is not a positive integer');
});

// #endregion eventTypeService.find()

// #region eventTypeService.create()

test('eventTypeService.create() - success', async () => {
  const eventTypeToCreate = {
    name: 'Test Event Type',
    description: '',
  };
  const eventTypeCreated = await eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp());
  expect(eventTypeCreated).toHaveProperty('id');

  eventTypeToCreate.id = eventTypeCreated.id;

  expect(eventTypeCreated.name).toEqual(eventTypeToCreate.name);
  expect(eventTypeCreated.description).toEqual(eventTypeToCreate.description);

  const eventTypeFetched = await eventTypeService.find(eventTypeCreated.id);

  expect(eventTypeFetched.name).toEqual(eventTypeCreated.name);
  expect(eventTypeFetched.description).toEqual(eventTypeCreated.description);
  expect(eventTypeFetched.id).toEqual(eventTypeCreated.id);
});

test('eventTypeService.create() - validation error name too long', async () => {
  const eventTypeToCreate = {
    name: 'a'.repeat(26),
    description: '',
  };
  await expect(eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp())).rejects.toThrow('name: should NOT be longer than 25 characters');
});
test('eventTypeService.create() - validation error name missing', async () => {
  const eventTypeToCreate = {
    description: '',
  };
  await expect(eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp())).rejects.toThrow('name: is a required property');
});
test('eventTypeService.create() - validation error name empty string', async () => {
  const eventTypeToCreate = {
    name: '',
    description: '',
  };
  await expect(eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp())).rejects.toThrow('name: should match pattern');
});
test('eventTypeService.create() - validation error name has invalid characters', async () => {
  const eventTypeToCreate = {
    name: 'Invalid@',
    description: '',
  };
  await expect(eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp())).rejects.toThrow('name: should match pattern');
});

test('eventTypeService.create() - validation error description too long', async () => {
  const eventTypeToCreate = {
    name: 'test',
    description: 'a'.repeat(251),
  };
  await expect(eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp())).rejects.toThrow('description: should NOT be longer than 250 characters');
});

test('eventTypeService.create() - validation error description has invalid characters', async () => {
  const eventTypeToCreate = {
    name: 'Test',
    description: 'Some things cannot be described%',
  };
  await expect(eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp())).rejects.toThrow('description: should match pattern');
});

test('eventTypeService.create() - validation error updateUser too long', async () => {
  const eventTypeToCreate = {
    name: 'Test',
    description: '',
  };
  const username = 'a'.repeat(201);
  const timestamp = eventTypeService.getCurrentTimestamp();
  await expect(eventTypeService.create(eventTypeToCreate, username, timestamp))
    .rejects.toThrow('updateUser: should NOT be longer than 200 characters');
});
test('eventTypeService.create() - validation error updateUser missing', async () => {
  const eventTypeToCreate = {
    name: 'Test',
    description: '',
  };
  const username = null;
  const timestamp = eventTypeService.getCurrentTimestamp();
  await expect(eventTypeService.create(eventTypeToCreate, username, timestamp))
    .rejects.toThrow('missing updateUser');
});
test('eventTypeService.create() - validation error updateUser empty string', async () => {
  const eventTypeToCreate = {
    name: 'Test',
    description: '',
  };
  const username = '';
  const timestamp = eventTypeService.getCurrentTimestamp();
  await expect(eventTypeService.create(eventTypeToCreate, username, timestamp))
    .rejects.toThrow('missing updateUser');
});
test('eventTypeService.create() - validation error updateUser has invalid characters', async () => {
  const eventTypeToCreate = {
    name: 'Test',
    description: '',
  };
  const username = 'dot with spaces';
  const timestamp = eventTypeService.getCurrentTimestamp();
  await expect(eventTypeService.create(eventTypeToCreate, username, timestamp))
    .rejects.toThrow('updateUser: should match pattern');
});
test('eventTypeService.create() - validation error updateDttm missing', async () => {
  const eventTypeToCreate = {
    name: 'Test',
    description: '',
  };
  const username = 'test.user@dot.com';
  await expect(eventTypeService.create(eventTypeToCreate, username))
    .rejects.toThrow('missing timestamp');
});
test('eventTypeService.create() - validation error updateDttm empty string', async () => {
  const eventTypeToCreate = {
    name: 'Test',
    description: '',
  };
  const username = 'test.user';
  const timestamp = '';
  await expect(eventTypeService.create(eventTypeToCreate, username, timestamp))
    .rejects.toThrow('missing timestamp');
});
test('eventTypeService.create() - validation error updateDttm has invalid characters', async () => {
  const eventTypeToCreate = {
    name: 'Test',
    description: '',
  };
  const username = 'test.user';
  const timestamp = 'non-number';
  await expect(eventTypeService.create(eventTypeToCreate, username, timestamp))
    .rejects.toThrow('updateDttm: should be integer');
});
// #endregion eventTypeService.create()

// #region eventTypeService.update()

test('eventTypeService.update() - success', async () => {
  const eventTypeToCreate = {
    name: 'Test Event Type',
    description: '',
  };
  const eventTypeCreated = await eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp());
  expect(eventTypeCreated).toHaveProperty('id');

  eventTypeCreated.description = 'Test description';
  delete eventTypeCreated.updateUser;
  delete eventTypeCreated.updateDttm;

  const eventTypeUpdated = await eventTypeService.update(eventTypeCreated, 'test.user', eventTypeService.getCurrentTimestamp());
  expect(eventTypeUpdated.id).toEqual(eventTypeCreated.id);
  expect(eventTypeUpdated.name).toEqual(eventTypeCreated.name);
  expect(eventTypeUpdated.description).toEqual(eventTypeCreated.description);

  const eventTypeFetched = await eventTypeService.find(eventTypeUpdated.id);
  expect(eventTypeFetched.id).toEqual(eventTypeUpdated.id);
  expect(eventTypeFetched.name).toEqual(eventTypeUpdated.name);
  expect(eventTypeFetched.description).toEqual(eventTypeUpdated.description);
});

test('eventTypeService.update() - validation error name too long', async () => {
  const eventTypeToCreate = {
    name: 'Test Event Type',
    description: '',
  };
  const eventTypeCreated = await eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp());
  expect(eventTypeCreated).toHaveProperty('id');
  delete eventTypeCreated.updateUser;
  delete eventTypeCreated.updateDttm;

  eventTypeCreated.name = 'a'.repeat(26);

  await expect(eventTypeService.update(eventTypeCreated, 'test.user', eventTypeService.getCurrentTimestamp())).rejects.toThrow('name: should NOT be longer than 25 characters');
});
test('eventTypeService.update() - validation error name missing', async () => {
  const eventTypeToCreate = {
    name: 'Test Event Type',
    description: '',
  };
  const eventTypeCreated = await eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp());
  expect(eventTypeCreated).toHaveProperty('id');
  delete eventTypeCreated.updateUser;
  delete eventTypeCreated.updateDttm;

  delete eventTypeCreated.name;

  await expect(eventTypeService.update(eventTypeCreated, 'test.user', eventTypeService.getCurrentTimestamp())).rejects.toThrow('name: is a required property');
});
test('eventTypeService.udpate() - validation error name empty string', async () => {
  const eventTypeToCreate = {
    name: 'Test Event Type',
    description: '',
  };
  const eventTypeCreated = await eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp());
  expect(eventTypeCreated).toHaveProperty('id');
  delete eventTypeCreated.updateUser;
  delete eventTypeCreated.updateDttm;

  eventTypeCreated.name = '';

  await expect(eventTypeService.update(eventTypeCreated, 'test.user', eventTypeService.getCurrentTimestamp())).rejects.toThrow('name: should match pattern');
});
test('eventTypeService.update() - validation error name has invalid characters', async () => {
  const eventTypeToCreate = {
    name: 'Test Event Type',
    description: '',
  };
  const eventTypeCreated = await eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp());
  expect(eventTypeCreated).toHaveProperty('id');
  delete eventTypeCreated.updateUser;
  delete eventTypeCreated.updateDttm;

  eventTypeCreated.name = '876TGF#';

  await expect(eventTypeService.update(eventTypeCreated, 'test.user', eventTypeService.getCurrentTimestamp())).rejects.toThrow('name: should match pattern');
});

test('eventTypeService.update() - validation error description too long', async () => {
  const eventTypeToCreate = {
    name: 'Test Event Type',
    description: '',
  };
  const eventTypeCreated = await eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp());
  expect(eventTypeCreated).toHaveProperty('id');
  delete eventTypeCreated.updateUser;
  delete eventTypeCreated.updateDttm;

  eventTypeCreated.description = 'a'.repeat(251);

  await expect(eventTypeService.update(eventTypeCreated, 'test.user', eventTypeService.getCurrentTimestamp())).rejects.toThrow('description: should NOT be longer than 250 characters');
});
test('eventTypeService.update() - validation error description is invalid', async () => {
  const eventTypeToCreate = {
    name: 'Test Event Type',
    description: '',
  };
  const eventTypeCreated = await eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp());
  expect(eventTypeCreated).toHaveProperty('id');
  delete eventTypeCreated.updateUser;
  delete eventTypeCreated.updateDttm;

  eventTypeCreated.description = 'Some $#^ things should be left unsaid.';

  await expect(eventTypeService.update(eventTypeCreated, 'test.user', eventTypeService.getCurrentTimestamp())).rejects.toThrow('description: should match pattern');
});

test('eventTypeService.update() - validation error updateUser too long', async () => {
  const eventTypeToCreate = {
    name: 'Test Event Type',
    description: '',
  };
  const eventTypeCreated = await eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp());
  expect(eventTypeCreated).toHaveProperty('id');
  delete eventTypeCreated.updateUser;
  delete eventTypeCreated.updateDttm;

  await expect(eventTypeService.update(eventTypeCreated, 'a'.repeat(201), eventTypeService.getCurrentTimestamp()))
    .rejects.toThrow('updateUser: should NOT be longer than 200 characters');
});
test('eventTypeService.update() - validation error updateUser missing', async () => {
  const eventTypeToCreate = {
    name: 'Test Event Type',
    description: '',
  };
  const eventTypeCreated = await eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp());
  expect(eventTypeCreated).toHaveProperty('id');
  delete eventTypeCreated.updateUser;
  delete eventTypeCreated.updateDttm;

  delete eventTypeCreated.updateUser;

  await expect(eventTypeService.update(eventTypeCreated, null,
    eventTypeService.getCurrentTimestamp()))
    .rejects.toThrow('missing updateUser');
});
test('eventTypeService.update() - validation error updateUser empty string', async () => {
  const eventTypeToCreate = {
    name: 'Test Event Type',
    description: '',
  };
  const eventTypeCreated = await eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp());
  expect(eventTypeCreated).toHaveProperty('id');
  delete eventTypeCreated.updateUser;
  delete eventTypeCreated.updateDttm;

  await expect(eventTypeService.update(eventTypeCreated, '', eventTypeService.getCurrentTimestamp()))
    .rejects.toThrow('missing updateUser');
});
test('eventTypeService.update() - validation error updateUser has invalid characters', async () => {
  const eventTypeToCreate = {
    name: 'Test Event Type',
    description: '',
  };
  const eventTypeCreated = await eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp());
  expect(eventTypeCreated).toHaveProperty('id');
  delete eventTypeCreated.updateUser;
  delete eventTypeCreated.updateDttm;

  const updateUser = 'john space lednicky';

  await expect(eventTypeService.update(eventTypeCreated, updateUser,
    eventTypeService.getCurrentTimestamp()))
    .rejects.toThrow('updateUser: should match pattern');
});
test('eventTypeService.update() - validation error updateDttm missing', async () => {
  const eventTypeToCreate = {
    name: 'Test Event Type',
    description: '',
  };
  const eventTypeCreated = await eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp());
  expect(eventTypeCreated).toHaveProperty('id');
  delete eventTypeCreated.updateUser;
  delete eventTypeCreated.updateDttm;

  await expect(eventTypeService.update(eventTypeCreated, 'test.user'))
    .rejects.toThrow('missing timestamp');
});
test('eventTypeService.update() - validation error updateDttm empty string', async () => {
  const eventTypeToCreate = {
    name: 'Test Event Type',
    description: '',
  };
  const eventTypeCreated = await eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp());
  expect(eventTypeCreated).toHaveProperty('id');
  delete eventTypeCreated.updateUser;
  delete eventTypeCreated.updateDttm;

  await expect(eventTypeService.update(eventTypeCreated, 'test.user', ''))
    .rejects.toThrow('missing timestamp');
});
test('eventTypeService.create() - validation error updateDttm is invalid', async () => {
  const eventTypeToCreate = {
    name: 'Test Event Type',
    description: '',
  };
  const eventTypeCreated = await eventTypeService.create(eventTypeToCreate, 'test.user', eventTypeService.getCurrentTimestamp());
  expect(eventTypeCreated).toHaveProperty('id');
  delete eventTypeCreated.updateUser;
  delete eventTypeCreated.updateDttm;

  await expect(eventTypeService.update(eventTypeCreated, 'test.user', 'not a timestamp'))
    .rejects.toThrow('updateDttm: should be integer');
});

// #endregion eventTypeService.update()
