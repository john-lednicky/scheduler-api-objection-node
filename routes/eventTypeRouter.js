const express = require('express');
const router = express.Router();
const eventTypeController = require('../controllers/eventTypeController.js');

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
 *                 $ref: '#/components/schemas/EventType'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage' 
 */
router.get('/', eventTypeController.index);

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
 *               $ref: '#/components/schemas/EventType'
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
router.get('/:id', eventTypeController.find);

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
 *             $ref: '#/components/schemas/EventType'
 *     responses:
 *       200:
 *         description: The event type created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventType'
 *       400:
 *         description: Validation Error
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
router.post('/', eventTypeController.create);

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
 *             $ref: '#/components/schemas/EventType'
 *     responses:
 *       200:
 *         description: The event type updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventType'
 *       400:
 *         description: Validation Error
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
router.put('/', eventTypeController.update);

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
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Validation Error
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
router.delete('/:id', eventTypeController.delete);

module.exports = router;
