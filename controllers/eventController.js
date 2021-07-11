const eventService = require('../services/eventService.js');
const createError = require('http-errors');

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
    const id = req.params.id;
    eventService.find(id)
        .then((data) => {
            if (!data) {
                next(createError(404, `event ${id}`));
            }
            else {
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
            } 
            else {
                next(createError(500, `Attempt to update event ${event.id} resulted in no records updated.`)); 
            }
        })
        .catch((err) => {
            next(err);
        });        
};

exports.delete = async (req, res, next) => {
    const id = req.params.id;
    eventService.delete(id)
        .then(() => {
            res.json({ 'message': `deleted event ${id}`});
        })
        .catch((err) => {
            next(err);
        });        
};