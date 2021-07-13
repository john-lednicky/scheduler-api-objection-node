const express = require('express');

const router = express.Router();

const personController = require('../controllers/personController.js');

/**
 * @swagger
 *
 * /persons:
 *   get:
 *     summary: Get all
 *     description: Retrieves a list of all persons
 *     produces:
 *       - application/json
 */
router.get('/', personController.index);

/**
 * @swagger
 *
 * /person/{id}:
 *   get:
 *     summary: Get one
 *     description: Retrieves a specific person.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: int
 *         description: The id of the person to retrieve.
 *         example: 0
 *     produces:
 *       - application/json
 */
router.get('/:id', personController.find);

/**
 * @swagger
 *
 * /person:
 *   post:
 *     summary: Create
 *     description: Creates a new person.
 *     requestBody:
 *       required: true
 *     produces:
 *       - application/json
 */
router.post('/', personController.create);

/**
 * @swagger
 *
 * /person:
 *   put:
 *     summary: Update
 *     description: Updates an existing person.
 *     requestBody:
 *       required: true
 *     produces:
 *       - application/json
 */
router.put('/', personController.update);

/**
 * @swagger
 *
 * /person/delete/{id}:
 *   get:
 *     summary: Delete one
 *     description: Deletes a specific person.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: int
 *         description: The id of the person to delete.
 *         example: 0
 *     produces:
 *       - application/json
 */
router.delete('/:id', personController.delete);

module.exports = router;
