exports.up = function (knex) {
  return knex.schema.createTable('assignment', (table) => {
    table.integer('event_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('event');

    table.integer('person_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('person');

    table.string('update_user', 45)
      .notNullable();

    table.integer('update_dttm', 11)
      .unsigned()
      .notNullable();

    table.primary(['event_id', 'person_id'], 'assignment_pk');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('assignment');
};
