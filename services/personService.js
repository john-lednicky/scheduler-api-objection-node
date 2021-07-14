const createError = require('http-errors');
const knexConfig = require('../knexfile.js');
const { Model } = require('objection');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

Model.knex(knex);

const Person = require('../models/Person');
const Assignment = require('../models/Assignment');

exports.getAll = async () => Person.query();

exports.find = async (id) => Person.query().findById(id);

exports.create = async (person) => {
  delete person.id;
  return Person.query().insertAndFetch(person);
};

exports.update = async (person) => {
  if (!person.id) {
    throw createError(400, 'person lacks an id');
  }
  return Person.query().updateAndFetchById(person.id, person);
};

exports.delete = async (id) => {
  Assignment.query().delete().where('personId', '=', id)
    .then(() => Person.query().deleteById(id));
};
