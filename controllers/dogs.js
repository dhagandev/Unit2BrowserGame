var User = require('../models/user');
var Dog = require('../models/dog')
var dogFun = require('../scripts/dogFunctions');
var apiScr = require('../scripts/apiConsumer');

module.exports = {
	getAllDogs,
	getOneDog,
	createPureDog,
	createMixDog,
	feedDog,
	waterDog,
	petDog,
	abandonDog
}

function getAllDogs(req, res, next) {
	Dog.find({})
	.then(dogs => {
		let list = apiScr.getComboLists();
		res.render('genPawsMainPages/dogs', {
			dogs, 
			list,
			user: req.user
		});
	})
	.catch(error => {
		console.log(error);
	})
}

function getOneDog(req, res, next) {
	Dog.findById(req.params.id)
	.then(dog => {
		timedUpdate(dog);
		res.render('genPawsMainPages/indDog', {
			dog,
			user: req.user
		});
	})
	.catch(error => {
		console.log(error);
	})
}

function timedUpdate(dog) {
	let feedTime = getTimedDiff(dog.lastFed);
	let waterTime = getTimedDiff(dog.lastDrank);
	let petTime = getTimedDiff(dog.lastPet);

	console.log("Times are: " + feedTime + " " + waterTime + " " + petTime);

	let modelUpdated = false;

	if (feedTime >= 5) {
		modelUpdated = true;
		dog.lastFed = Date.now();
		dog.hunger -= 5;
		if (dog.hunger < 0) {
			dog.hunger = 0;
		}
	}
	if (waterTime >= 5) {
		modelUpdated = true;
		dog.lastDrank = Date.now();
		dog.thirst -= 5;
		if (dog.thirst < 0) {
			dog.thirst = 0;
		}
	}
	if (petTime >= 5) {
		modelUpdated = true;
		dog.lastPet = Date.now();
		dog.happiness -= 5;
		if (dog.happiness < 0) {
			dog.happiness = 0;
		}
	}

	if (modelUpdated) {
		dog.save();
	}
}

function getTimedDiff(statusDate) {
	let currentDate = Date.now();
	let diffMs = (currentDate - statusDate); // milliseconds between now & last fed
	let diffDays = Math.floor(diffMs / 86400000); // days
	let diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
	let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

	return diffMins;
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

function feedDog(req, res, next) {
	Dog.findById(req.params.id)
	.then(dog => {
		dog.hunger += 10;
		if (dog.hunger > 100) {
			dog.hunger = 100;
		}
		dog.lastFed = Date.now();

		dog.save();

		res.redirect("/dogs/" + req.params.id);
	})
	.catch(err => console.log(err));
}

function waterDog(req, res, next) {
	Dog.findById(req.params.id)
	.then(dog => {
		dog.thirst += 10;
		if (dog.thirst > 100) {
			dog.thirst = 100;
		}
		dog.lastDrank = Date.now();

		dog.save();

		res.redirect("/dogs/" + req.params.id);
	})
	.catch(err => console.log(err));

}

function petDog(req, res, next) {
	Dog.findById(req.params.id)
	.then(dog => {
		console.log(dog);
		dog.happiness += 10;
		if (dog.happiness > 100) {
			dog.happiness = 100;
		}
		dog.lastPet = Date.now();
		console.log(dog);

		dog.save();

		res.redirect("/dogs/" + req.params.id);
	})
	.catch(err => console.log(err));
}

function abandonDog(req, res, next) {
	Dog.findByIdAndRemove(req.params.id)
	.then(dog => {
		console.log(dog);
		res.redirect('/dogs');
	})
	.catch(err => console.log(err));
}