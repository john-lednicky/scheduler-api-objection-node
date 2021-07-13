exports.up = function (knex) {
  return knex.schema.createTable('person', (table) => {
    table.increments('id').unsigned().primary();

    table.string('first_name', 20).notNullable();
    table.string('middle_name', 20).nullable();
    table.string('last_name', 20).notNullable();

    table.string('phone', 10).nullable();
    table.string('email', 200).nullable();

    table.string('update_user', 45).notNullable();
    table.dateTime('update_dttm').notNullable();

    table.index(['last_name', 'first_name', 'middle_name', 'id'], 'name');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('person');
};
