var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/users');

/* GET users listing. */
router.get('/', userCtrl.index);

function isLoggedIn(req, res, next) {
  if ( req.isAuthenticated() ) return next();
  res.redirect('/auth/google');
}

module.exports = router;
