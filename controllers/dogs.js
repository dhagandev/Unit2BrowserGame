const User = require('../models/user');
var request = require('request');
var server = require('../config/index');
var dogFun = require('../scripts/dogFunctions');
var apiScr = require('../scripts/apiConsumer');

module.exports = {
	getAllDogs,
	getOneDog
}

function getAllDogs(req, res, next) {
	dogFun.createNewMixDog("pup", true, "Affenpinscher");
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

function postDog(req, res, next) {

}