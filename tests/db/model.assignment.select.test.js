
const knexConfig = require('../../knexfile.js');

const { Model, knexIdentifierMapping } = require('objection');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

Model.knex(knex);

const Assignment = require('../../models/Assignment'); 

Assignment.query()
.withGraphFetched('[person,event]')
.then((data) => {
    console.log(data)
})
.then(() => knex.destroy())
.catch(err => {
  console.error(err);
  return knex.destroy();
});