if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const baseService = require('./baseService.js');

class personService extends baseService {

  constructor(env = null) {
    super(env);
    this.Person = require('../models/Person');
    this.Assignment = require('../models/Assignment');
  };

  getAll = async () => this.Person.query();
  find = async (id) => this.Person.query().findById(id);

  create = async (person) => {
    delete person.id;
    return this.Person.query().insertAndFetch(person);
  };

  update = async (person) => {
    if (!person.id) {
      throw this.createError(400, 'person lacks an id');
    }
    return this.Person.query().updateAndFetchById(person.id, person);
  };

  delete = async (id) => {
    this.Assignment.query().delete().where('personId', '=', id)
      .then(() => this.Person.query().deleteById(id));
  };
}

module.exports = (env = null) => { return new personService(env) }