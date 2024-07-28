/* eslint-disable func-names */
exports.up = function (knex) {
  return knex.schema.createTable('event', (table) => {
    table.increments('id').unsigned().primary('event_pk');

    table.integer('event_type_id')
      .unsigned()
      .references('id').inTable('event_type')
      .notNullable()
      .index('fk_event_type_idx');

    table.dateTime('begin_dttm').notNullable();
    table.dateTime('end_dttm').notNullable();

    table.string('time_zone', 30)
      .references('name').inTable('time_zone')
      .notNullable()
      .index('fk_timezone_idx');

    table.integer('people_needed').unsigned().notNullable();
    table.string('comment', 500).nullable();
    table.string('update_user', 200).notNullable();
    table.integer('update_dttm', 11).unsigned().notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('event');
};
