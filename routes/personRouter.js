const express = require('express');
const createError = require('http-errors');
const validationService = require('../services/validationService');
const personService = require('../services/personService')();

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Persons
 *   description: Methods to manage Person objects
 */

/**
 * @swagger
 *
 * /persons:
 *   get:
 *     summary: Get all persons
 *     description: Retrieves a list of all persons
 *     tags: [Persons]
 *     responses:
 *       200:
 *         description: A list of persons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Person'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.get('/', async (req, res, next) => {
  personService.getAll()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * @swagger
 *
 * /persons/{id}:
 *   get:
 *     summary: Get one person
 *     description: Retrieves a specific person.
 *     tags: [Persons]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: int
 *         description: The id of the person to retrieve.
 *         example: 0
 *     responses:
 *       200:
 *         description: A person
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       404:
 *         description: Not Found Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  personService.find(id)
    .then((data) => {
      if (!data) {
        next(createError(404, `person ${id}`));
      } else {
        res.json(data);
      }
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * @swagger
 *
 * /persons:
 *   post:
 *     summary: Create
 *     description: Creates a new person.
 *     tags: [Persons]
 *     requestBody:
 *       description: A JSON representation of the new person, without an id.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddPerson'
 *     responses:
 *       200:
 *         description: The person created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.post('/', async (req, res, next) => {
  const person = req.body;
  const validationResult = validationService.validateEntity('Person', 'add', person);
  if (validationResult) {
    next(createError(400, validationResult));
  }
  personService.create(person)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * @swagger
 *
 * /persons:
 *   put:
 *     summary: Update
 *     description: Updates an existing person.
 *     tags: [Persons]
 *     requestBody:
 *       description: A JSON representation of the person to update, identified by the id.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePerson'
 *     responses:
 *       200:
 *         description: The person updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.put('/', async (req, res, next) => {
  const person = req.body;
  const validationResult = validationService.validateEntity('Person', 'update', person);
  if (validationResult) {
    next(createError(400, validationResult));
  }
  personService.update(person)
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        next(createError(404, `person ${person.id}`));
      }
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * @swagger
 *
 * /persons/{id}:
 *   delete:
 *     summary: Delete one
 *     description: Deletes a specific person.
 *     tags: [Persons]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: int
 *         description: The id of the person to delete.
 *         example: 0
 *     responses:
 *       200:
 *         description: Delete confirmation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       404:
 *         description: Not Found Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  personService.delete(id)
    .then((data) => {
      if (data === 1) {
        res.json({ message: `deleted person ${id}` });
      } else if (data === 0) {
        next(createError(404, `person ${id}`));
      } else {
        createError(500, `unexpected problem deleting person ${id}`);
      }
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
