const eventTypeService = require('../services/eventTypeService.js');
const createError = require('http-errors');

exports.index = async (req, res, next) => {
    eventTypeService.getAll()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            next(err);
        });
};

exports.find = async (req, res, next) => {
    const id = req.params.id;
    eventTypeService.find(id)
        .then((data) => {
            if (!data) {
                next(createError(404, `eventType ${id}`));
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
    const eventType = req.body;
    eventTypeService.create(eventType)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            next(err);
        });
};

exports.update = async (req, res, next) => {
    const eventType = req.body;
    eventTypeService.update(eventType)
        .then((data) => {
            if (data) {
                res.json(data);
            } 
            else {
                next(createError(500, `Attempt to update eventType ${eventType.id} resulted in no records updated.`)); 
            }
        })
        .catch((err) => {
            next(err);
        });        
};

exports.delete = async (req, res, next) => {
    const id = req.params.id;
    eventTypeService.delete(id)
        .then(() => {
            res.json({ 'message': `deleted eventType ${id}`});
        })
        .catch((err) => {
            next(err);
        });        
};