var express = require('express');
var router = express.Router();
var dogCtrl = require('../controllers/dogs');

router.get('/', dogCtrl.getAllDogs);
router.get('/:id', dogCtrl.getOneDog);

router.post('/pure', dogCtrl.createPureDog);
router.post('/mix', dogCtrl.createMixDog);

module.exports = router;