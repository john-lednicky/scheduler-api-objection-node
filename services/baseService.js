require('dotenv').config();

class baseService {
    constructor(env = null, db = null) {
        this.createError = require('http-errors');
        const knexFile = require('../knexfile.js');
        this.knexEnvironmentConfig = knexFile[env || process.env.NODE_ENV || 'development'];
        this.knex = require('knex')(this.knexEnvironmentConfig);
        this.model = require('objection').Model;
        this.model.knex(this.knex);
        this.isPositiveInteger = (value) => {
            /* https://stackoverflow.com/a/14794066 */
            var x;
            if (isNaN(value)) {
              return false;
            }
            x = parseFloat(value);
            return x > 0 && (x | 0) === x;
        }
    };
}

module.exports = baseService;