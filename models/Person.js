const { Model } = require('objection');

// TODO unit test person validation

class Person extends Model {
  static get tableName() {
    return 'person';
  }

  static get relationMappings() {
    const Assignment = require('./Assignment');
    return {
      assignments: {
        relation: Model.HasManyRelation,
        modelClass: Assignment,
        join: {
          from: 'person.id',
          to: 'assignment.person_id',
        },
      },
    };
  }

  static get jsonSchema() {
    return require('./Person.json');
  }
}

module.exports = Person;
