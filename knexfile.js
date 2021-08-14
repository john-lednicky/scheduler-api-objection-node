const { knexSnakeCaseMappers } = require('objection');

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
