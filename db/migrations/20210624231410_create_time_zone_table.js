/* eslint-disable func-names */
exports.up = function (knex) {
  return knex.schema.createTable('time_zone', (table) => {
    table.string('name', 30).primary();
    table.string('short_description', 30).notNullable();
    table.string('long_description', 500).nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('time_zone');
};
