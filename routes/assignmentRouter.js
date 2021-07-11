var express = require('express');
var router = express.Router();

const assignmentController = require('../controllers/assignmentController.js'); 

router.get('/', assignmentController.index);
router.get('/:personId/:eventId', assignmentController.find);
router.post('/', assignmentController.create);
router.delete('/:personId/:eventId', assignmentController.delete);

module.exports = router;