const knexConfig = require('../knexfile.js');
const { Model } = require('objection');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

Model.knex(knex);

const Assignment = require('../models/Assignment');

exports.getAll = async () => Assignment.query();

exports.find = async (personId, eventId) => Assignment.query().findById([personId, eventId]);

exports.create = async (assignment) => Assignment.query().insert(assignment);

exports.update = async (assignment) => Assignment.query().updateAndFetchById([assignment.personId, assignment.eventId], assignment);

exports.delete = async (personId, eventId) => Assignment.query().deleteById([personId, eventId]);
