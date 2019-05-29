var express = require('express');
var router = express.Router();
var passport = require('passport');
var indexCtrl = require('../controllers/index');

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/home');
});

router.get('/home', indexCtrl.getHome);

// Google OAuth login route
router.get('/auth/google', passport.authenticate(
  'google',
  { scope: ['profile', 'email'] }
));

// Google OAuth callback route
router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect : 'back',
    failureRedirect : '/home'
  }
));

// OAuth logout route
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
