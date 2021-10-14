const swaggerJsdoc = require('swagger-jsdoc');

const schemas = {};
schemas.Message = require('../models/schemas/api/Message.json');
schemas.ErrorMessage = require('../models/schemas/api/ErrorMessage.json');
schemas.Person = require('../models/schemas/api/Person.json');
schemas.Event = require('../models/schemas/api/Event.json');
schemas.EventType = require('../models/schemas/api/EventType.json');
schemas.Assignment = require('../models/schemas/api/Assignment.json');
schemas.TimeZone = require('../models/schemas/api/TimeZone.json');

exports.getDoc = () => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Scheduler API',
        version: '0.1.0',
        description:
          'An API to manage persons, event types, events, and assignments.',
        license: {
          name: 'MIT',
          url: 'https://spdx.org/licenses/MIT.html',
        },
        contact: {
          name: 'John Lednicky',
          url: 'https://github.com/john-lednicky',
          email: 'john.d.lednicky@gmail.com',
        },
      },
      servers: [
        {
          url: 'http://localhost:3333',
        },
      ],
      components: {
        schemas: {},
      },
    },
    apis: ['./routes/*.js'],
  };

  options.definition.components.schemas = schemas;

  return swaggerJsdoc(options);
};
