const winston = require('winston');
const expressWinston = require('express-winston');

const requestLogging = (app) => {
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
};

const errorLogging = (app) => {
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
};

exports.requestLogging = requestLogging;
exports.errorLogging = errorLogging;
