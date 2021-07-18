const fs = require('fs');
const { format, parse } = require('date-fns');

const jestConfig = require('../../jest.config.js');
jest.setTimeout(20000);

const knexEnvName = 'autotest_eventService'; /* This should match a sqlite3 environment in the knex file */
//const knexEnvName = 'development'; /* This might not be idempotent because it depends on the state of the external dev mysql database*/

/* set up service */
const eventService = require('../../services/eventService.js')(knexEnvName);
const eventTypeService = require('../../services/eventTypeService.js')(knexEnvName);

beforeAll(async () => {
    /* delete database file if it exists (it should not) */
    if (eventService.knexEnvironmentConfig.connection.filename && fs.existsSync(eventService.knexEnvironmentConfig.connection.filename)) {
        fs.unlinkSync(eventService.knexEnvironmentConfig.connection.filename);
    }
    await eventService.knex.migrate.latest();
    await eventService.knex.seed.run();
});
afterAll(async () => {
    /* destroy knex and delete the database file */
    await eventService.knex.destroy();
    if (eventService.knexEnvironmentConfig.connection.filename && fs.existsSync(eventService.knexEnvironmentConfig.connection.filename)) {
        fs.unlinkSync(eventService.knexEnvironmentConfig.connection.filename);
    }
});

test('eventService.getAll() - success', async () => {
    const allevents = await eventService.getAll();
    expect(Array.isArray(allevents)).toBe(true);
    expect(allevents.length).toBeGreaterThanOrEqual(300);
    expect(allevents[0]).toHaveProperty('id');
});

//#region eventService.delete() 

test('eventService.delete() - success', async () => {
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
    expect(eventCreated).toHaveProperty('id');

    const deleteResult = await eventService.delete(eventCreated.id);
    expect(deleteResult).toBe(1);

    const eventFetched = await eventService.find(eventCreated.id);
    expect(eventFetched).toBeUndefined();
});

test('eventService.delete() - not found', async () => {
    const allevents = await eventService.getAll();
    expect(Array.isArray(allevents)).toBe(true);
    const greatestId = Math.max.apply(Math, allevents.map((event) => event.id));
    const deleteResult = await eventService.delete(greatestId + 509);
    expect(deleteResult).toBe(0);
});

test('eventService.delete() - invalid id', async () => {
    await expect(eventService.delete('y')).rejects.toThrow('id is not a positive integer');
    await expect(eventService.delete('-1')).rejects.toThrow('id is not a positive integer');
    await expect(eventService.delete('0')).rejects.toThrow('id is not a positive integer');
    await expect(eventService.delete('0.1')).rejects.toThrow('id is not a positive integer');
});


//#endregion eventService.delete() 

//#region eventService.find() 

test('eventService.find() - success', async () => {
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
    expect(eventCreated).toHaveProperty('id');

    const eventFetched = await eventService.find(eventCreated.id);
    expect(eventFetched).toEqual(eventCreated);
});

test('eventService.find() - not found', async () => {
    const allevents = await eventService.getAll();
    expect(Array.isArray(allevents)).toBe(true);
    const greatestId = Math.max.apply(Math, allevents.map((event) => event.id));
    const eventFetched = await eventService.find(greatestId + 45);
    expect(eventFetched).toBeUndefined();
});

test('eventService.find() - invalid id', async () => {
    await expect(eventService.find('y')).rejects.toThrow('id is not a positive integer');
    await expect(eventService.find('-1')).rejects.toThrow('id is not a positive integer');
    await expect(eventService.find('0')).rejects.toThrow('id is not a positive integer');
    await expect(eventService.find('0.1')).rejects.toThrow('id is not a positive integer');
});

//#endregion eventService.find() 

//#region eventService.create()

