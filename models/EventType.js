const { Model } = require('objection');

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
    return require('./EventType.json');
  }
}

module.exports = EventType;
