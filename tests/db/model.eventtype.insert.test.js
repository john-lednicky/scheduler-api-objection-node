require('dotenv').config();
const { format } = require('date-fns');
 
const knexConfig = require('../../knexfile.js');
const { Model, knexIdentifierMapping } = require('objection');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

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

eventTypeValues.forEach(eventTypeValue => {
  eventTypeValue.id = eventTypeValue.id + 100;
});

(async () => {

  await EventType.query()
    .delete()
    .where(
      'id',
      '>',
      100
    );

  await EventType.query().insertGraph(eventTypeValues);

  await EventType.query()
    .select()
    .then((data) => {
      console.dir(data, { depth: null })
    });

  await EventType.query()
    .delete()
    .where(
      'id',
      '>',
      100
    );

  await knex.destroy()
    .catch(err => {
      console.error(err);
      return knex.destroy();
    });

})();
