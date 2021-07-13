exports.seed = async function (knex) {
  const { format } = require('date-fns');

  const { Model } = require('objection');
  Model.knex(knex);
  const EventType = require('../../models/EventType');

  const eventTypeValues = [
    {
      id: 1,
      name: 'Cafe A Shift',
      description: 'This shift is from 8:15am-11:00am. You will be helping prep and serve food to our clients! You will be on your feet moving the whole time so come with close toed shoes and appropriate clothes for the tasks. Sometimes requires minor heavy lifting.',
      updateUser: 'john.d.lednicky',
      updateDttm: format(new Date(), 'yyyy-MM-dd HH:mm:ss.SS'),
    },
    {
      id: 2,
      name: 'Cafe B Shift',
      description: 'This shift is from 8:15am-11:00am. You will be helping prep and serve food to our clients! You will be on your feet moving the whole time so come with close toed shoes and appropriate clothes for the tasks. Sometimes requires minor heavy lifting.',
      updateUser: 'john.d.lednicky',
      updateDttm: format(new Date(), 'yyyy-MM-dd HH:mm:ss.SS'),
    },
    {
      id: 3,
      name: 'Mail Room A Shift',
      description: '',
      updateUser: 'john.d.lednicky',
      updateDttm: format(new Date(), 'yyyy-MM-dd HH:mm:ss.SS'),
    },
    {
      id: 4,
      name: 'Mail Room B Shift',
      description: '',
      updateUser: 'john.d.lednicky',
      updateDttm: format(new Date(), 'yyyy-MM-dd HH:mm:ss.SS'),
    },
  ];

  await EventType.query().insertGraph(eventTypeValues);

  return Promise.resolve();
};
