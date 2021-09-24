const { knexSnakeCaseMappers } = require('objection');
const waitPort = require('wait-port');
const fs = require('fs');

async function getConfig() {
  const {
    MYSQL_HOST,
    MYSQL_HOST_FILE,
    MYSQL_USERNAME,
    MYSQL_USERNAME_FILE,
    MYSQL_PASSWORD,
    MYSQL_PASSWORD_FILE,
    MYSQL_DBNAME,
    MYSQL_DBNAME_FILE,
  } = process.env;

  let host;
  let user;
  let password;
  let database;

  try {
    // If file is specified, read from it, otherwise try the environment variable
    host = MYSQL_HOST_FILE ? fs.readFileSync(MYSQL_HOST_FILE, 'utf-8') : MYSQL_HOST;
    user = MYSQL_USERNAME_FILE ? fs.readFileSync(MYSQL_USERNAME_FILE, 'utf-8') : MYSQL_USERNAME;
    password = MYSQL_PASSWORD_FILE ? fs.readFileSync(MYSQL_PASSWORD_FILE, 'utf-8') : MYSQL_PASSWORD;
    database = MYSQL_DBNAME_FILE ? fs.readFileSync(MYSQL_DBNAME_FILE, 'utf-8') : MYSQL_DBNAME;
  } catch (err) {
    return Promise.reject(err);
  }

  try {
    await waitPort({ host, port: 3306, output: 'silent' }); // this blocks until the port is available
  } catch (err) {
    return Promise.reject(err);
  }

  const config = {
    database,
    user,
    password,
    host,
    connectionLimit: 10,
    queueLimit: 10,
    waitForConnections: true,
  };

  return config;
}

module.exports = {
  production: {
    client: 'mysql2',
    async connection() {
      return getConfig();
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
    async connection() {
      return getConfig();
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
