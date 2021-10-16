/* eslint-disable global-require */
const { Model } = require('objection');
const { dbSchemas } = require('../services/jsonSchemaService');

// TODO unit test EventType validation
class EventType extends Model {
  static get tableName() {
    return 'event_type';
  }

  static get relationMappings() {
    const Event = require('./Event');
    return {
      events: {
        relation: Model.HasManyRelation,
        modelClass: Event,
        join: {
          from: 'event_type.id',
          to: 'event.event_type_id',
        },
      },
    };
  }

  static get jsonSchema() {
    return dbSchemas.eventTypeSchema;
  }
}

module.exports = EventType;
