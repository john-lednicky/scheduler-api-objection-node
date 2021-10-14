const express = require('express');
const timeZoneService = require('../services/timeZoneService')();

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Time Zones
 *   description: Method to fetch supported time zones and their descirptions
 */

/**
 * @swagger
 *
 * /timeZones:
 *   get:
 *     summary: Get all time zones
 *     description: Retrieves a list of all time zones
 *     tags: [Time Zones]
 *     responses:
 *       200:
 *         description: A list of time zones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TimeZone'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorMessage'
 */
router.get('/', async (req, res, next) => {
  timeZoneService.getAll()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
