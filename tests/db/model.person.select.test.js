require('dotenv').config();
const knexConfig = require('../../knexfile.js');

const { Model, knexIdentifierMapping } = require('objection');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

Model.knex(knex);

const Person = require('../../models/Person'); 

Person.query()
.withGraphFetched('assignments')
.then((data) => {
    console.log(data)
})
.then(() => knex.destroy())
.catch(err => {
  console.error(err);
  return knex.destroy();
});