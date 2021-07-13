require('dotenv');
const express = require('express');
const helmet = require('helmet');
const winston = require('winston');
const expressWinston = require('express-winston');
const createError = require('http-errors');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./services/swaggerService.js').getDoc();
const favicon = require('serve-favicon');
const errorHandlerMiddleware = require('./middleware/error-handler.js');

const app = express();

// Express allows POST data in JSON format
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* helmet sets a number of http headers recommended for security. */
app.use(helmet());

/* Log request summary to console. */
app.use(expressWinston.logger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.message}`,
    ),
  ),
  transports: [
    new winston.transports.Console(),
  ],
}));
/* Log request details to file as json. */
app.use(expressWinston.logger({
  format: null,
  transports: [
    new winston.transports.File({
      filename: './logs/request.log',
      maxsize: 1048576,
      tailable: true,
      zippedArchive: true,
    }),
  ],
}));

/* swagger api */
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc),
);

app.use(favicon('./public/images/favicon.ico'));

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
app.use(expressWinston.errorLogger({
  format: winston.format.combine(
    winston.format.prettyPrint(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: './logs/error.log',
      maxsize: 1048576, /* 1 meg file */
      tailable: true,
      zippedArchive: true,
    }),
  ],
}));

app.use(errorHandlerMiddleware);

module.exports = app;
