exports.up = function (knex) {
  return knex.schema.createTable('assignment', (table) => {
    table.integer('event_id').unsigned().references('id').inTable('event')
      .notNullable();
    table.integer('person_id').unsigned().references('id').inTable('person')
      .notNullable();

    table.string('update_user', 45).notNullable();
    table.dateTime('update_dttm').notNullable();

    table.primary(['event_id', 'person_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('assignment');
};
