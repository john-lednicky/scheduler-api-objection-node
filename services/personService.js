const knexConfig = require('../knexfile.js');
const { Model } = require('objection');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);
Model.knex(knex);

const Person = require('../models/Person');
const Assignment = require('../models/Assignment');

exports.getAll = async () => {
    return Person.query();
};

exports.find = async (id) => {
    return Person.query().findById(id);
};

exports.create = async (person) => {
    //return Person.query().insertGraph(person);
    return Person.query().insertAndFetch(person);
};

exports.update = async (person) => {
    if (!person.id) {
        //TODO Throw an exception when id is null in personService.update()
    }
    return Person.query().updateAndFetchById(person.id, person);
};

exports.delete = async (id) => {
    //TODO Cascade delete assignments when person is deleted
    Assignment.query().delete().where('personId','=',id)
    .then( () => {
        return Person.query().deleteById(id);
    });
};