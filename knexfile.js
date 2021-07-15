const { knexSnakeCaseMappers } = require('objection');

module.exports = {
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
      filename: './scheduler_autotest.sqlite',
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
  }
};
