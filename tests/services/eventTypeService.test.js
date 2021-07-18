const fs = require('fs');
const { format, parse } = require('date-fns');

//#region Setup
const jestConfig = require('../../jest.config.js');
jest.setTimeout(20000);

const knexEnvName = 'autotest_eventTypeService'; /* This should match a sqlite3 environment in the knex file */
//const knexEnvName = 'development'; /* This might not be idempotent because it depends on the state of the external dev mysql database*/

/* set up service */
const eventTypeService = require('../../services/eventTypeService.js')(knexEnvName);

beforeAll(async () => {
    /* delete database file if it exists (it should not) */
    if (eventTypeService.knexEnvironmentConfig.connection.filename && fs.existsSync(eventTypeService.knexEnvironmentConfig.connection.filename)) {
        fs.unlinkSync(eventTypeService.knexEnvironmentConfig.connection.filename);
    }
    /* use knex to populate a new sqllite3 database */
    await eventTypeService.knex.migrate.latest();
    await eventTypeService.knex.seed.run();
});
afterAll(async () => {
    /* destroy knex and delete the database file */
    await eventTypeService.knex.destroy();
    if (eventTypeService.knexEnvironmentConfig.connection.filename && fs.existsSync(eventTypeService.knexEnvironmentConfig.connection.filename)) {
        fs.unlinkSync(eventTypeService.knexEnvironmentConfig.connection.filename);
    }
});
//#endregion Setup

test('eventTypeService.getAll() - success', async () => {
    const eventTypes = await eventTypeService.getAll();
    expect(Array.isArray(eventTypes)).toBe(true);
    expect(eventTypes.length).toBeGreaterThanOrEqual(4);
    expect(eventTypes[0]).toHaveProperty('id');
});

//#region eventTypeService.delete() 

