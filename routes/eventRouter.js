var express = require('express');
var router = express.Router();

const eventController = require('../controllers/eventController.js'); 

router.get('/', eventController.index);
router.get('/:id', eventController.find);
router.post('/', eventController.create);
router.put('/', eventController.update);
router.delete('/:id', eventController.delete);

module.exports = router;