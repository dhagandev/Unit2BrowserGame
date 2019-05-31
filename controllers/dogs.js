var User = require('../models/user');
var Dog = require('../models/dog')
var dogFun = require('../scripts/dogFunctions');
var apiScr = require('../scripts/apiConsumer');
var breedFun = require('../scripts/breedFunctions');

const timeUpdateLimit = 5;
const timedStatDec = 5;

module.exports = {
	getAllDogs,
	getOneDog,
	createPureDog,
	createMixDog,
	createLitter,
	feedDog,
	waterDog,
	petDog,
	abandonDog,
	showBreeding,
	showLearn
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

	let modelUpdated = false;

	if (feedTime >= timeUpdateLimit) {
		modelUpdated = true;
		dog.lastFed = Date.now();
		dog.hunger -= timedStatDec;
		if (dog.hunger < 0) {
			dog.hunger = 0;
		}
	}
	if (waterTime >= timeUpdateLimit) {
		modelUpdated = true;
		dog.lastDrank = Date.now();
		dog.thirst -= timedStatDec;
		if (dog.thirst < 0) {
			dog.thirst = 0;
		}
	}
	if (petTime >= timeUpdateLimit) {
		modelUpdated = true;
		dog.lastPet = Date.now();
		dog.happiness -= timedStatDec;
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
		console.log("Dog gender?? =========")
		console.log(dogGender)
		dog = await dogFun.createNewPureDog(dogName, dogGender.toLowerCase(), dogBreed, req.user);
		req.user.dogs.push(dog._id);
		req.user.save();
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
		dog = await dogFun.createNewMixDog(dogName, dogGender.toLowerCase(), dogBreed, req.user);
		req.user.dogs.push(dog._id);
		req.user.save();
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
		dog.happiness += 10;
		if (dog.happiness > 100) {
			dog.happiness = 100;
		}
		dog.lastPet = Date.now();

		dog.save();

		res.redirect("/dogs/" + req.params.id);
	})
	.catch(err => console.log(err));
}

function abandonDog(req, res, next) {
	Dog.findByIdAndRemove(req.params.id)
	.then(dog => {
		res.redirect('/dogs');
	})
	.catch(err => console.log(err));
}

function showBreeding(req, res, next) {
	if (req.user) {
		req.user
		.populate('dogs')
		.execPopulate()
		.then(user => {
			let females = [];
			let males = [];
			for (let i = 0; i < user.dogs.length; i++) {
				if (user.dogs[i].gender === 'female') {
					females.push(user.dogs[i]);
				}
				else {
					males.push(user.dogs[i]);
				}
			}
			res.render('genPawsMainPages/breeding', {
				user: req.user,
				females,
				males
			});
		})
		.catch(err => console.log(err))
	}
}

async function showLearn(req, res, next) {
	let list = apiScr.getComboLists()[0];
	let allInfo = [];

	for (let i = 0; i < list.length; i++) {
		try {
			let dogInfo = await apiScr.dapiGetInfo(list[i]);
			if (dogInfo) {
				allInfo.push(dogInfo[0]);
			}
		}
		catch(error) {
			console.log(error)
		}
	}

	res.render('genPawsMainPages/learn', {
		allInfo,
		user: req.user
	});
}

async function createLitter(req, res, next) {
	let {femaleDog, maleDog} = req.body;

	try {
	femaleDog = await Dog.findById(femaleDog)
		.catch(err => console.log(err));
	maleDog = await Dog.findById(maleDog)
		.catch(err => console.log(err));
	}
	catch(err) {
		console.log(err);
	}

	let litter = [];

	try {
		if (femaleDog && maleDog) {
			let puppyCount = Math.floor(Math.random() * Math.floor(11));
			for (let i = 0; i <= 1; i++) {
				let pup = await breedFun.breedNewDog(femaleDog, maleDog, req.user, i);
				litter.push(pup);
				req.user.dogs.push(pup._id);
				req.user.save();
			}
		}
	}
	catch(err) {
		console.log(err);
		res.redirect('back');
	}

	litter.forEach(pup => {
		pup.save()
	})
			
	res.redirect('/users/' + req.user._id);
}