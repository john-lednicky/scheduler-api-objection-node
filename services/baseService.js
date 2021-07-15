class baseService {
    constructor(env = null) {
        this.createError = require('http-errors');
        const knexConfig = require('../knexfile.js');
        this.model = require('objection').Model;
        this.knex = require('knex')(knexConfig[env || process.env.NODE_ENV || 'development']);

        this.model.knex(this.knex);
    };
}

module.exports = baseService;