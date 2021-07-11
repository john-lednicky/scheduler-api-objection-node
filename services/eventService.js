const knexConfig = require('../knexfile.js');
const { Model } = require('objection');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);
Model.knex(knex);

const Event = require('../models/Event');

exports.getAll = async () => {
    return Event.query();
};

exports.find = async (id) => {
    return Event.query().findById(id);
};

exports.create = async (event) => {
    return Event.query().insertAndFetch(event);
};

exports.update = async (event) => {
    if (!Event.id) {
        //TODO Throw an exception when id is null in EventService.update()
    }
    return Event.query().updateAndFetchById(event.id, event);
};

exports.delete = async (id) => {
    return Event.query().deleteById(id);
};