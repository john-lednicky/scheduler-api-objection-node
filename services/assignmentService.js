const knexConfig = require('../knexfile.js');
const { Model } = require('objection');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);
Model.knex(knex);

const Assignment = require('../models/Assignment');

exports.getAll = async () => {
    return Assignment.query();
};

exports.find = async (personId, eventId) => {
    return Assignment.query().findById([personId, eventId]);
};

exports.create = async (assignment) => {
    //TODO Error handling for assignmentService.create() (duplicate key crashed server.js)
    return Assignment.query().insert(assignment);
};

exports.update = async (assignment) => {
    if (!Assignment.id) {
        //TODO Throw an exception when personId or eventId is null in assignmentService.update()
    }
    return Assignment.query().updateAndFetchById([assignment.personId, assignment.eventId], assignment);
};

exports.delete = async (personId, eventId) => {
    return Assignment.query().deleteById([personId, eventId]);
};