const knexConfig = require('../../knexfile.js');

const { Model, knexIdentifierMapping } = require('objection');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

/*
knex.on( 'query', function( queryData ) {
  console.log( queryData );
});
*/

Model.knex(knex);

const Event = require('../../models/Event');

/*
const builder = Event.query().withGraphFetched('eventType');
const expr = builder.graphExpressionObject();
console.log(expr);
*/

Event.query()
 .select('event.id','eventType.name','eventType.description','beginDttm','endDttm','peopleNeeded','comment')
  .limit(1)
  .withGraphJoined(
    {
      eventType: true
    })
  .modifyGraph('eventType', builder => {
    builder.select(['name', 'description']);
  })
  .then((data) => {
    console.log(data)
  })
  .then(() => knex.destroy())
  .catch(err => {
    console.error(err);
    return knex.destroy();
  });