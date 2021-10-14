// eslint-disable-next-line func-names
exports.seed = async function (knex) {
  try {
    await knex('assignment').del();
    await knex('event').del();
    await knex('person').del();
    await knex('time_zone').del();
    await knex('event_type').del();
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};
