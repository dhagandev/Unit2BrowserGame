var User = require('../models/user');
var Dog = require('../models/dog')
var dogFun = require('../scripts/dogFunctions');
var apiScr = require('../scripts/apiConsumer');

module.exports = {
	getAllDogs,
	getOneDog,
	createPureDog,
	createMixDog
}

function getAllDogs(req, res, next) {
	Dog.find({})
	.then(dogs => {
		let list = apiScr.getComboLists();
		res.render('genPawsMainPages/dogs', {dogs, list});
	})
	.catch(error => {
		console.log(error);
	})
}

function getOneDog(req, res, next) {
	Dog.findById(req.params.id)
	.then(dogs => {
		res.render('genPawsMainPages/indDog', {dogs});
	})
	.catch(error => {
		console.log(error);
	})
}

function createPureDog(req, res, next) {
	let {dogName, dogGender, dogBreed} = req.body;
	let dog = dogFun.createNewPureDog(dogName, dogGender, dogBreed);
	dog.save()
	.then(dog => {
		res.redirect('/dogs/' + dog._id);
	})
	.catch(error => {
		console.log(error);
		res.redirect('/dogs');
	})
}

function createMixDog(req, res, next) {
	let {dogName, dogGender, dogBreed} = req.body;
	let dog = dogFun.createNewMixDog(dogName, dogGender, dogBreed);
	dog.save()
	.then(dog => {
		res.redirect('/dogs/' + dog._id);
	})
	.catch(error => {
		console.log(error);
		res.redirect('/dogs');
	})
}