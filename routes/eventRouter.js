const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController.js');

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
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage' 
 */
router.get('/', eventController.index);

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
 *               $ref: '#/components/schemas/Person'
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
router.get('/:id', eventController.find);

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
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: The event created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
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
router.post('/', eventController.create);

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
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: The event updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
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
router.put('/', eventController.update);

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
 router.delete('/:id', eventController.delete);

module.exports = router;
