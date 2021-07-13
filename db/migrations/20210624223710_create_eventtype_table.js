exports.up = async function (knex) {
  await knex.schema.createTable('event_type', (table) => {
    table.increments('id').unsigned().primary();
    table.string('name', 25).notNullable();
    table.string('description', 250).nullable();
    table.string('update_user', 45).notNullable();
    table.dateTime('update_dttm').notNullable();
  });
  return Promise.resolve();
};

exports.down = function (knex) {
  return knex.schema.dropTable('event_type');
};
