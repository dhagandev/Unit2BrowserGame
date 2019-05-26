var User = require('../../models/user');
var Dog = require('../../models/dog')

module.exports = {
	getAllUsers,
	getOneUser,
	createUser,
	updateUser,
	deleteUser,
	getAllDogs,
	getOneDog,
	createDog,
	updateDog,
	deleteDog
}

function getAllUsers(req, res) {
	User.find({})
	.then(function(users) {
		res.status(200).json(users);
	});
}

function getOneUser(req, res) {
	User.findById(req.params.id)
	.then(function(user) {
		res.status(200).json(user);
	});
}

function createUser(req, res) {
	User.create(req.body)
	.then(function(user) {
		res.status(201).json(user);
	});
}

function updateUser(req, res) {
	User.findByIdandUpdate(req.params.id, req.body, {new: true})
	.then(function(user) {
		res.status(200).json(user);
	});
}

function deleteUser(req, res) {
	User.findByIdAndDelete(req.params.id)
	.then(function(user) {
		res.status(200).json(user);
	});
}

function getAllDogs(req, res) {
	Dog.find({})
	.then(function(dogs) {
		res.status(200).json(dogs);
	});
}

function getOneDog(req, res) {
	Dog.findById(req.params.id)
	.then(function(dog) {
		res.status(200).json(dog);
	});
}

function createDog(req, res) {
	Dog.create(req.body)
	.then(function(dog) {
		res.status(201).json(dog);
	});
}

function updateDog(req, res) {
	Dog.findByIdandUpdate(req.params.id, req.body, {new: true})
	.then(function(dog) {
		res.status(200).json(dog);
	});
}

function deleteDog(req, res) {
	Dog.findByIdAndDelete(req.params.id)
	.then(function(dog) {
		res.status(200).json(dog);
	});
}