/* eslint-disable global-require */
class baseService {
  constructor(env = null) {
    this.createError = require('http-errors');
    const knexFile = require('../knexfile');
    this.knexEnvironmentConfig = knexFile[env || process.env.NODE_ENV || 'development'];
    this.knex = require('knex')(this.knexEnvironmentConfig);
    this.model = require('objection').Model;
    this.model.knex(this.knex);
    this.isPositiveInteger = (value) => {
      /* https://stackoverflow.com/a/14794066 */
      if (Number.isNaN(value)) {
        return false;
      }
      const x = parseFloat(value);
      // eslint-disable-next-line no-bitwise
      return x > 0 && (x | 0) === x;
    };
  }

  // eslint-disable-next-line class-methods-use-this
  getCurrentTimestamp() {
    return Math.floor((new Date()).getTime() / 1000);
  }
}

module.exports = baseService;