test('eventService.create() - success', async () => {
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
    expect(eventCreated).toHaveProperty('id');
    eventToCreate.id = eventCreated.id;

    if (eventService.knexEnvironmentConfig.client == 'mysql2') {
        eventToCreate.beginDttm = parse(eventToCreate.beginDttm, 'yyyy-MM-dd HH:mm:ss.SS', new Date());
        eventToCreate.endDttm = parse(eventToCreate.endDttm, 'yyyy-MM-dd HH:mm:ss.SS', new Date());
        eventToCreate.updateDttm = parse(eventToCreate.updateDttm, 'yyyy-MM-dd HH:mm:ss.SS', new Date());
    }
    expect(eventCreated).toEqual(eventToCreate);
    const eventFetched = await eventService.find(eventCreated.id);
    expect(eventFetched).toEqual(eventCreated);
});

test('eventService.create() - validation error eventTypeId missing', async () => {
    const eventToCreate = {
        "beginDttm": "2021-07-04 13:00:00.00",
        "endDttm": "2021-07-04 13:00:00.00",
        "peopleNeeded": 3,
        "comment": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('eventTypeId: is a required property');
});
test('eventService.create() - validation error eventTypeId not an integer', async () => {
    const eventToCreate = {
        "beginDttm": "2021-07-04 13:00:00.00",
        "endDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": 'A',
        "peopleNeeded": 3,
        "comment": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('eventTypeId: should be integer');
});
test('eventService.create() - validation error eventTypeId less than 1', async () => {
    const eventToCreate = {
        "beginDttm": "2021-07-04 13:00:00.00",
        "endDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": 0,
        "peopleNeeded": 3,
        "comment": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('eventTypeId: should be >= 1');
});
test('eventService.create() - validation error eventTypeId not in eventType table', async () => {
    const eventTypes = await eventTypeService.getAll();
    expect(Array.isArray(eventTypes)).toBe(true);
    const greatestId = Math.max.apply(Math, eventTypes.map((entity) => entity.id));
    const eventToCreate = {
        "beginDttm": "2021-07-04 13:00:00.00",
        "endDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": greatestId + 123,
        "peopleNeeded": 3,
        "comment": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow(/(a foreign key constraint fail)|(FOREIGN KEY constraint failed)/);
});

test('eventService.create() - validation error peopleNeeded not an integer', async () => {
    const eventToCreate = {
        "beginDttm": "2021-07-04 13:00:00.00",
        "endDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded": 'A',
        "comment": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('peopleNeeded: should be integer');
});
test('eventService.create() - validation error peopleNeeded less than 1', async () => {
    const eventToCreate = {
        "beginDttm": "2021-07-04 13:00:00.00",
        "endDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded": 0,
        "comment": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('peopleNeeded: should be >= 1');
});
test('eventService.create() - validation error peopleNeeded greater than 25', async () => {
    const eventToCreate = {
        "beginDttm": "2021-07-04 13:00:00.00",
        "endDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded": 26,
        "comment": "",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('peopleNeeded: should be <= 25');
});

test('eventService.create() - validation error beginDttm missing', async () => {
    const eventToCreate = {
        "endDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded": 3,
        "comment": "",
        'updateUser': 'john.d.lednicky',
        "updateDttm": "2021-07-04 13:00:00.00",
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('beginDttm: is a required property');
});
test('eventService.create() - validation error beginDttm empty string', async () => {
    const eventToCreate = {
        "updateDttm": "2021-07-04 13:00:00.00",
        "endDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded": 3,
        "comment": "",
        'updateUser': 'john.d.lednick',
        'beginDttm': ''
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('beginDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
});
test('eventService.create() - validation error beginDttm has invalid characters', async () => {
    const eventToCreate = {
        "updateDttm": "2021-07-04 13:00:00.00",
        "endDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded": 3,
        "comment": "",
        'updateUser': 'john.d.ledni$cky',
        'beginDttm': '7-4-2021'
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('beginDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
});

test('eventService.create() - validation error endDttm missing', async () => {
    const eventToCreate = {
        "beginDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded": 3,
        "comment": "",
        'updateUser': 'john.d.lednicky',
        "updateDttm": "2021-07-04 13:00:00.00",
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('endDttm: is a required property');
});
test('eventService.create() - validation error endDttm empty string', async () => {
    const eventToCreate = {
        "updateDttm": "2021-07-04 13:00:00.00",
        "beginDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded": 3,
        "comment": "",
        'updateUser': 'john.d.lednick',
        'endDttm': ''
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('endDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
});
test('eventService.create() - validation error endDttm has invalid characters', async () => {
    const eventToCreate = {
        "updateDttm": "2021-07-04 13:00:00.00",
        "beginDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded": 3,
        "comment": "",
        'updateUser': 'john.d.ledni$cky',
        'endDttm': '7-4-2021'
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('endDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
});

test('eventService.create() - validation error comment too long', async () => {
    const eventToCreate = {
        "beginDttm": "2021-07-04 13:00:00.00",
        "endDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded": 3,
        "comment": 'a'.repeat(501),
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('comment: should NOT be longer than 500 characters');
});
test('eventService.create() - validation error comment has invalid characters', async () => {
    const eventToCreate = {
        "beginDttm": "2021-07-04 13:00:00.00",
        "endDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded": 3,
        "comment": "If you can\'t say something nice, then *&%*%$*&&",
        "updateUser": "john.d.lednicky",
        "updateDttm": "2021-07-04 13:00:00.00"
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('comment: should match pattern "^[a-zA-Z0-9 .,:;\\-?!&/\\\\\']*$"');
});

test('eventService.create() - validation error updateUser too long', async () => {
    const eventToCreate = {
        "beginDttm": "2021-07-04 13:00:00.00",
        "endDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded": 3,
        "comment": "",
        'updateUser': 'a'.repeat(46),
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('updateUser: should NOT be longer than 45 characters');
});
test('eventService.create() - validation error updateUser missing', async () => {
    const eventToCreate = {
        "beginDttm": "2021-07-04 13:00:00.00",
        "endDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded": 3,
        "comment": "",
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('updateUser: is a required property');
});
test('eventService.create() - validation error updateUser empty string', async () => {
    const eventToCreate = {
        "beginDttm": "2021-07-04 13:00:00.00",
        "endDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded": 3,
        "comment": "",
        'updateUser': '',
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('updateUser: should match pattern "^[a-zA-Z0-9 .-@]+$", should NOT be shorter than 1 characters');
});
test('eventService.create() - validation error updateUser has updateUser characters', async () => {
    const eventToCreate = {
        "beginDttm": "2021-07-04 13:00:00.00",
        "endDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded": 3,
        "comment": "",
        'updateUser': 'john.d.ledni$cky',
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('updateUser: should match pattern "^[a-zA-Z0-9 .-@]+$"');
});

test('eventService.create() - validation error updateDttm missing', async () => {
    const eventToCreate = {
        "beginDttm": "2021-07-04 13:00:00.00",
        "endDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded": 3,
        "comment": "",
        'updateUser': 'john.d.lednicky'
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('updateDttm: is a required property');
});
test('eventService.create() - validation error updateDttm empty string', async () => {
    const eventToCreate = {
        "beginDttm": "2021-07-04 13:00:00.00",
        "endDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded": 3,
        "comment": "",
        'updateUser': 'john.d.lednick',
        'updateDttm': ''
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('updateDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
});
test('eventService.create() - validation error updateDttm has invalid characters', async () => {
    const eventToCreate = {
        "beginDttm": "2021-07-04 13:00:00.00",
        "endDttm": "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded": 3,
        "comment": "",
        'updateUser': 'john.d.ledni$cky',
        'updateDttm': '7-4-2021'
    };
    await expect(eventService.create(eventToCreate)).rejects.toThrow('updateDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
});

//#endregion eventService.create()

//#region eventService.update()

test('eventService.update() - success', async () => {
    const eventToCreate = {
        "beginDttm" : "2021-07-04 13:00:00.00",
        "endDttm" : "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded" : 3, 
        "comment" : "",
        "updateUser" : "john.d.lednicky",
        "updateDttm" : "2021-07-04 13:00:00.00"
    };
    const eventCreated = await eventService.create(eventToCreate);
    expect(eventCreated).toHaveProperty('id');

    eventCreated.comment = 'This is a commented event';
    eventCreated.updateDttm = eventToCreate.updateDttm;
    eventCreated.beginDttm = eventToCreate.beginDttm;
    eventCreated.endDttm = eventToCreate.endDttm;

    const eventUpdated = await eventService.update(eventCreated);
    expect(eventUpdated).toEqual(eventCreated);
    expect(eventUpdated.comment).toEqual('This is a commented event');

    const eventFetched = await eventService.find(eventUpdated.id);
    expect(eventFetched).toEqual(eventUpdated);
});

test('eventService.create() - validation error eventTypeId missing', async () => {
    const eventToCreate = {
        "beginDttm" : "2021-07-04 13:00:00.00",
        "endDttm" : "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded" : 3, 
        "comment" : "",
        "updateUser" : "john.d.lednicky",
        "updateDttm" : "2021-07-04 13:00:00.00"
    };    
    const eventCreated = await eventService.create(eventToCreate);
    expect(eventCreated).toHaveProperty('id');

    delete eventCreated.eventTypeId;

    await expect(eventService.update(eventCreated)).rejects.toThrow('eventTypeId: is a required property');
});
test('eventService.create() - validation error eventTypeId not an integer', async () => {
    const eventToCreate = {
        "beginDttm" : "2021-07-04 13:00:00.00",
        "endDttm" : "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded" : 3, 
        "comment" : "",
        "updateUser" : "john.d.lednicky",
        "updateDttm" : "2021-07-04 13:00:00.00"
    };    
    const eventCreated = await eventService.create(eventToCreate);
    expect(eventCreated).toHaveProperty('id');

    eventCreated.eventTypeId = 'a';
    await expect(eventService.update(eventCreated)).rejects.toThrow('eventTypeId: should be integer');
});
test('eventService.create() - validation error eventTypeId less than 1', async () => {
    const eventToCreate = {
        "beginDttm" : "2021-07-04 13:00:00.00",
        "endDttm" : "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded" : 3, 
        "comment" : "",
        "updateUser" : "john.d.lednicky",
        "updateDttm" : "2021-07-04 13:00:00.00"
    };    
    const eventCreated = await eventService.create(eventToCreate);
    expect(eventCreated).toHaveProperty('id');

    eventCreated.eventTypeId = 0;
    await expect(eventService.update(eventCreated)).rejects.toThrow('eventTypeId: should be >= 1');
});
test('eventService.create() - validation error eventTypeId not in eventType table', async () => {
    const eventToCreate = {
        "beginDttm" : "2021-07-04 13:00:00.00",
        "endDttm" : "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded" : 3, 
        "comment" : "",
        "updateUser" : "john.d.lednicky",
        "updateDttm" : "2021-07-04 13:00:00.00"
    };    
    const eventCreated = await eventService.create(eventToCreate);
    expect(eventCreated).toHaveProperty('id');
    
    const eventTypes = await eventTypeService.getAll();
    expect(Array.isArray(eventTypes)).toBe(true);
    const greatestId = Math.max.apply(Math, eventTypes.map((entity) => entity.id));

    eventCreated.eventTypeId = greatestId + 952;

    await expect(eventService.update(eventCreated)).rejects.toThrow(/(a foreign key constraint fail)|(FOREIGN KEY constraint failed)/);
});

test('eventService.update() - validation error beginDttm missing', async () => {
    const eventToCreate = {
        "beginDttm" : "2021-07-04 13:00:00.00",
        "endDttm" : "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded" : 3, 
        "comment" : "",
        "updateUser" : "john.d.lednicky",
        "updateDttm" : "2021-07-04 13:00:00.00"
    };
    const eventCreated = await eventService.create(eventToCreate);
    expect(eventCreated).toHaveProperty('id');

    delete eventCreated.beginDttm;

    await expect(eventService.update(eventCreated)).rejects.toThrow('beginDttm: is a required property');
});
test('eventService.update() - validation error beginDttm empty string', async () => {
    const eventToCreate = {
        "beginDttm" : "2021-07-04 13:00:00.00",
        "endDttm" : "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded" : 3, 
        "comment" : "",
        "updateUser" : "john.d.lednicky",
        "updateDttm" : "2021-07-04 13:00:00.00"
    };
    const eventCreated = await eventService.create(eventToCreate);
    expect(eventCreated).toHaveProperty('id');

    eventCreated.beginDttm = '';

    await expect(eventService.update(eventCreated)).rejects.toThrow('beginDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
});
test('eventService.create() - validation error beginDttm is invalid', async () => {
    const eventToCreate = {
        "beginDttm" : "2021-07-04 13:00:00.00",
        "endDttm" : "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded" : 3, 
        "comment" : "",
        "updateUser" : "john.d.lednicky",
        "updateDttm" : "2021-07-04 13:00:00.00"
    };
    const eventCreated = await eventService.create(eventToCreate);
    expect(eventCreated).toHaveProperty('id');

    eventCreated.beginDttm = '7-4-2021';

    await expect(eventService.update(eventCreated)).rejects.toThrow('beginDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
});

test('eventService.update() - validation error endDttm missing', async () => {
    const eventToCreate = {
        "beginDttm" : "2021-07-04 13:00:00.00",
        "endDttm" : "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded" : 3, 
        "comment" : "",
        "updateUser" : "john.d.lednicky",
        "updateDttm" : "2021-07-04 13:00:00.00"
    };
    const eventCreated = await eventService.create(eventToCreate);
    expect(eventCreated).toHaveProperty('id');

    delete eventCreated.endDttm;

    await expect(eventService.update(eventCreated)).rejects.toThrow('endDttm: is a required property');
});
test('eventService.update() - validation error endDttm empty string', async () => {
    const eventToCreate = {
        "beginDttm" : "2021-07-04 13:00:00.00",
        "endDttm" : "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded" : 3, 
        "comment" : "",
        "updateUser" : "john.d.lednicky",
        "updateDttm" : "2021-07-04 13:00:00.00"
    };
    const eventCreated = await eventService.create(eventToCreate);
    expect(eventCreated).toHaveProperty('id');

    eventCreated.endDttm = '';

    await expect(eventService.update(eventCreated)).rejects.toThrow('endDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
});
test('eventService.create() - validation error endDttm is invalid', async () => {
    const eventToCreate = {
        "beginDttm" : "2021-07-04 13:00:00.00",
        "endDttm" : "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded" : 3, 
        "comment" : "",
        "updateUser" : "john.d.lednicky",
        "updateDttm" : "2021-07-04 13:00:00.00"
    };
    const eventCreated = await eventService.create(eventToCreate);
    expect(eventCreated).toHaveProperty('id');

    eventCreated.endDttm = '7-4-2021';

    await expect(eventService.update(eventCreated)).rejects.toThrow('endDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
});

test('eventService.update() - validation error comment too long', async () => {
    const eventToCreate = {
        "beginDttm" : "2021-07-04 13:00:00.00",
        "endDttm" : "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded" : 3, 
        "comment" : "",
        "updateUser" : "john.d.lednicky",
        "updateDttm" : "2021-07-04 13:00:00.00"
    };
    const eventCreated = await eventService.create(eventToCreate);
    expect(eventCreated).toHaveProperty('id');

    eventCreated.comment = 'a'.repeat(501);

    await expect(eventService.update(eventCreated)).rejects.toThrow('comment: should NOT be longer than 500 characters');
});
test('eventService.update() - validation error comment has invalid characters', async () => {
    const eventToCreate = {
        "beginDttm" : "2021-07-04 13:00:00.00",
        "endDttm" : "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded" : 3, 
        "comment" : "",
        "updateUser" : "john.d.lednicky",
        "updateDttm" : "2021-07-04 13:00:00.00"
    };
    const eventCreated = await eventService.create(eventToCreate);
    expect(eventCreated).toHaveProperty('id');

    eventCreated.comment = '876TGF#';

    await expect(eventService.update(eventCreated)).rejects.toThrow('comment: should match pattern "^[a-zA-Z0-9 .,:;\\-?!&/\\\\\']*$"');
});

test('eventService.update() - validation error updateUser too long', async () => {
    const eventToCreate = {
        "beginDttm" : "2021-07-04 13:00:00.00",
        "endDttm" : "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded" : 3, 
        "comment" : "",
        "updateUser" : "john.d.lednicky",
        "updateDttm" : "2021-07-04 13:00:00.00"
    };
    const eventCreated = await eventService.create(eventToCreate);
    expect(eventCreated).toHaveProperty('id');

    eventCreated.updateUser = 'a'.repeat(46);

    await expect(eventService.update(eventCreated)).rejects.toThrow('updateUser: should NOT be longer than 45 characters');
});
test('eventService.update() - validation error updateUser missing', async () => {
    const eventToCreate = {
        "beginDttm" : "2021-07-04 13:00:00.00",
        "endDttm" : "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded" : 3, 
        "comment" : "",
        "updateUser" : "john.d.lednicky",
        "updateDttm" : "2021-07-04 13:00:00.00"
    };
    const eventCreated = await eventService.create(eventToCreate);
    expect(eventCreated).toHaveProperty('id');

    delete eventCreated.updateUser;

    await expect(eventService.update(eventCreated)).rejects.toThrow('updateUser: is a required property');
});
test('eventService.update() - validation error updateUser empty string', async () => {
    const eventToCreate = {
        "beginDttm" : "2021-07-04 13:00:00.00",
        "endDttm" : "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded" : 3, 
        "comment" : "",
        "updateUser" : "john.d.lednicky",
        "updateDttm" : "2021-07-04 13:00:00.00"
    };
    const eventCreated = await eventService.create(eventToCreate);
    expect(eventCreated).toHaveProperty('id');

    eventCreated.updateUser = '';

    await expect(eventService.update(eventCreated)).rejects.toThrow('updateUser: should match pattern "^[a-zA-Z0-9 .-@]+$", should NOT be shorter than 1 characters');
});
test('eventService.update() - validation error updateUser has invalid characters', async () => {
    const eventToCreate = {
        "beginDttm" : "2021-07-04 13:00:00.00",
        "endDttm" : "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded" : 3, 
        "comment" : "",
        "updateUser" : "john.d.lednicky",
        "updateDttm" : "2021-07-04 13:00:00.00"
    };
    const eventCreated = await eventService.create(eventToCreate);
    expect(eventCreated).toHaveProperty('id');

    eventCreated.updateUser = 'john.d.ledni&^y';

    await expect(eventService.update(eventCreated)).rejects.toThrow('updateUser: should match pattern "^[a-zA-Z0-9 .-@]+$"');
});

test('eventService.update() - validation error updateDttm missing', async () => {
    const eventToCreate = {
        "beginDttm" : "2021-07-04 13:00:00.00",
        "endDttm" : "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded" : 3, 
        "comment" : "",
        "updateUser" : "john.d.lednicky",
        "updateDttm" : "2021-07-04 13:00:00.00"
    };
    const eventCreated = await eventService.create(eventToCreate);
    expect(eventCreated).toHaveProperty('id');

    delete eventCreated.updateDttm;

    await expect(eventService.update(eventCreated)).rejects.toThrow('updateDttm: is a required property');
});
test('eventService.update() - validation error updateDttm empty string', async () => {
    const eventToCreate = {
        "beginDttm" : "2021-07-04 13:00:00.00",
        "endDttm" : "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded" : 3, 
        "comment" : "",
        "updateUser" : "john.d.lednicky",
        "updateDttm" : "2021-07-04 13:00:00.00"
    };
    const eventCreated = await eventService.create(eventToCreate);
    expect(eventCreated).toHaveProperty('id');

    eventCreated.updateDttm = '';

    await expect(eventService.update(eventCreated)).rejects.toThrow('updateDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
});
test('eventService.create() - validation error updateDttm is invalid', async () => {
    const eventToCreate = {
        "beginDttm" : "2021-07-04 13:00:00.00",
        "endDttm" : "2021-07-04 13:00:00.00",
        "eventTypeId": 1,
        "peopleNeeded" : 3, 
        "comment" : "",
        "updateUser" : "john.d.lednicky",
        "updateDttm" : "2021-07-04 13:00:00.00"
    };
    const eventCreated = await eventService.create(eventToCreate);
    expect(eventCreated).toHaveProperty('id');

    eventCreated.updateDttm = '7-4-2021';

    await expect(eventService.update(eventCreated)).rejects.toThrow('updateDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
});

//#endregion eventService.update()
