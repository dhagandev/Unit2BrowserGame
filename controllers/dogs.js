const User = require('../models/user');
var request = require('request');
var server = require('../config/index');
var dogFun = require('../scripts/dogFunctions');
var apiScr = require('../scripts/apiConsumer');

module.exports = {
	getAllDogs,
	getOneDog,
	createPureDog,
	createMixDog
}

function getAllDogs(req, res, next) {
	dogFun.createNewMixDog("pup", "female", "Affenpinscher"); //test
	request(server + '/api/dogs', function(err, response, body) {
		if (err) {
			console.log(err);
		}

		let list = apiScr.getComboLists();
		res.render('genPawsMainPages/dogs', {response, list});
	});
}

function getOneDog(req, res, next) {
	request(server + '/api/dogs/' + req.params.id, function(err, response, body) {
		if (err) {
			console.log(err);
		}
		res.render('genPawsMainPages/indDog', {response});
	});
}

function createPureDog(req, res, next) {
	let dog = dogFun.createNewPureDog(req.body.name, req.body.gender, req.body.breed);
	dog.save()
	.then( dog => {
		// res.redirect('/dogs');
		// res.render('genPawsMainPages/dogs', {dog})
	})
	.catch( error => {
		console.log(error);
	});
}

function createMixDog(req, res, next) {
	console.log("MIX DOG")
	console.log(req.body);
	let dog = dogFun.createNewMixDog(req.body.dogName, req.body.dogGender, req.body.dogBreed);
	console.log("DOG CREATED!: ");
	console.log(dog)
	request.post(server + '/api/dogs', dog, (error, postRes, body) => {
		console.log("Trying to post to db");
		if (error) {
			console.log(error);
			console.log("\n");
			console.log(server);
			res.render(server + '/dogs');
			return;
		}
		console.log(body);
		body.save()
		.then(result => console.log(result + "========="))
		.catch(error => console.log(error + "-----------"));
		res.render(server + '/dogs/' + dog._id);
	});
}