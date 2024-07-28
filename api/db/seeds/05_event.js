/* eslint-disable global-require */
/* eslint no-octal: 0 */ // --> OFF
// eslint-disable-next-line func-names
exports.seed = async function (knex) {
  const { Model } = require('objection');
  Model.knex(knex);
  const Event = require('../../models/Event');

  // eslint-disable-next-line object-curly-newline
  const { addDays, subDays, isBefore, isWeekend, set } = require('date-fns');

  const epochTimestamp = Math.floor((new Date()).getTime() / 1000);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let currentDate = subDays(today, 60);
  const lastDate = addDays(today, 60);
  const eventValues = [];

  while (isBefore(subDays(currentDate, 1), lastDate)) {
    if (!isWeekend(currentDate)) {
      eventValues.push(
        {
          eventTypeId: 1,
          beginDttm: set(currentDate, { hours: 8, minutes: 15 }).toISOString().replace('T', ' ').replace('Z', ''),
          endDttm: set(currentDate, { hours: 11, minutes: 0 }).toISOString().replace('T', ' ').replace('Z', ''),
          timeZone: 'America/Chicago',
          peopleNeeded: 3,
          comment: '',
          updateUser: 'john.d.lednicky',
          updateDttm: epochTimestamp,
        },
        {
          eventTypeId: 2,
          beginDttm: set(currentDate, { hours: 11, minutes: 0 }).toISOString().replace('T', ' ').replace('Z', ''),
          endDttm: set(currentDate, { hours: 13, minutes: 30 }).toISOString().replace('T', ' ').replace('Z', ''),
          timeZone: 'America/Chicago',
          peopleNeeded: 3,
          comment: '',
          updateUser: 'john.d.lednicky',
          updateDttm: epochTimestamp,
        },
        {
          eventTypeId: 3,
          beginDttm: set(currentDate, { hours: 8, minutes: 15 }).toISOString().replace('T', ' ').replace('Z', ''),
          endDttm: set(currentDate, { hours: 11, minutes: 0 }).toISOString().replace('T', ' ').replace('Z', ''),
          timeZone: 'America/Chicago',
          peopleNeeded: 1,
          comment: '',
          updateUser: 'john.d.lednicky',
          updateDttm: epochTimestamp,
        },
        {
          eventTypeId: 4,
          beginDttm: set(currentDate, { hours: 11, minutes: 0 }).toISOString().replace('T', ' ').replace('Z', ''),
          endDttm: set(currentDate, { hours: 13, minutes: 30 }).toISOString().replace('T', ' ').replace('Z', ''),
          timeZone: 'America/Chicago',
          peopleNeeded: 1,
          comment: '',
          updateUser: 'john.d.lednicky',
          updateDttm: epochTimestamp,
        },
      );
    }
    currentDate = addDays(currentDate, 1);
  }
  await Event.query().insertGraph(eventValues);

  return Promise.resolve();
};
