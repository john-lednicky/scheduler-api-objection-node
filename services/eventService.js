if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const baseService = require('./baseService.js');

class eventService extends baseService {

  constructor(env = null) {
    super(env);
    this.Event = require('../models/Event');
  };

  getAll = async () => this.Event.query();
  find = async (id) => this.Event.query().findById(id);
  delete = async (id) => this.Event.query().deleteById(id);

  create = async (event) => {
    //if the passed event is already a model, we have to explicitly call validate
    if (event.$modelClass) {
      event.$validate();
    }
    return this.Event.query().insertAndFetch(event);
  }
  
  update = async (event) => {
    if (!event.id) {
      throw this.createError(400, 'event lacks an id');
    }
    //if the passed event is already a model, we have to explicitly call validate
    if (event.$modelClass) {
      event.$validate();
    }
    return this.Event.query().updateAndFetchById(event.id, event);
  };

}

module.exports = (env = null) => { return new eventService(env) }