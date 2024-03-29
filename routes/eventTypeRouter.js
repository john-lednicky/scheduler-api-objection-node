const express = require('express');
const createError = require('http-errors');
const validationService = require('../services/validationService');
const eventTypeService = require('../services/eventTypeService')();

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Event Types
 *   description: Methods to manage EventType objects
 */

/**
 * @swagger
 *
 * /eventTypes:
 *   get:
 *     summary: Get all event types
 *     description: Retrieves a list of all event types
 *     tags: [Event Types]
 *     responses:
 *       200:
 *         description: A list of event types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/eventTypeSchema'
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
  eventTypeService.getAll()
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
 * /eventTypes/{id}:
 *   get:
 *     summary: Get one event type
 *     description: Retrieves a specific event type.
 *     tags: [Event Types]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: int
 *         description: The id of the event type to retrieve.
 *         example: 0
 *     responses:
 *       200:
 *         description: An event type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/eventTypeSchema'
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
  eventTypeService.find(id)
    .then((data) => {
      if (!data) {
        next(createError(404, `eventType ${id}`));
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
 * /eventTypes:
 *   post:
 *     summary: Create
 *     description: Creates a new event type.
 *     tags: [Event Types]
 *     requestBody:
 *       description: A JSON representation of the new event type, without an id.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/eventTypeAddSchema'
 *     responses:
 *       200:
 *         description: The event type created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/eventTypeSchema'
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
  const eventType = req.body;
  const validationResult = validationService.validateEntity('EventType', 'add', eventType);
  if (validationResult) {
    next(createError(400, validationResult));
  }
  eventTypeService.create(eventType, req.tokenUserName, eventTypeService.getCurrentTimestamp())
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
 * /eventTypes:
 *   put:
 *     summary: Update
 *     description: Updates an existing event type.
 *     tags: [Event Types]
 *     requestBody:
 *       description: A JSON representation of the event type to update, identified by the id.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/eventTypeUpdateSchema'
 *     responses:
 *       200:
 *         description: The event type updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/eventTypeSchema'
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
  const eventType = req.body;
  const validationResult = validationService.validateEntity('EventType', 'update', eventType);
  if (validationResult) {
    next(createError(400, validationResult));
  }

  eventTypeService.update(eventType, req.tokenUserName, eventTypeService.getCurrentTimestamp())
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        next(createError(404, `eventType ${eventType.id}`));
      }
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * @swagger
 *
 * /eventTypes/{id}:
 *   delete:
 *     summary: Delete one
 *     description: Deletes a specific event type.
 *     tags: [Event Types]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: int
 *         description: The id of the event type to delete.
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
  eventTypeService.delete(id)
    .then(() => {
      res.json({ message: `deleted eventType ${id}` });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
