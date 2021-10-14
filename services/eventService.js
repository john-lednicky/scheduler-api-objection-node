const baseService = require('./baseService.js');

class eventService extends baseService {

  constructor(env = null) {
    super(env);
    this.Event = require('../models/Event');
  };

  convertZuluDateStringToSqlDateString = (dateString) => {
    let returnValue = dateString;
    if (returnValue) {
      returnValue = returnValue.replace('T', ' ').replace('Z', '');
    }
    return returnValue;
  }

  getAll = async () => this.Event.query();

  find = async (id) => {
    if (!this.isPositiveInteger(id)) {
      throw this.createError(400, `id is not a positive integer ${id}`);
    };
    return this.Event.query().findById(id);
  }

  delete = async (id) => {
    if (!this.isPositiveInteger(id)) {
      throw this.createError(400, `id is not a positive integer ${id}`);
    };
    return this.Event.query().deleteById(id);
  }

  create = async (event) => {
    event.updateUser = 'john.d.lednicky';
    event.updateDttm = Math.floor((new Date()).getTime() / 1000);
    event.beginDttm = this.convertZuluDateStringToSqlDateString(event.beginDttm);
    event.endDttm = this.convertZuluDateStringToSqlDateString(event.endDttm);
    
    // TODO eventService should validate that beginDttm is before endDttm
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
    event.updateUser = 'john.d.lednicky';
    event.updateDttm = Math.floor((new Date()).getTime() / 1000);
    event.beginDttm = this.convertZuluDateStringToSqlDateString(event.beginDttm);
    event.endDttm = this.convertZuluDateStringToSqlDateString(event.endDttm);

    //if the passed event is already a model, we have to explicitly call validate
    if (event.$modelClass) {
      event.$validate();
    }
    return this.Event.query().updateAndFetchById(event.id, event);
  };

}

module.exports = (env = null) => { return new eventService(env) }