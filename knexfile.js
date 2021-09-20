const { knexSnakeCaseMappers } = require('objection');

/*
How to get knex connection from async function
https://stackoverflow.com/a/64980273/4628416

const waitPort = require('wait-port');
const fs = require('fs');

const {
    MYSQL_HOST: HOST,
    MYSQL_HOST_FILE: HOST_FILE,
    MYSQL_USER: USER,
    MYSQL_USER_FILE: USER_FILE,
    MYSQL_PASSWORD: PASSWORD,
    MYSQL_PASSWORD_FILE: PASSWORD_FILE,
    MYSQL_DB: DB,
    MYSQL_DB_FILE: DB_FILE,
} = process.env;

  // these will read from the file first, otherwise the environment variable
  const host = HOST_FILE ? fs.readFileSync(HOST_FILE) : HOST;
  const user = USER_FILE ? fs.readFileSync(USER_FILE) : USER;
  const password = PASSWORD_FILE ? fs.readFileSync(PASSWORD_FILE) : PASSWORD;
  const database = DB_FILE ? fs.readFileSync(DB_FILE) : DB;

  await waitPort({ host, port : 3306}); //this blocks until the port is available
*/

module.exports = {
  production: {
    client: 'mysql2',
    connection: {
      database: process.env.LOCAL_MYSQL_DBNAME,
      user: process.env.LOCAL_MYSQL_USERNAME,
      password: process.env.LOCAL_MYSQL_PASSWORD,
      host: process.env.LOCAL_MYSQL_HOST,
      connectionLimit: 10,
      queueLimit: 10, /* pool property */
      waitForConnections: true, /* pool property */
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
    ...knexSnakeCaseMappers(),
  },
  development: {
    client: 'mysql2',
    connection: {
      database: process.env.LOCAL_MYSQL_DBNAME,
      user: process.env.LOCAL_MYSQL_USERNAME,
      password: process.env.LOCAL_MYSQL_PASSWORD,
      host: process.env.LOCAL_MYSQL_HOST,
      connectionLimit: 10,
      queueLimit: 10, /* pool property */
      waitForConnections: true, /* pool property */
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
    ...knexSnakeCaseMappers(),
  },
  sqlite3: {
    client: 'sqlite3',
    connection: {
      filename: './sqlite3/scheduler.sqlite',
    },
    pool: {
      afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb),
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
    ...knexSnakeCaseMappers(),
  },
  autotest_personService: {
    client: 'sqlite3',
    connection: {
      filename: './sqlite3/autotest_personService.sqlite',
    },
    pool: {
      afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb),
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
    ...knexSnakeCaseMappers(),
  },
  autotest_eventService: {
    client: 'sqlite3',
    connection: {
      filename: './sqlite3/autotest_eventService.sqlite',
    },
    pool: {
      afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb),
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
    ...knexSnakeCaseMappers(),
  },
  autotest_eventTypeService: {
    client: 'sqlite3',
    connection: {
      filename: './sqlite3/autotest_eventTypeService.sqlite',
    },
    pool: {
      afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb),
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
    ...knexSnakeCaseMappers(),
  },
  autotest_assignmentService: {
    client: 'sqlite3',
    connection: {
      filename: './sqlite3/autotest_assignmentService.sqlite',
    },
    pool: {
      afterCreate: (conn, cb) => conn.run('PRAGMA foreign_keys = ON', cb),
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
    ...knexSnakeCaseMappers(),
  },
};
