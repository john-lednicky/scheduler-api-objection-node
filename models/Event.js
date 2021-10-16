/* eslint-disable global-require */
const { Model } = require('objection');
const { dbSchemas } = require('../services/jsonSchemaService');

class Event extends Model {
  static get tableName() {
    return 'event';
  }

  static get relationMappings() {
    const EventType = require('./EventType');
    return {
      eventType: {
        relation: Model.BelongsToOneRelation,
        modelClass: EventType,
        join: {
          from: 'event.event_type_id',
          to: 'event_type.id',
        },
      },
    };
  }

  static get jsonSchema() {
    return dbSchemas.eventSchema;
  }
}

module.exports = Event;
