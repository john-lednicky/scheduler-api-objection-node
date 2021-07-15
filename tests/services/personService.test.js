let originalNodeEnv = process.env['NODE_ENV'];

beforeAll(() => {
    //TODO personService.test.js drop all tables or delete db file
    process.env['NODE_ENV'] = 'sqlite3';
});


afterAll(() => {
    process.env['NODE_ENV'] = originalNodeEnv;

});

