/* eslint-disable global-require */
// eslint-disable-next-line func-names
exports.seed = async function (knex) {
  const { Model } = require('objection');
  Model.knex(knex);
  const EventType = require('../../models/EventType');

  const epochTimestamp = Math.floor((new Date()).getTime() / 1000);

  const eventTypeValues = [
    {
      id: 1,
      name: 'Cafe A Shift',
      description: 'This shift is from 8:15am-11:00am. You will be helping prep and serve food to our clients! You will be on your feet moving the whole time so come with close toed shoes and appropriate clothes for the tasks. Sometimes requires minor heavy lifting.',
      updateUser: 'john.d.lednicky',
      updateDttm: epochTimestamp,
    },
    {
      id: 2,
      name: 'Cafe B Shift',
      description: 'This shift is from 8:15am-11:00am. You will be helping prep and serve food to our clients! You will be on your feet moving the whole time so come with close toed shoes and appropriate clothes for the tasks. Sometimes requires minor heavy lifting.',
      updateUser: 'john.d.lednicky',
      updateDttm: epochTimestamp,
    },
    {
      id: 3,
      name: 'Mail Room A Shift',
      description: '',
      updateUser: 'john.d.lednicky',
      updateDttm: epochTimestamp,
    },
    {
      id: 4,
      name: 'Mail Room B Shift',
      description: '',
      updateUser: 'john.d.lednicky',
      updateDttm: epochTimestamp,
    },
  ];

  await EventType.query().insertGraph(eventTypeValues);

  return Promise.resolve();
};