test('eventTypeService.delete() - success', async () => {
    const eventTypeToCreate = {
        "name": "Test Event Type",
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    const eventTypeCreated = await eventTypeService.create(eventTypeToCreate);
    expect(eventTypeCreated).toHaveProperty('id');

    const deleteResult = await eventTypeService.delete(eventTypeCreated.id);
    expect(deleteResult).toBe(1);

    const eventTypeFetched = await eventTypeService.find(eventTypeCreated.id);
    expect(eventTypeFetched).toBeUndefined();
});

test('eventTypeService.delete() - not found', async () => {
    const eventTypes = await eventTypeService.getAll();
    expect(Array.isArray(eventTypes)).toBe(true);
    const greatestId = Math.max.apply(Math, eventTypes.map((entity) => entity.id));
    const deleteResult = await eventTypeService.delete(greatestId + 509);
    expect(deleteResult).toBe(0);
});

test('eventTypeService.delete() - invalid id', async () => {
    await expect(eventTypeService.delete('y')).rejects.toThrow('id is not a positive integer');
    await expect(eventTypeService.delete('-1')).rejects.toThrow('id is not a positive integer');
    await expect(eventTypeService.delete('0')).rejects.toThrow('id is not a positive integer');
    await expect(eventTypeService.delete('0.1')).rejects.toThrow('id is not a positive integer');
});

//#endregion eventTypeService.delete() 

//#region eventTypeService.find() 

test('eventTypeService.find() - success', async () => {
    const eventTypeToCreate = {
        "name": "Test Event Type",
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    const eventTypeCreated = await eventTypeService.create(eventTypeToCreate);
    expect(eventTypeCreated).toHaveProperty('id');

    const eventTypeFetched = await eventTypeService.find(eventTypeCreated.id);
    expect(eventTypeFetched).toEqual(eventTypeCreated);
});

test('eventTypeService.find() - not found', async () => {
    const eventTypes = await eventTypeService.getAll();
    expect(Array.isArray(eventTypes)).toBe(true);
    const greatestId = Math.max.apply(Math, eventTypes.map((entity) => entity.id));
    const eventTypeFetched = await eventTypeService.find(greatestId + 45);
    expect(eventTypeFetched).toBeUndefined();
});

test('eventTypeService.find() - invalid id', async () => {
    await expect(eventTypeService.find('y')).rejects.toThrow('id is not a positive integer');
    await expect(eventTypeService.find('-1')).rejects.toThrow('id is not a positive integer');
    await expect(eventTypeService.find('0')).rejects.toThrow('id is not a positive integer');
    await expect(eventTypeService.find('0.1')).rejects.toThrow('id is not a positive integer');
});

//#endregion eventTypeService.find() 

//#region eventTypeService.create()

test('eventTypeService.create() - success', async () => {
    const eventTypeToCreate = {
        "name": "Test Event Type",
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    const eventTypeCreated = await eventTypeService.create(eventTypeToCreate);
    expect(eventTypeCreated).toHaveProperty('id');

    eventTypeToCreate.id = eventTypeCreated.id;
    
    if (eventTypeService.knexEnvironmentConfig.client == 'mysql2') {
        eventTypeToCreate.updateDttm = parse(eventTypeToCreate.updateDttm, 'yyyy-MM-dd HH:mm:ss.SS', new Date());
    }
    
    expect(eventTypeCreated).toEqual(eventTypeToCreate);

    const eventTypeFetched = await eventTypeService.find(eventTypeCreated.id);

    expect(eventTypeFetched).toEqual(eventTypeCreated);
});

test('eventTypeService.create() - validation error name too long', async () => {
    const eventTypeToCreate = {
        "name": 'a'.repeat(26),
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    await expect(eventTypeService.create(eventTypeToCreate)).rejects.toThrow('name: should NOT be longer than 25 characters');
});
test('eventTypeService.create() - validation error name missing', async () => {
    const eventTypeToCreate = {
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    await expect(eventTypeService.create(eventTypeToCreate)).rejects.toThrow('name: is a required property');
});
test('eventTypeService.create() - validation error name empty string', async () => {
    const eventTypeToCreate = {
        "name": "",
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    await expect(eventTypeService.create(eventTypeToCreate)).rejects.toThrow('name: should match pattern "^[a-zA-Z ,.\'-]+$", should NOT be shorter than 1 characters');
});
test('eventTypeService.create() - validation error name has invalid characters', async () => {
    const eventTypeToCreate = {
        "name": "Invalid@",
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    await expect(eventTypeService.create(eventTypeToCreate)).rejects.toThrow('name: should match pattern "^[a-zA-Z ,.\'-]+$"');
});

test('eventTypeService.create() - validation error description too long', async () => {
    const eventTypeToCreate = {
        "name": 'test',
        "description": 'a'.repeat(251),
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    await expect(eventTypeService.create(eventTypeToCreate)).rejects.toThrow('description: should NOT be longer than 250 characters');
});

test('eventTypeService.create() - validation error description has invalid characters', async () => {
    const eventTypeToCreate = {
        "name": "Test",
        "description": "Some things cannot be described%",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    await expect(eventTypeService.create(eventTypeToCreate)).rejects.toThrow('description: should match pattern "^[a-zA-Z0-9 .,:;\\-?!&/\\\\\']*$"');
});

test('eventTypeService.create() - validation error updateUser too long', async () => {
    const eventTypeToCreate = {
        "name": "Test",
        "description": "",
        'updateUser': 'a'.repeat(46),
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(eventTypeService.create(eventTypeToCreate)).rejects.toThrow('updateUser: should NOT be longer than 45 characters');
});
test('eventTypeService.create() - validation error updateUser missing', async () => {
    const eventTypeToCreate = {
        "name": "Invalid@",
        "description": "",
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(eventTypeService.create(eventTypeToCreate)).rejects.toThrow('updateUser: is a required property');
});
test('eventTypeService.create() - validation error updateUser empty string', async () => {
    const eventTypeToCreate = {
        "name": "Test",
        "description": "",
        'updateUser': '',
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(eventTypeService.create(eventTypeToCreate)).rejects.toThrow('updateUser: should match pattern "^[a-zA-Z0-9 .-@]+$", should NOT be shorter than 1 characters');
});
test('eventTypeService.create() - validation error updateUser has updateUser characters', async () => {
    const eventTypeToCreate = {
        "name": "Test",
        "description": "",
        'updateUser': 'john.d.ledni$cky',
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(eventTypeService.create(eventTypeToCreate)).rejects.toThrow('updateUser: should match pattern "^[a-zA-Z0-9 .-@]+$"');
});

test('eventTypeService.create() - validation error updateDttm missing', async () => {
    const eventTypeToCreate = {
        "name": "Test",
        "description": "",
        'updateUser': 'john.d.lednicky'
    };
    await expect(eventTypeService.create(eventTypeToCreate)).rejects.toThrow('updateDttm: is a required property');
});
test('eventTypeService.create() - validation error updateDttm empty string', async () => {
    const eventTypeToCreate = {
        "name": "Test",
        "description": "",
        'updateUser': 'john.d.lednick',
        'updateDttm': ''
    };
    await expect(eventTypeService.create(eventTypeToCreate)).rejects.toThrow('updateDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
});
test('eventTypeService.create() - validation error updateDttm has invalid characters', async () => {
    const eventTypeToCreate = {
        "name": "Test",
        "description": "",
        'updateUser': 'john.d.ledni$cky',
        'updateDttm': '7-4-2021'
    };
    await expect(eventTypeService.create(eventTypeToCreate)).rejects.toThrow('updateDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
});
//#endregion eventTypeService.create()

//#region eventTypeService.update()

test('eventTypeService.update() - success', async () => {
    const eventTypeToCreate = {
        "name": "Test Event Type",
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    const eventTypeCreated = await eventTypeService.create(eventTypeToCreate);
    expect(eventTypeCreated).toHaveProperty('id');

    eventTypeCreated.description = 'Test description';
    eventTypeCreated.updateDttm = eventTypeToCreate.updateDttm;

    const eventTypeUpdated = await eventTypeService.update(eventTypeCreated);
    expect(eventTypeUpdated).toEqual(eventTypeCreated);
    expect(eventTypeUpdated.description).toEqual('Test description');

    const eventTypeFetched = await eventTypeService.find(eventTypeUpdated.id);
    expect(eventTypeFetched).toEqual(eventTypeUpdated);
});

test('eventTypeService.update() - validation error name too long', async () => {
    const eventTypeToCreate = {
        "name": "Test Event Type",
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    const eventTypeCreated = await eventTypeService.create(eventTypeToCreate);
    expect(eventTypeCreated).toHaveProperty('id');

    eventTypeCreated.name = 'a'.repeat(26);

    await expect(eventTypeService.update(eventTypeCreated)).rejects.toThrow('name: should NOT be longer than 25 characters');
});
test('eventTypeService.update() - validation error name missing', async () => {
    const eventTypeToCreate = {
        "name": "Test Event Type",
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    const eventTypeCreated = await eventTypeService.create(eventTypeToCreate);
    expect(eventTypeCreated).toHaveProperty('id');

    delete eventTypeCreated.name;

    await expect(eventTypeService.update(eventTypeCreated)).rejects.toThrow('name: is a required property');

});
test('eventTypeService.udpate() - validation error name empty string', async () => {
    const eventTypeToCreate = {
        "name": "Test Event Type",
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    const eventTypeCreated = await eventTypeService.create(eventTypeToCreate);
    expect(eventTypeCreated).toHaveProperty('id');

    eventTypeCreated.name = '';

    await expect(eventTypeService.update(eventTypeCreated)).rejects.toThrow('name: should match pattern "^[a-zA-Z ,.\'-]+$", should NOT be shorter than 1 characters');
});
test('eventTypeService.update() - validation error name has invalid characters', async () => {
    const eventTypeToCreate = {
        "name": "Test Event Type",
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    const eventTypeCreated = await eventTypeService.create(eventTypeToCreate);
    expect(eventTypeCreated).toHaveProperty('id');

    eventTypeCreated.name = '876TGF#';

    await expect(eventTypeService.update(eventTypeCreated)).rejects.toThrow('name: should match pattern "^[a-zA-Z ,.\'-]+$"');
});

test('eventTypeService.update() - validation error description too long', async () => {
    const eventTypeToCreate = {
        "name": "Test Event Type",
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    const eventTypeCreated = await eventTypeService.create(eventTypeToCreate);
    expect(eventTypeCreated).toHaveProperty('id');

    eventTypeCreated.description = 'a'.repeat(251);

    await expect(eventTypeService.update(eventTypeCreated)).rejects.toThrow('description: should NOT be longer than 250 characters');
});
test('eventTypeService.update() - validation error description is invalid', async () => {
    const eventTypeToCreate = {
        "name": "Test Event Type",
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    const eventTypeCreated = await eventTypeService.create(eventTypeToCreate);
    expect(eventTypeCreated).toHaveProperty('id');

    eventTypeCreated.description = 'Some $#^ things should be left unsaid.';

    await expect(eventTypeService.update(eventTypeCreated)).rejects.toThrow('description: should match pattern "^[a-zA-Z0-9 .,:;\\-?!&/\\\\\']*$"');
});

test('eventTypeService.update() - validation error updateUser too long', async () => {
    const eventTypeToCreate = {
        "name": "Test Event Type",
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    const eventTypeCreated = await eventTypeService.create(eventTypeToCreate);
    expect(eventTypeCreated).toHaveProperty('id');

    eventTypeCreated.updateUser = 'a'.repeat(46);

    await expect(eventTypeService.update(eventTypeCreated)).rejects.toThrow('updateUser: should NOT be longer than 45 characters');
});
test('eventTypeService.update() - validation error updateUser missing', async () => {
    const eventTypeToCreate = {
        "name": "Test Event Type",
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    const eventTypeCreated = await eventTypeService.create(eventTypeToCreate);
    expect(eventTypeCreated).toHaveProperty('id');

    delete eventTypeCreated.updateUser;

    await expect(eventTypeService.update(eventTypeCreated)).rejects.toThrow('updateUser: is a required property');
});
test('eventTypeService.update() - validation error updateUser empty string', async () => {
    const eventTypeToCreate = {
        "name": "Test Event Type",
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    const eventTypeCreated = await eventTypeService.create(eventTypeToCreate);
    expect(eventTypeCreated).toHaveProperty('id');

    eventTypeCreated.updateUser = '';

    await expect(eventTypeService.update(eventTypeCreated)).rejects.toThrow('updateUser: should match pattern "^[a-zA-Z0-9 .-@]+$", should NOT be shorter than 1 characters');
});
test('eventTypeService.update() - validation error updateUser has invalid characters', async () => {
    const eventTypeToCreate = {
        "name": "Test Event Type",
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    const eventTypeCreated = await eventTypeService.create(eventTypeToCreate);
    expect(eventTypeCreated).toHaveProperty('id');

    eventTypeCreated.updateUser = 'john.d.ledni&^y';

    await expect(eventTypeService.update(eventTypeCreated)).rejects.toThrow('updateUser: should match pattern "^[a-zA-Z0-9 .-@]+$"');
});

test('eventTypeService.update() - validation error updateDttm missing', async () => {
    const eventTypeToCreate = {
        "name": "Test Event Type",
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    const eventTypeCreated = await eventTypeService.create(eventTypeToCreate);
    expect(eventTypeCreated).toHaveProperty('id');

    delete eventTypeCreated.updateDttm;

    await expect(eventTypeService.update(eventTypeCreated)).rejects.toThrow('updateDttm: is a required property');
});
test('eventTypeService.update() - validation error updateDttm empty string', async () => {
    const eventTypeToCreate = {
        "name": "Test Event Type",
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    const eventTypeCreated = await eventTypeService.create(eventTypeToCreate);
    expect(eventTypeCreated).toHaveProperty('id');

    eventTypeCreated.updateDttm = '';

    await expect(eventTypeService.update(eventTypeCreated)).rejects.toThrow('updateDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
});
test('eventTypeService.create() - validation error updateDttm is invalid', async () => {
    const eventTypeToCreate = {
        "name": "Test Event Type",
        "description": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    const eventTypeCreated = await eventTypeService.create(eventTypeToCreate);
    expect(eventTypeCreated).toHaveProperty('id');

    eventTypeCreated.updateDttm = '7-4-2021';

    await expect(eventTypeService.update(eventTypeCreated)).rejects.toThrow('updateDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
});
//#endregion eventTypeService.update()

