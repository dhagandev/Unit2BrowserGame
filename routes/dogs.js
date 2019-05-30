var express = require('express');
var router = express.Router();
var dogCtrl = require('../controllers/dogs');

router.get('/', dogCtrl.getAllDogs);
router.get('/breed', dogCtrl.showBreeding);
router.get('/learn', dogCtrl.showLearn);
router.get('/:id', dogCtrl.getOneDog);

router.post('/pure', isLoggedIn, dogCtrl.createPureDog);
router.post('/mix', isLoggedIn, dogCtrl.createMixDog);
router.post('/breed', isLoggedIn, dogCtrl.createLitter);

router.put('/:id/feed', isLoggedIn, dogCtrl.feedDog);
router.put('/:id/water', isLoggedIn, dogCtrl.waterDog);
router.put('/:id/pet', isLoggedIn, dogCtrl.petDog);

router.delete('/:id', isLoggedIn, dogCtrl.abandonDog);

function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) return next();
  res.redirect('/auth/google');
}

module.exports = router;