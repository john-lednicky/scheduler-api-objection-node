/* eslint-disable global-require */
const { Model } = require('objection');

class TimeZone extends Model {
  /*
  Time Zone strings are implemented in the database as a lookup table
  where the PK is the time zone name that constrains Event.Timezone.
  The relationship is not modeled here.
  The constraint is implemented in the API JSON schema as an array of values.
  The db JSON schema checks the value against a regex.
  Time zones are read only through the API, so there is no db schema for this table.
  */
  static get tableName() {
    return 'time_zone';
  }
}

module.exports = TimeZone;
