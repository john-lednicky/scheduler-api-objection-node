const express = require('express');
const createError = require('http-errors');
const validationService = require('../services/validationService');
const eventService = require('../services/eventService')();

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Methods to manage Event objects
 */

/**
 * @swagger
 *
 * /events:
 *   get:
 *     summary: Get all events
 *     description: Retrieves a list of all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/eventSchema'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorMessageSchema'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorMessageSchema'
 */
router.get('/', async (req, res, next) => {
  eventService.getAll()
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
 * /events/{id}:
 *   get:
 *     summary: Get one event
 *     description: Retrieves a specific event.
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: int
 *         description: The id of the event to retrieve.
 *         example: 0
 *     responses:
 *       200:
 *         description: An event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/eventSchema'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorMessageSchema'
 *       404:
 *         description: Not Found Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorMessageSchema'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorMessageSchema'
 */
router.get('/:id', async (req, res, next) => {
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
});

/**
 * @swagger
 *
 * /events:
 *   post:
 *     summary: Create
 *     description: Creates a new event.
 *     tags: [Events]
 *     requestBody:
 *       description: A JSON representation of the new event, without an id.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/eventAddSchema'
 *     responses:
 *       200:
 *         description: The event created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/eventSchema'
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorMessageSchema'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorMessageSchema'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorMessageSchema'
 */
router.post('/', async (req, res, next) => {
  const event = req.body;
  const validationResult = validationService.validateEntity('Event', 'add', event);
  if (validationResult) {
    next(createError(400, validationResult));
  }

  eventService.create(event, req.tokenUserName, eventService.getCurrentTimestamp())
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
 * /events:
 *   put:
 *     summary: Update
 *     description: Updates an existing event.
 *     tags: [Events]
 *     requestBody:
 *       description: A JSON representation of the person to event, identified by the id.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/eventUpdateSchema'
 *     responses:
 *       200:
 *         description: The event updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/eventSchema'
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorMessageSchema'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorMessageSchema'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorMessageSchema'
 */
router.put('/', async (req, res, next) => {
  const event = req.body;
  const validationResult = validationService.validateEntity('Event', 'update', event);
  if (validationResult) {
    next(createError(400, validationResult));
  }

  eventService.update(event, req.tokenUserName, eventService.getCurrentTimestamp())
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        next(createError(404, `event ${event.id}`));
      }
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * @swagger
 *
 * /events/{id}:
 *   delete:
 *     summary: Delete one
 *     description: Deletes a specific event.
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: int
 *         description: The id of the event to delete.
 *         example: 0
 *     responses:
 *       200:
 *         description: Delete confirmation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/messageSchema'
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorMessageSchema'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorMessageSchema'
 *       404:
 *         description: Not Found Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorMessageSchema'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorMessageSchema'
 */
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  eventService.delete(id)
    .then(() => {
      res.json({ message: `deleted event ${id}` });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
