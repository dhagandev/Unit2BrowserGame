const User = require('../models/user');
const fetch = require("node-fetch");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var request = new XMLHttpRequest();
var server = require('../config/index');

module.exports = {
	index,
	getAllUsers,
	getOneUser
}

//partially replaced by api fetch calls
function index(req, res, next) {
	let modelQuery = req.query.name ? {name: new RegExp(req.query.name, 'i')} : {};
	let sortKey = req.query.sort || 'name';
	User.find(modelQuery)
	.sort(sortKey).exec(function(err, users) {
		if (err) {
			return next(err);
		}
		res.render('genPawsMainPages/users', {
			users, 
			user: req.user,
			name: req.query.name,
			sortKey
		});
	});
};

function getAllUsers(req, res, next) {
	fetch(server + '/api/users')
	.then(function(response) {
		res.render('genPawsMainPages/users', {
			response,
			user: req.user
		});
	})
	.catch(err => console.log(err));
}

function getOneUser(req, res, next) {
	fetch(server + '/api/users/5ce8264e58de633088015e18')
	.then(function(response) {
		res.render('genPawsMainPages/indUser', {
			response,
			user: req.user
		});
	})
	.catch(err => console.log(err));
}