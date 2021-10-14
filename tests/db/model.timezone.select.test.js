require('dotenv').config();
const knexConfig = require('../../knexfile.js');

const { Model, knexIdentifierMapping } = require('objection');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

Model.knex(knex);

const TimeZone = require('../../models/TimeZone'); 

TimeZone.query()
.select()
.then((data) => {
    console.dir(data, {depth: null})
})
.then(() => knex.destroy())
.catch(err => {
  console.error(err);
  return knex.destroy();
});