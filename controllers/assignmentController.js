const createError = require('http-errors');
const assignmentService = require('../services/assignmentService.js')();

exports.index = async (req, res, next) => {
  assignmentService.getAll()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
};

exports.find = async (req, res, next) => {
  const { personId, eventId } = req.params;
  assignmentService.find(personId, eventId)
    .then((data) => {
      if (!data) {
        next(createError(404, `assignment for person ${personId} and event ${eventId}`));
      } else {
        res.json(data);
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.create = async (req, res, next) => {
  const assignment = req.body;
  assignmentService.create(assignment)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
};

exports.delete = async (req, res, next) => {
  const { personId, eventId } = req.params;
  assignmentService.delete(personId, eventId)
    .then(() => {
      res.json({ message: `deleted assignment for person ${personId} and event ${eventId}` });
    })
    .catch((err) => {
      next(err);
    });
};
