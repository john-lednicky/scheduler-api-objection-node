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

  find = async (personId, eventId) => {
    if (!this.isPositiveInteger(personId)) {
      throw this.createError(400, `personId is not a positive integer ${id}`);
    };    
    if (!this.isPositiveInteger(eventId)) {
      throw this.createError(400, `eventId is not a positive integer ${id}`);
    };   
    return this.Assignment.query().findById([personId, eventId]);
  }

  delete = async (personId, eventId) => {
    if (!this.isPositiveInteger(personId)) {
      throw this.createError(400, `personId is not a positive integer ${id}`);
    };    
    if (!this.isPositiveInteger(eventId)) {
      throw this.createError(400, `eventId is not a positive integer ${id}`);
    };   
    return this.Assignment.query().deleteById([personId, eventId]);
  }

  create = async (assignment) => {
    //if the passed event is already a model, we have to explicitly call validate
    if (assignment.$modelClass) {
      assignment.$validate();
    }
    return this.Assignment.query().insert(assignment);
  }
}

module.exports = (env = null) => { return new assignmentService(env) };