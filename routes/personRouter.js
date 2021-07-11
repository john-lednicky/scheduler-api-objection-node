var express = require('express');

var router = express.Router();

const personController = require('../controllers/personController.js'); 

router.get('/', personController.index);
router.get('/:id', personController.find);
router.post('/', personController.create);
router.put('/', personController.update);
router.delete('/:id', personController.delete);

module.exports = router;