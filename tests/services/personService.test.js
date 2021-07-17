const fs = require('fs');
const jestConfig = require('../../jest.config.js');
jest.setTimeout(20000);

const knexEnvName = 'autotest_personService'; /* This should match a sqlite3 environment in the knex file */
//const knexEnvName = 'development'; /* This should match a sqlite3 environment in the knex file */

/* set up service */
const personService = require('../../services/personService.js')(knexEnvName);

beforeAll(async () => {
    /* delete database file if it exists (it should not) */
    if (personService.knexEnvironmentConfig.connection.filename && fs.existsSync(personService.knexEnvironmentConfig.connection.filename)) {
        fs.unlinkSync(personService.knexEnvironmentConfig.connection.filename);
    }
    /* use knex to populate a new sqllite3 database */
    await personService.knex.migrate.latest();
    await personService.knex.seed.run();
});
afterAll(async () => {
    /* destroy knex and delete the database file */
    await personService.knex.destroy();
    if (personService.knexEnvironmentConfig.connection.filename && fs.existsSync(personService.knexEnvironmentConfig.connection.filename)) {
        fs.unlinkSync(personService.knexEnvironmentConfig.connection.filename);
    }
});

test('personService.getAll() - success', async () => {
    const allPersons = await personService.getAll();
    expect(Array.isArray(allPersons)).toBe(true);
    expect(allPersons.length).toBeGreaterThanOrEqual(6);
    expect(allPersons[0]).toHaveProperty('id');
});


//#region personService.delete() 

test('personService.delete() - success', async () => {
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

    const deleteResult = await personService.delete(personCreated.id);
    expect(deleteResult).toBe(1);

    const personFetched = await personService.find(personCreated.id);
    expect(personFetched).toBeUndefined();    
});

test('personService.delete() - not found', async () => {
    const allPersons = await personService.getAll();
    expect(Array.isArray(allPersons)).toBe(true);
    const greatestId = Math.max.apply(Math, allPersons.map( (person) => person.id ));
    const deleteResult = await personService.delete(greatestId+509);
    expect(deleteResult).toBe(0);
});

test('personService.delete() - invalid id', async () => {
    await expect(personService.delete('y')).rejects.toThrow('id is not a positive integer');
    await expect(personService.delete('-1')).rejects.toThrow('id is not a positive integer');
    await expect(personService.delete('0')).rejects.toThrow('id is not a positive integer');
    await expect(personService.delete('0.1')).rejects.toThrow('id is not a positive integer');
});


//#endregion personService.delete() 

//#region personService.find() 

test('personService.find() - success', async () => {
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

    const personFetched = await personService.find(personCreated.id);
    expect(personFetched).toEqual(personCreated);
});

test('personService.find() - not found', async () => {
    const allPersons = await personService.getAll();
    expect(Array.isArray(allPersons)).toBe(true);
    const greatestId = Math.max.apply(Math, allPersons.map( (person) => person.id ));
    const personFetched = await personService.find(greatestId+45);
    expect(personFetched).toBeUndefined();
});

test('personService.find() - invalid id', async () => {
    await expect(personService.find('y')).rejects.toThrow('id is not a positive integer');
    await expect(personService.find('-1')).rejects.toThrow('id is not a positive integer');
    await expect(personService.find('0')).rejects.toThrow('id is not a positive integer');
    await expect(personService.find('0.1')).rejects.toThrow('id is not a positive integer');
});

//#endregion personService.find() 

//#region personService.create()

test('personService.create() - success', async () => {
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

    personToCreate.id = personCreated.id;
    expect(personCreated).toEqual(personToCreate);

    const personFetched = await personService.find(personCreated.id);
    expect(personFetched).toEqual(personCreated);
});

