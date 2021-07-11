exports.up = function(knex) {
    return knex.schema.createTable('event', function(table) {
        table.increments('id').unsigned().primary();

        table.integer('event_type_id').unsigned().references('id').inTable('event_type').notNullable().index('fk_event_type_idx');

        table.dateTime('begin_dttm').notNullable();
        table.dateTime('end_dttm').notNullable();
        table.integer('people_needed').unsigned().notNullable();
        table.string('comment',500).nullable();
        table.string('update_user',45).notNullable();
        table.dateTime('update_dttm').notNullable();
        /*
        table.index('event_type_id', 'fk_event_type_idx');
        */
      })  ;
};

exports.down = function(knex) {
    return knex.schema.dropTable('event');
};
