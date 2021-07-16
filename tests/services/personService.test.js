const fs = require('fs');
const jestConfig = require('../../jest.config.js');
jest.setTimeout(20000);

const knexEnvName = 'autotest_personService'; /* This has to match a sqlite3 environment in the knex file */
/*
jest cheat sheet
https://github.com/sapegin/jest-cheat-sheet/blob/master/Readme.md
*/

/* set up service */
const personService = require('../../services/personService.js')(knexEnvName);

/* delete database file if it exists (it should not) */
if (fs.existsSync(personService.knexEnvironmentConfig.connection.filename)) {
    fs.unlinkSync(personService.knexEnvironmentConfig.connection.filename);
}

/* use knex to populate a new sqllite3 database */
beforeAll(async () => {
    await personService.knex.migrate.latest();
    await personService.knex.seed.run();
});

test('personService.getAll()', async () => {
    const allPersons = await personService.getAll();
    expect(Array.isArray(allPersons)).toBe(true);
    expect(allPersons.length).toBe(6);
    expect(allPersons[0]).toHaveProperty('id');
    expect(true).toBeTruthy();
});

/* destroy knex and delete the database file */
afterAll(async () => {
    await personService.knex.destroy();
    if (fs.existsSync(personService.knexEnvironmentConfig.connection.filename)) {
        fs.unlinkSync(personService.knexEnvironmentConfig.connection.filename);
    }
});
