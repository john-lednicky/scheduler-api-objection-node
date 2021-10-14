/* eslint-disable global-require */
// eslint-disable-next-line func-names
exports.seed = async function (knex) {
  const { Model } = require('objection');
  Model.knex(knex);
  const Assignment = require('../../models/Assignment');
  const Event = require('../../models/Event');

  const epochTimestamp = Math.floor((new Date()).getTime() / 1000);

  const events = await Event.query()
    .select('event.id', 'event.eventTypeId', 'beginDttm')
    .where('event.event_type_id', '1')
    .orWhere('event.event_type_id', '2');

  /* sqllite stores dates as strings, so convert them here */
  if (knex.context.client.config.client === 'sqlite3') {
    events.forEach((event) => {
      // eslint-disable-next-line no-param-reassign
      event.beginDttm = new Date(event.beginDttm);
    });
  }

  const assignmentValues = [];
  events.forEach((event) => {
    /* Erin and Federico (5 and 6) are scheduled for Cafe B (2) shift on Tuesdays (2). */
    if (event.eventTypeId === 2 && event.beginDttm.getDay() === 2) {
      assignmentValues.push(
        {
          eventId: event.id,
          personId: 5,
          updateUser: 'john.d.lednicky',
          updateDttm: epochTimestamp,
        },
        {
          eventId: event.id,
          personId: 6,
          updateUser: 'john.d.lednicky',
          updateDttm: epochTimestamp,
        },
      );
    }
    /* Erin and Federico (5 and 6) are scheduled for Cafe A (1) shift on Mondays (1). */
    if (event.eventTypeId === 1 && event.beginDttm.getDay() === 1) {
      assignmentValues.push(
        {
          eventId: event.id,
          personId: 5,
          updateUser: 'john.d.lednicky',
          updateDttm: epochTimestamp,
        },
        {
          eventId: event.id,
          personId: 6,
          updateUser: 'john.d.lednicky',
          updateDttm: epochTimestamp,
        },
      );
    }
    /* Carol and Dan (3 and 4) are scheduled for Cafe B (2) shift every weekday. */
    if (event.eventTypeId === 2) {
      assignmentValues.push(
        {
          eventId: event.id,
          personId: 3,
          updateUser: 'john.d.lednicky',
          updateDttm: epochTimestamp,
        },
        {
          eventId: event.id,
          personId: 4,
          updateUser: 'john.d.lednicky',
          updateDttm: epochTimestamp,
        },
      );
    }
    /* Ann and Bob (1 and 2) are scheduled for Cafe A (1) shift every weekday. */
    if (event.eventTypeId === 1) {
      assignmentValues.push(
        {
          eventId: event.id,
          personId: 1,
          updateUser: 'john.d.lednicky',
          updateDttm: epochTimestamp,
        },
        {
          eventId: event.id,
          personId: 2,
          updateUser: 'john.d.lednicky',
          updateDttm: epochTimestamp,
        },
      );
    }
  });

  await Assignment.query().insertGraph(assignmentValues);

  return Promise.resolve();
};
