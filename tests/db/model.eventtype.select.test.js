const knexConfig = require('../../knexfile.js');

const { Model, knexIdentifierMapping } = require('objection');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

Model.knex(knex);

const EventType = require('../../models/EventType'); 

EventType.query()
.select()
//.select('EventType.name','EventType.description','events.id','events.beginDttm','events.endDttm','events.comment','events.peopleNeeded')
//.withGraphJoined({events: true})
.then((data) => {
    console.dir(data, {depth: null})
})
.then(() => knex.destroy())
.catch(err => {
  console.error(err);
  return knex.destroy();
});