var express = require('express');
var router = express.Router();
var apiCtrl = require('../controllers/api/api');

router.get('/users', apiCtrl.getAllUsers);
router.get('/users/:id', apiCtrl.getOneUser);
router.post('/users', apiCtrl.createUser);
router.put('/users/:id', apiCtrl.updateUser);
router.delete('/users/:id', apiCtrl.deleteUser);

router.get('/dogs', apiCtrl.getAllDogs);
router.get('/dogs/:id', apiCtrl.getOneDog);
router.post('/dogs', apiCtrl.createDog);
router.put('/dogs/:id', apiCtrl.updateDog);
router.delete('/dogs/:id', apiCtrl.deleteDog);

module.exports = router;
