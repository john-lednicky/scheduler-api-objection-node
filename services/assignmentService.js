if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const baseService = require('./baseService.js');

class assignmentService extends baseService {

    constructor(env = null) {
        super(env);
        this.Assignment = require('../models/Assignment');
    };

    getAll = async () => this.Assignment.query();
    find = async (personId, eventId) => this.Assignment.query().findById([personId, eventId]);
    create = async (assignment) => this.Assignment.query().insert(assignment);
    update = async (assignment) => this.Assignment.query().updateAndFetchById([assignment.personId, assignment.eventId], assignment);
    delete = async (personId, eventId) => this.Assignment.query().deleteById([personId, eventId]);
}

module.exports = (env=null) =>  { return new assignmentService(env) };