const baseService = require('./baseService.js');

class eventTypeService extends baseService {

  constructor(env = null) {
    super(env);
    this.EventType = require('../models/EventType');
  };

  getAll = async () => this.EventType.query();

  find = async (id) => { 
    if (!this.isPositiveInteger(id)) {
      throw this.createError(400, `id is not a positive integer ${id}`);
    };
    return this.EventType.query().findById(id);
  }

  create = async (eventType) => {
    //if the passed eventType is already a model, we have to explicitly call validate
    if (eventType.$modelClass) {
      eventType.$validate();
    }
    return this.EventType.query().insertAndFetch(eventType);
  }
  
  update = async (eventType) => {
    if (!eventType.id) {
      throw this.createError(400, 'eventType lacks an id');
    }
    //if the passed eventType is already a model, we have to explicitly call validate
    if (eventType.$modelClass) {
      eventType.$validate();
    }
    return this.EventType.query().updateAndFetchById(eventType.id, eventType);
  };

  delete = async (id) => {
    // TODO eventType needs to be disabled instead of hard deleting
    // TODO delete future events based on this eventType, but not past events
    if (!this.isPositiveInteger(id)) {
      throw this.createError(400, `id is not a positive integer ${id}`);
    };    
    return this.EventType.query().deleteById(id);
  }
}

module.exports = (env = null) => { return new eventTypeService(env) }