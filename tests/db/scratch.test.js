const { format, parse, parseJSON } = require('date-fns');

const knexConfig = require('../../knexfile.js');

const { Model, knexIdentifierMapping } = require('objection');

const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

Model.knex(knex);

const Event = require('../../models/Event');
const EventType = require('../../models/EventType');
const Person = require('../../models/Person');
const Assignment = require('../../models/Assignment');

(async () => {

    const events = await Event.query()
        .limit(1)
        .select('event.id', 'event.eventTypeId', 'beginDttm')
        .where('event.eventTypeId', '1')
        .orWhere('event.eventTypeId', '2');

    if (knex.context.client.config.client == 'sqlite3') {
        events.forEach((event) => {
            event.beginDttm = parse(event.beginDttm, 'yyyy-MM-dd HH:mm:ss.SS', new Date());
        });
    }

    const assignmentValues = [];
    events.forEach((event) => {
        console.log(typeof event.beginDttm + ' ' + event.beginDttm);
    });

    await knex.destroy()
        .catch(err => {
            console.error(err);
            return knex.destroy();
        });

})();