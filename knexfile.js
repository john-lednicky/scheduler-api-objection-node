const result = require('dotenv').config();

if (result.error) {
  throw result.error;
}

const { knexSnakeCaseMappers } = require('objection');

module.exports = {
  production: {
    client: 'mysql2',
    connection: {
      database: process.env.PROD_MYSQL_DBNAME,
      user: process.env.PROD_MYSQL_USERNAME,
      password: process.env.PROD_MYSQL_PASSWORD,
      host: process.env.PROD_MYSQL_HOST,
      connectionLimit: 10,
      queueLimit: 10, /*pool property*/ 
      waitForConnections: true  /*pool property*/
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
      queueLimit: 10, /*pool property*/ 
      waitForConnections: true  /*pool property*/
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
  sqlite: {
    client: 'sqlite3',
    connection: {
      filename: './scheduler_autotest.sqlite'
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
  test: {
    client: 'mysql2',
    connection: {
      database: process.env.TEST_MYSQL_DBNAME,
      user: process.env.TEST_MYSQL_USERNAME,
      password: process.env.TEST_MYSQL_PASSWORD,
      host: process.env.TEST_MYSQL_HOST,
      connectionLimit: 10,
      queueLimit: 10, /*pool property*/
      waitForConnections: true  /*pool property*/
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
