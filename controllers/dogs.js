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
	.then(dog => {
		res.render('genPawsMainPages/indDog', {dog});
	})
	.catch(error => {
		console.log(error);
	})
}

async function createPureDog(req, res, next) {
	let dog;

	try {
		let {dogName, dogGender, dogBreed} = req.body;
		dog = await dogFun.createNewPureDog(dogName, dogGender, dogBreed);
	}
	catch(error) {
		console.log(error);
	}

	dog.save()
	.then(dog => {
		res.redirect('/dogs/' + dog._id);
	})
	.catch(error => {
		console.log(error);
		res.redirect('/dogs');
	})
}

async function createMixDog(req, res, next) {
	let dog;

	try {
		let {dogName, dogGender, dogBreed} = req.body;
		dog = await dogFun.createNewMixDog(dogName, dogGender, dogBreed);
	}
	catch(error) {
		console.log(error);
	}

	dog.save()
	.then(dog => {
		res.redirect('/dogs/' + dog._id);
	})
	.catch(error => {
		console.log(error);
		res.redirect('/dogs');
	})
}