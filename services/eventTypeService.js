const knexConfig = require('../knexfile.js');
const { Model } = require('objection');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

Model.knex(knex);

const EventType = require('../models/EventType');

exports.getAll = async () => EventType.query();

exports.find = async (id) => EventType.query().findById(id);

exports.create = async (eventType) => EventType.query().insertAndFetch(eventType);

exports.update = async (eventType) => {
  if (!eventType.id) {
    throw createError(400, 'eventType lacks an id');
  }
  return EventType.query().updateAndFetchById(eventType.id, eventType);
};

exports.delete = async (id) =>
// TODO eventType needs to be disabled instead of hard deleting
// TODO delete future events based on this eventType, but not past events
  EventType.query().deleteById(id);
