var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/users');

router.get('/', userCtrl.getAllUsers);
router.get('/:id', userCtrl.getOneUser);

module.exports = router;
