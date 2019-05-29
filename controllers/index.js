const User = require('../models/user');

module.exports = {
	getHome
}

function getHome(req, res, next) {
	res.render('genPawsMainPages/index', {
		user: req.user
	});
}