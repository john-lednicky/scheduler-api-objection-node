const swaggerJsdoc = require('swagger-jsdoc');

const schemas = {};
schemas.Message = require('../models/Message.json');
schemas.ErrorMessage = require('../models/ErrorMessage.json');
schemas.Person = require('../models/Person.json');
schemas.Event = require('../models/Event.json');
schemas.EventType = require('../models/EventType.json');
schemas.Assignment = require('../models/Assignment.json');

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
        schemas: {}
      }
    },
    apis: ['./routes/*.js']
  };

  options.definition.components.schemas = schemas;

  return swaggerJsdoc(options);
};