test('personService.create() - validation error firstName too long', async () => {
    const personToCreate = {
        'firstName': 'a'.repeat(21),
        'middleName': '',
        'lastName': 'Watkins',
        'phone': '5127778888',
        'email': 'william.watkins@scratch.com',
        'updateUser': 'john.d.lednicky',
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(personService.create(personToCreate)).rejects.toThrow('firstName: should NOT be longer than 20 characters');
});
test('personService.create() - validation error firstName missing', async () => {
    const personToCreate = {
        'middleName': '',
        'lastName': 'Watkins',
        'phone': '5127778888',
        'email': 'william.watkins@scratch.com',
        'updateUser': 'john.d.lednicky',
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(personService.create(personToCreate)).rejects.toThrow('firstName: is a required property');
});
test('personService.create() - validation error firstName empty string', async () => {
    const personToCreate = {
        'firstName': '',
        'middleName': '',
        'lastName': 'Watkins',
        'phone': '5127778888',
        'email': 'william.watkins@scratch.com',
        'updateUser': 'john.d.lednicky',
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(personService.create(personToCreate)).rejects.toThrow('firstName: should match pattern "^[a-zA-Z ,.\'-]+$", should NOT be shorter than 1 characters');
});
test('personService.create() - validation error firstName has invalid characters', async () => {
    const personToCreate = {
        'firstName': 'William0',
        'middleName': '',
        'lastName': 'Watkins',
        'phone': '5127778888',
        'email': 'william.watkins@scratch.com',
        'updateUser': 'john.d.lednicky',
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(personService.create(personToCreate)).rejects.toThrow('firstName: should match pattern "^[a-zA-Z ,.\'-]+$"');
});

test('personService.create() - validation error middleName too long', async () => {
    const personToCreate = {
        'firstName': 'William',
        'middleName': 'a'.repeat(21),
        'lastName': 'Watkins',
        'phone': '5127778888',
        'email': 'william.watkins@scratch.com',
        'updateUser': 'john.d.lednicky',
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(personService.create(personToCreate)).rejects.toThrow('middleName: should NOT be longer than 20 characters');
});
test('personService.create() - validation error middleName has invalid characters', async () => {
    const personToCreate = {
        'firstName': 'William',
        'middleName': 'Bloober0',
        'lastName': 'Watkins',
        'phone': '5127778888',
        'email': 'william.watkins@scratch.com',
        'updateUser': 'john.d.lednicky',
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(personService.create(personToCreate)).rejects.toThrow('middleName: should match pattern "^[a-zA-Z ,.\'-]*$"');
});

test('personService.create() - validation error lastName too long', async () => {
    const personToCreate = {
        'firstName': 'William',
        'middleName': '',
        'lastName': 'a'.repeat(21),
        'phone': '5127778888',
        'email': 'william.watkins@scratch.com',
        'updateUser': 'john.d.lednicky',
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(personService.create(personToCreate)).rejects.toThrow('lastName: should NOT be longer than 20 characters');
});
test('personService.create() - validation error lastName missing', async () => {
    const personToCreate = {
        'firstName': 'William',
        'middleName': '',
        'phone': '5127778888',
        'email': 'william.watkins@scratch.com',
        'updateUser': 'john.d.lednicky',
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(personService.create(personToCreate)).rejects.toThrow('lastName: is a required property');
});
test('personService.create() - validation error lastName empty string', async () => {
    const personToCreate = {
        'firstName': 'William',
        'middleName': '',
        'lastName': '',
        'phone': '5127778888',
        'email': 'william.watkins@scratch.com',
        'updateUser': 'john.d.lednicky',
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(personService.create(personToCreate)).rejects.toThrow('lastName: should match pattern "^[a-zA-Z ,.\'-]+$", should NOT be shorter than 1 characters');
});
test('personService.create() - validation error lastName has invalid characters', async () => {
    const personToCreate = {
        'firstName': 'William',
        'middleName': '',
        'lastName': 'Watkins$',
        'phone': '5127778888',
        'email': 'william.watkins@scratch.com',
        'updateUser': 'john.d.lednicky',
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(personService.create(personToCreate)).rejects.toThrow('lastName: should match pattern "^[a-zA-Z ,.\'-]+$"');
});

test('personService.create() - validation error phone too long', async () => {
    const personToCreate = {
        'firstName': 'William',
        'middleName': '',
        'lastName': 'Watkins',
        'phone': '1'.repeat(11),
        'email': 'william.watkins@scratch.com',
        'updateUser': 'john.d.lednicky',
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(personService.create(personToCreate)).rejects.toThrow('phone: should match pattern "^(\\d{10})?$", should NOT be longer than 10 characters');
});
test('personService.create() - validation error phone has invalid characters', async () => {
    const personToCreate = {
        'firstName': 'William',
        'middleName': '',
        'lastName': 'Watkins',
        'phone': '5127A78888',
        'email': 'william.watkins@scratch.com',
        'updateUser': 'john.d.lednicky',
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(personService.create(personToCreate)).rejects.toThrow('phone: should match pattern "^(\\d{10})?$"');
});

test('personService.create() - validation error email too long', async () => {
    const personToCreate = {
        'firstName': 'William',
        'middleName': '',
        'lastName': 'Watkins',
        'phone': '5124584521',
        'email': 'dot'+'a'.repeat(190)+'@dot.com',
        'updateUser': 'john.d.lednicky',
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(personService.create(personToCreate)).rejects.toThrow('email: should NOT be longer than 200 characters');
});
test('personService.create() - validation error email has invalid characters', async () => {
    const personToCreate = {
        'firstName': 'William',
        'middleName': '',
        'lastName': 'Watkins',
        'phone': '5124584521',
        'email': 'william.watkins',
        'updateUser': 'john.d.lednicky',
        'updateDttm': '2021-07-04 13:00:00.00'
    };
    await expect(personService.create(personToCreate)).rejects.toThrow('email: should match pattern "^([^\\s@]+@[^\\s@]+.[^\\s@]+)?$"');
});

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
    await expect(personService.create(personToCreate)).rejects.toThrow('updateUser: should NOT be longer than 45 characters');
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
    await expect(personService.create(personToCreate)).rejects.toThrow('updateUser: is a required property');
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
    await expect(personService.create(personToCreate)).rejects.toThrow('updateUser: should match pattern "^[a-zA-Z0-9 .-@]+$", should NOT be shorter than 1 characters');
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
    await expect(personService.create(personToCreate)).rejects.toThrow('updateUser: should match pattern "^[a-zA-Z0-9 .-@]+$"');
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
    await expect(personService.create(personToCreate)).rejects.toThrow('updateDttm: is a required property');
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
    await expect(personService.create(personToCreate)).rejects.toThrow('updateDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
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
    await expect(personService.create(personToCreate)).rejects.toThrow('updateDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
});

//#endregion personService.create()

//#region personService.update()

test('personService.update() - success', async () => {
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

    personCreated.middleName = 'Wilberforce';
    const personUpdated = await personService.update(personCreated);
    expect(personUpdated).toEqual(personCreated);
    expect(personUpdated.middleName).toEqual('Wilberforce');
    
    const personFetched = await personService.find(personUpdated.id);
    expect(personFetched).toEqual(personUpdated);
});
test('personService.update() - validation error firstName too long', async () => {
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

    personCreated.firstName = 'a'.repeat(21);

    await expect(personService.update(personCreated)).rejects.toThrow('firstName: should NOT be longer than 20 characters');
});
test('personService.update() - validation error firstName missing', async () => {
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

    delete personCreated.firstName;

    await expect(personService.update(personCreated)).rejects.toThrow('firstName: is a required property');

});
test('personService.udpate() - validation error firstName empty string', async () => {
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

    personCreated.firstName = '';

    await expect(personService.update(personCreated)).rejects.toThrow('firstName: should match pattern "^[a-zA-Z ,.\'-]+$", should NOT be shorter than 1 characters');
});
test('personService.update() - validation error firstName has invalid characters', async () => {
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

    personCreated.firstName = '876TGF#';

    await expect(personService.update(personCreated)).rejects.toThrow('firstName: should match pattern "^[a-zA-Z ,.\'-]+$"');
});
test('personService.update() - validation error middleName too long', async () => {
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

    personCreated.middleName = 'a'.repeat(21);

    await expect(personService.update(personCreated)).rejects.toThrow('middleName: should NOT be longer than 20 characters');
});
test('personService.update() - validation error middleName has invalid characters', async () => {
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

    personCreated.middleName = 'INvalid^';

    await expect(personService.update(personCreated)).rejects.toThrow('middleName: should match pattern "^[a-zA-Z ,.\'-]*$"');
});
test('personService.update() - validation error lastName too long', async () => {
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

    personCreated.lastName = 'a'.repeat(21);

    await expect(personService.update(personCreated)).rejects.toThrow('lastName: should NOT be longer than 20 characters');
});
test('personService.update() - validation error lastName missing', async () => {
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

    delete personCreated.lastName;

    await expect(personService.update(personCreated)).rejects.toThrow('lastName: is a required property');
});
test('personService.update() - validation error lastName empty string', async () => {
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

    personCreated.lastName = '';

    await expect(personService.update(personCreated)).rejects.toThrow('lastName: should match pattern "^[a-zA-Z ,.\'-]+$", should NOT be shorter than 1 characters');
});
test('personService.update() - validation error lastName has invalid characters', async () => {
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

    personCreated.lastName = 'Barg5%Flap';

    await expect(personService.update(personCreated)).rejects.toThrow('lastName: should match pattern "^[a-zA-Z ,.\'-]+$"');
});

test('personService.update() - validation error phone too long', async () => {
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

    personCreated.phone = '9'.repeat(11);

    await expect(personService.update(personCreated)).rejects.toThrow('phone: should match pattern "^(\\d{10})?$", should NOT be longer than 10 characters');
});
test('personService.update() - validation error phone has invalid characters', async () => {
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

    personCreated.phone = '55542a7874';

    await expect(personService.update(personCreated)).rejects.toThrow('phone: should match pattern "^(\\d{10})?$"');
});

test('personService.update() - validation error email too long', async () => {
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

    personCreated.email = 'dot'+'a'.repeat(190)+'@dot.com';

    await expect(personService.update(personCreated)).rejects.toThrow('email: should NOT be longer than 200 characters');
});
test('personService.update() - validation error email is invalid', async () => {
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

    personCreated.email = 'william.watkins';

    await expect(personService.update(personCreated)).rejects.toThrow('email: should match pattern "^([^\\s@]+@[^\\s@]+.[^\\s@]+)?$"');
});

test('personService.update() - validation error updateUser too long', async () => {
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

    personCreated.updateUser = 'a'.repeat(46);

    await expect(personService.update(personCreated)).rejects.toThrow('updateUser: should NOT be longer than 45 characters');
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

    await expect(personService.update(personCreated)).rejects.toThrow('updateUser: is a required property');
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

    await expect(personService.update(personCreated)).rejects.toThrow('updateUser: should match pattern "^[a-zA-Z0-9 .-@]+$", should NOT be shorter than 1 characters');
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

    await expect(personService.update(personCreated)).rejects.toThrow('updateUser: should match pattern "^[a-zA-Z0-9 .-@]+$"');
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

    await expect(personService.update(personCreated)).rejects.toThrow('updateDttm: is a required property');
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

    await expect(personService.update(personCreated)).rejects.toThrow('updateDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
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

    await expect(personService.update(personCreated)).rejects.toThrow('updateDttm: should match pattern "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}(.\\d{2})?$"');
});

//#endregion personService.update()
