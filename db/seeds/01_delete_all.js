exports.seed = async function (knex) {
  await knex('assignment').del();
  await knex('event').del();
  await knex('person').del();
  await knex('event_type').del();

  return Promise.resolve();
};
