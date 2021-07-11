const personService = require('../services/personService.js');
const createError = require('http-errors');

exports.index = async (req, res, next) => {
    personService.getAll()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            next(err);
        });
};

exports.find = async (req, res, next) => {
    const id = req.params.id;
    personService.find(id)
        .then((data) => {
            if (!data) {
                next(createError(404, `person ${id}`));
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
    const person = req.body;
    personService.create(person)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            next(err);
        });
};

exports.update = async (req, res, next) => {
    const person = req.body;
    personService.update(person)
        .then((data) => {
            if (data) {
                res.json(data);
            } 
            else {
                next(createError(500, `Attempt to update person ${person.id} resulted in no records updated.`)); 
            }
        })
        .catch((err) => {
            next(err);
        });        
};

exports.delete = async (req, res, next) => {
    const id = req.params.id;
    personService.delete(id)
        .then(() => {
            res.json({ 'message': `deleted person ${id}`});
        })
        .catch((err) => {
            next(err);
        });        
};