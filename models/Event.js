const { Model } = require('objection');

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
    return require('./Event.json');
  }
}

module.exports = Event;
