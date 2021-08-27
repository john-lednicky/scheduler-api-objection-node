require('dotenv');
const express = require('express');
const helmet = require('helmet');
const createError = require('http-errors');
const swaggerUi = require('swagger-ui-express');
const favicon = require('serve-favicon');
const swaggerService = require('./services/swaggerService');
const errorHandlerMiddleware = require('./middleware/error-handler');
const { requestLogging, errorLogging } = require('./middleware/winston-logger');

const app = express();

// Express allows POST data in JSON format
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* helmet sets a number of http headers recommended for security. */
app.use(helmet());

/* Log requests */
requestLogging(app);

app.use(favicon('./public/images/favicon.ico'));

/* swagger api */
app.use('/api-doc-ui', swaggerUi.serve, swaggerUi.setup(swaggerService.getDoc()));
app.use('/api-doc', require('./routes/swaggerRouter'));

app.use('/persons', require('./routes/personRouter'));
app.use('/events', require('./routes/eventRouter'));
app.use('/eventTypes', require('./routes/eventTypeRouter'));
app.use('/assignments', require('./routes/assignmentRouter'));

app.get('/error', (req, res, next) => next(new Error('This is an error and it should be logged to the console')));

// All requests not handled by a previous route are by emitting a 404
app.use((req, res, next) => {
  next(createError(404));
});

/* Log exceptions. */
errorLogging(app);

app.use(errorHandlerMiddleware);

module.exports = app;
