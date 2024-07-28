/* eslint-disable no-undef */
/* eslint-disable import/extensions */
const fs = require('fs');
const jestConfig = require('../jest.config.js');
jest.setTimeout(60000);

const knexEnvName = 'sqlite3'; 
/* This should match a sqlite3 environment in the knex file */
// const knexEnvName = 'development'; /* This should match a sqlite3 environment in the knex file */

/* set up service */
const personService = require('../../services/personService.js')(knexEnvName);

beforeAll(async () => {
    /* delete database file if it exists (it should not)
      if (personService.knexEnvironmentConfig.connection.filename
          && fs.existsSync(personService.knexEnvironmentConfig.connection.filename)) {
          fs.unlinkSync(personService.knexEnvironmentConfig.connection.filename);
      } */
    /* use knex to populate a new sqllite3 database
      await personService.knex.migrate.latest();
      await personService.knex.seed.run(); */
});
afterAll(async () => {
    /* destroy knex and delete the database file */
    await personService.knex.destroy();
    /*
      if (personService.knexEnvironmentConfig.connection.filename && 
          fs.existsSync(personService.knexEnvironmentConfig.connection.filename)) {
          fs.unlinkSync(personService.knexEnvironmentConfig.connection.filename);
      }
      */
});

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
    //expect(personCreated).toHaveProperty('id');

    const deleteResult = await personService.delete(personCreated.id);
    expect(deleteResult).toBe(1);
    /*
        const personFetched = await personService.find(personCreated.id);
        expect(personFetched).toBeUndefined();
    */
});