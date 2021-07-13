const express = require('express');

const router = express.Router();

const eventTypeController = require('../controllers/eventTypeController.js');

router.get('/', eventTypeController.index);
router.get('/:id', eventTypeController.find);
router.post('/', eventTypeController.create);
router.put('/', eventTypeController.update);
router.delete('/:id', eventTypeController.delete);

module.exports = router;
