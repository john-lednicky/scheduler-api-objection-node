/* eslint-disable global-require */
// eslint-disable-next-line func-names
exports.seed = async function (knex) {
  const { Model } = require('objection');
  Model.knex(knex);
  const TimeZone = require('../../models/TimeZone');

  const timeZoneValues = [
    {
      name: 'America/New_York',
      shortDescription: 'US Eastern',
    },
    {
      name: 'America/Chicago',
      shortDescription: 'US Central',
    },
    {
      name: 'America/Denver',
      shortDescription: 'US Mountain',
    },
    {
      name: 'America/Phoenix',
      shortDescription: 'US Arizona',
    },
    {
      name: 'America/Los_Angeles',
      shortDescription: 'US Pacific',
    },
  ];

  await TimeZone.query().insertGraph(timeZoneValues);

  return Promise.resolve();
};
