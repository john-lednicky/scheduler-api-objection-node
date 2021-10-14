const baseService = require('./baseService.js');

class personService extends baseService {

  constructor(env = null) {
    super(env);
    this.Person = require('../models/Person');
    this.Assignment = require('../models/Assignment');
  };

  getAll = async () => this.Person.query();

  find = async (id) => {
    if (!this.isPositiveInteger(id)) {
      throw this.createError(400, `id is not a positive integer ${id}`);
    };
    return this.Person.query().findById(id);
  }

  create = async (person) => {
    delete person.id;
    person.updateUser = 'john.d.lednicky';
    person.updateDttm = Math.floor((new Date()).getTime() / 1000);

    //if the passed person is already a model, we have to explicitly call validate
    if (person.$modelClass) {
      person.$validate();
    }
    return this.Person.query().insertAndFetch(person);
  };

  update = async (person) => {
    if (!person.id) {
      throw this.createError(400, 'person lacks an id');
    }
    person.updateUser = 'john.d.lednicky';
    person.updateDttm = Math.floor((new Date()).getTime() / 1000);
    //if the passed person is already a model, we have to explicitly call validate
    if (person.$modelClass) {
      person.$validate();
    }
    return this.Person.query().updateAndFetchById(person.id, person);
  };

  delete = async (id) => {
    if (!this.isPositiveInteger(id)) {
      throw this.createError(400, `id is not a positive integer ${id}`);
    };
    return this.Assignment.query().delete().where('personId', '=', id)
      .then( () => {
        return this.Person.query().deleteById(id)
      })
      .catch((err) => { return Promise.reject(err) })
  };
}

module.exports = (env = null) => { return new personService(env) }