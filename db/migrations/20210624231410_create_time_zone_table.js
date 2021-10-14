/* eslint-disable func-names */
exports.up = async function (knex) {
  return knex.schema.createTable('time_zone', (table) => {
    table.string('name', 30).primary('time_zone_pk');
    table.string('short_description', 30).notNullable();
    table.string('long_description', 500).nullable();
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable('time_zone');
};
