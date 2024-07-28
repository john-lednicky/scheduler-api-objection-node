const swaggerJsdoc = require('swagger-jsdoc');

const { swaggerSchemas } = require('./jsonSchemaService');

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
          url: 'https://lednicky.localhost/api',
        },
      ],
      components: {
        schemas: {},
      },
    },
    apis: ['./routes/*.js'],
  };

  options.definition.components.schemas = swaggerSchemas;

  return swaggerJsdoc(options);
};
