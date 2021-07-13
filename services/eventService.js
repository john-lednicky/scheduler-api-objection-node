const createError = require('http-errors');

const knexConfig = require('../knexfile.js');
const { Model } = require('objection');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

Model.knex(knex);

const Event = require('../models/Event');

exports.getAll = async () => Event.query();

exports.find = async (id) => Event.query().findById(id);

exports.create = async (event) => Event.query().insertAndFetch(event);

exports.update = async (event) => {
  if (!event.id) {
    throw createError(400, 'event lacks an id');
  }
  return Event.query().updateAndFetchById(event.id, event);
};

exports.delete = async (id) => Event.query().deleteById(id);
