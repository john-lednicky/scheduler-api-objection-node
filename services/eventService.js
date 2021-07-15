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
  create = async (event) => this.Event.query().insertAndFetch(event);
  delete = async (id) => this.Event.query().deleteById(id);

  update = async (event) => {
    if (!event.id) {
      throw this.createError(400, 'event lacks an id');
    }
    return this.Event.query().updateAndFetchById(event.id, event);
  };

}

module.exports = (env=null) => { return new eventService(env) }