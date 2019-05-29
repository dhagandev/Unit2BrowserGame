var express = require('express');
var router = express.Router();
var dogCtrl = require('../controllers/dogs');

router.get('/', dogCtrl.getAllDogs);
router.get('/:id', dogCtrl.getOneDog);

router.post('/pure', dogCtrl.createPureDog);
router.post('/mix', dogCtrl.createMixDog);

router.put('/:id/feed', dogCtrl.feedDog);
router.put('/:id/water', dogCtrl.waterDog);
router.put('/:id/pet', dogCtrl.petDog);

router.delete('/:id', dogCtrl.abandonDog);

module.exports = router;