const knexConfig = require('../knexfile.js');
const { Model } = require('objection');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);
Model.knex(knex);

const EventType = require('../models/EventType');

exports.getAll = async () => {
    return EventType.query();
};

exports.find = async (id) => {
    return EventType.query().findById(id);
};

exports.create = async (eventType) => {
    return EventType.query().insertAndFetch(eventType);
};

exports.update = async (eventType) => {
    if (!eventType.id) {
        //TODO Throw an exception when id is null in eventTypeService.update()
    }
    return EventType.query().updateAndFetchById(eventType.id, eventType);
};

exports.delete = async (id) => {
    //TODO eventType needs to be disabled instead of hard deleting
    //TODO delete future events based on this eventType, but not past events
    return EventType.query().deleteById(id);
};