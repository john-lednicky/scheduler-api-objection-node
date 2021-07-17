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
    delete = async (personId, eventId) => this.Assignment.query().deleteById([personId, eventId]);
    
    create = async (assignment) => {
        //if the passed event is already a model, we have to explicitly call validate
        if (assignment.$modelClass) {
            assignment.$validate();
        }
        return this.Assignment.query().insert(assignment);
    }
}

module.exports = (env = null) => { return new assignmentService(env) };