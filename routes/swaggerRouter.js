const express = require('express');

const router = express.Router();
const swaggerService = require('../services/swaggerService');

/**
 * @swagger
 * tags:
 *   name: Swagger
 *   description: Methods to retrieve swagger doc
 */

/**
 * @swagger
 *
 * /api-doc:
 *   get:
 *     summary: Get the swagger doc
 *     description: Retrieves the swagger doc in JSON format
 *     tags: [Swagger]
 *     responses:
 *       200:
 *         description: The swagger doc
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorMessageSchema'
 */
router.get('/', async (req, res) => { res.send(swaggerService.getDoc()); });

/**
 * @swagger
 *
 * /api-doc-ui:
 *   get:
 *     summary: Display the swagger ui
 *     description: Displays the swagger ui
 *     tags: [Swagger]
 *     responses:
 *       200:
 *         description: The swagger ui
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/errorMessageSchema'
 */

module.exports = router;
