const baseService = require('./baseService.js');

class timeZoneService extends baseService {

  constructor(env = null) {
    super(env);
    this.TimeZone = require('../models/TimeZone');
  };

  getAll = async () => this.TimeZone.query();


}

module.exports = (env = null) => { return new timeZoneService(env) }