const User = require('../models/user');

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
	User.find({})
	.then(users => {
		res.render('genPawsMainPages/users', {
			users,
			user: req.user
		});
	})
	.catch(error => {
		console.log(error);
	})
}

function getOneUser(req, res, next) {
	User.findById(req.params.id)
	.then(genUser => {
		genUser
		.populate('dogs')
		.execPopulate()
		.then(genUser => {
			res.render('genPawsMainPages/indUser', {
				genUser,
				user: req.user
			});
		})
		.catch(error => {
			console.log(error);
		})
	})
	.catch(error => {
		console.log(error);
	})
}