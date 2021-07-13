const createError = require('http-errors');
const eventService = require('../services/eventService.js');

exports.index = async (req, res, next) => {
  eventService.getAll()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
};

exports.find = async (req, res, next) => {
  const { id } = req.params;
  eventService.find(id)
    .then((data) => {
      if (!data) {
        next(createError(404, `event ${id}`));
      } else {
        res.json(data);
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.create = async (req, res, next) => {
  const event = req.body;
  eventService.create(event)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
};

exports.update = async (req, res, next) => {
  const event = req.body;
  eventService.update(event)
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        next(createError(404, `event ${id}`));
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.delete = async (req, res, next) => {
  const { id } = req.params;
  eventService.delete(id)
    .then(() => {
      res.json({ message: `deleted event ${id}` });
    })
    .catch((err) => {
      next(err);
    });
};
