/* eslint-disable global-require */
const { Model } = require('objection');
const { dbSchemas } = require('../services/jsonSchemaService');

class Assignment extends Model {
  static get tableName() {
    return 'assignment';
  }

  static get idColumn() {
    return ['person_id', 'event_id'];
  }

  static get relationMappings() {
    const Event = require('./Event');
    const Person = require('./Person');
    return {
      event: {
        relation: Model.HasOneRelation,
        modelClass: Event,
        join: {
          from: 'assignment.event_id',
          to: 'event.id',
        },
      },
      person: {
        relation: Model.HasOneRelation,
        modelClass: Person,
        join: {
          from: 'assignment.person_id',
          to: 'person.id',
        },
      },
    };
  }

  static get jsonSchema() {
    return dbSchemas.assignmentSchema;
  }
}
module.exports = Assignment;
