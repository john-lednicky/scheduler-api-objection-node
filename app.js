const express = require('express');
const helmet = require('helmet');
const createError = require('http-errors');
const swaggerUi = require('swagger-ui-express');
const favicon = require('serve-favicon');
const swaggerService = require('./services/swaggerService');
const errorHandlerMiddleware = require('./middleware/error-handler');
const { requestLogging, errorLogging } = require('./middleware/winston-logger');
const { tokenHandler } = require('./middleware/token-handler');

const NODE_ENVIRONMENT = process.env.NODE_ENV || 'development';
const app = express();

// Express allows POST data in JSON format
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* helmet sets a number of http headers recommended for security. */
app.use(helmet());

/* Log requests */
requestLogging(app);

app.use(favicon('./public/images/favicon.ico'));

/* authorization debugging */
if (NODE_ENVIRONMENT !== 'production') {
  // eslint-disable-next-line global-require
  app.use('/api/inspectRequest', tokenHandler, require('./routes/inspectRequestRouter'));
}

/* swagger api */
app.use('/api/api-doc-ui', swaggerUi.serve, swaggerUi.setup(swaggerService.getDoc()));
app.use('/api/api-doc', require('./routes/swaggerRouter'));

/* scheduler routes */
/* NOTE: tokenHandler validates JWT from authorization header
        and populates req.tokenUserEmail and req.tokenUserName */
app.use('/api/persons', tokenHandler, require('./routes/personRouter'));
app.use('/api/events', tokenHandler, require('./routes/eventRouter'));
app.use('/api/eventTypes', tokenHandler, require('./routes/eventTypeRouter'));
app.use('/api/assignments', tokenHandler, require('./routes/assignmentRouter'));
app.use('/api/timeZones', tokenHandler, require('./routes/timeZoneRouter'));

/* an error route for testing */
app.get('/api/error', (req, res, next) => next(new Error('This is an error and it should be logged to the console')));

// All requests not handled by a previous route are handled by emitting a 404
app.use((req, res, next) => {
  next(createError(404));
});

/* Log exceptions. */
errorLogging(app);

app.use(errorHandlerMiddleware);

module.exports = app;
