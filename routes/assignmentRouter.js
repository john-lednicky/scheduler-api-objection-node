const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController.js');

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: Methods to manage Assignment objects
 */

/**
 * @swagger
 *
 * /assignments:
 *   get:
 *     summary: Get all assignments
 *     description: Retrieves a list of all assignments
 *     tags: [Assignments]
 *     responses:
 *       200:
 *         description: A list of assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Assignment'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage' 
 */
router.get('/', assignmentController.index);

/**
 * @swagger
 *
 * /assignments/{personId}/{eventId}:
 *   get:
 *     summary: Get one assignment
 *     description: Retrieves a specific assignment.
 *     tags: [Assignments]
 *     parameters:
 *       - name: personId
 *         in: path
 *         required: true
 *         type: int
 *         description: The person id of the assignment to delete.
 *         example: 5
 *       - name: eventId
 *         in: path
 *         required: true
 *         type: int
 *         description: The event id of the assignment to delete.
 *         example: 240
 *     responses:
 *       200:
 *         description: An assignment
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
router.get('/:personId/:eventId', assignmentController.find);

/**
 * @swagger
 *
 * /assignments:
 *   post:
 *     summary: Create
 *     description: Creates a new assignment.
 *     tags: [Assignments]
 *     requestBody:
 *       description: A JSON representation of the new assignment, without an id.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assignment'
 *     responses:
 *       200:
 *         description: The assignment created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
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
router.post('/', assignmentController.create);

/**
 * @swagger
 *
 * /assignments/{personId}/{eventId}:
 *   delete:
 *     summary: Delete one
 *     description: Deletes a specific assignment.
 *     tags: [Assignments]
 *     parameters:
 *       - name: personId
 *         in: path
 *         required: true
 *         type: int
 *         description: The person id of the assignment to delete.
 *         example: 5
 *       - name: eventId
 *         in: path
 *         required: true
 *         type: int
 *         description: The event id of the assignment to delete.
 *         example: 240
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
 router.delete('/:personId/:eventId', assignmentController.delete);

module.exports = router;
