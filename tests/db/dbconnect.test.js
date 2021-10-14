const result = require('dotenv').config()
const knexConfig = require('../../knexfile.js');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

const newPerson = {
    first_name: 'Wally',
    middle_name: '',
    last_name: 'Wilbersnort',
    phone: '5126667777',
    email: 'wally.wilbersnort@scratch.com',
    updateUser: 'john.d.lednicky',
    updateDttm: 1634224418,
  }

knex
.insert(newPerson)
.into('person')
.then(id => {
  console.log(`inserted id ${id}`);
})
.then ( () => {
  return knex.
  table('person')
  .select()
  .where('last_name', 'like', 'W%')    
})
.then(rows => {
  console.log(rows);
})
.then ( () => {
  return knex.
  table('person')
  .del()
  .where('last_name', 'like', 'W%')    
})
.then ( () => {
  return knex
  .table('person')
  .count('id')
  .where('last_name', 'like', 'W%')    
})
.then(result => {
  console.log(result);
})
.catch(err => {
  console.error(err); 
})
.finally( () => {
  knex.destroy();
  console.log('done');
})


//
console.log('end of script')
