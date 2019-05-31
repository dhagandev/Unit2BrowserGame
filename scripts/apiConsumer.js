var request = require('request');
var axios = require('axios');

const dceoHeader = {}

const dapiHeader = {
	'User-Agent': process.env.DAPI_ID,
	'Authorization': process.env.DAPI_KEY
}

//Dog CEO API: DCEO, use this for images
//The Dog API: DAPI, use this list for displaying options and breed info

module.exports = {
	getDCEOFullBreedList,
	getDAPIFullBreedList,
	makeComboList,
	getComboLists,
	getImage,
	dapiGetInfo
}

let dceoList = [];
let dapiList = [];
let comboListDCEO = [];
let comboListDAPI = [];

function getDCEOFullBreedList() {
	let opt = {
		url: 'https://dog.ceo/api/breeds/list/all',
		headers: dceoHeader
	}
	request(opt, function(err, response, body) {
		if (err) {
			return err;
		}
		let apiData = JSON.parse(body).message;
		Object.keys(apiData).forEach(function(key,index) {
			let breed = key;
			if(apiData[key].length > 0) {
				for (let i = 0; i < apiData[key].length; i++) {
					breed = breed + "-" + apiData[key][i];
					dceoList.push(breed);
					breed = key;
				}
			}
			else {
				dceoList.push(breed);
			}
		});
	});
}

function getDAPIFullBreedList() {
	let opt = {
		url: 'https://api.thedogapi.com/v1/breeds',
		headers: dapiHeader
	}
	request(opt, function(err, response, body) {
		if (err) {
			return err;
		}
		let apiData = JSON.parse(body);

		apiData.forEach(dog => {
			dapiList.push(dog.name);
		})
	})
}

function makeComboList() {
	getDCEOFullBreedList();
	getDAPIFullBreedList();

	for(let i = 0; i < dceoList.length; i++) {
		let ele1 = dceoList[i];
		for(let j = 0; j < dapiList.length; j++) {
			let ele2 = dapiList[j];
			let dogApiEle1 = ele1.replace(/\s+/g, '-').toLowerCase();
			let dogApiEle2 = ele2.replace(/\s+/g, '-').toLowerCase();
			if(dogApiEle1 === dogApiEle2) {
				comboListDCEO.push(ele1);
				comboListDAPI.push(ele2);
				continue;
			}
			// else {
			// 	console.log(ele1);
			// 	console.log(ele2);
			// 	console.log(" ");
			// }
		}
	}
}

//Not a full combo list but good enough to temp work.
function getComboLists() {
	if(comboListDAPI.length === 0 && comboListDCEO.length === 0) {
		makeComboList();
	}

	return [comboListDAPI, comboListDCEO];
}

async function getImage(breed) {
	console.log("===== DEBUG GET IMAGE. FOR LIKE THE MILLIONTH TIME ====")
	if (comboListDAPI.length === 0 || comboListDCEO.length === 0) {
		getComboLists();
	}

	console.log(comboListDAPI);
	let listIdx = comboListDAPI.indexOf(breed);
	console.log(listIdx)
	let dceoBreed = comboListDCEO[listIdx];
	console.log(dceoBreed)

	let opt = {
		url: 'https://dog.ceo/api/breed/' + dceoBreed + '/images/random',
		headers: dceoHeader
	}

	console.log(opt.url);

	try {
		const image = await axios.get(opt.url);
		return image.data.message;
	}
	catch(error) {
		console.log(error);
	}
}

async function dapiGetInfo(breed) {
	let opt = {
		url: 'https://api.thedogapi.com/v1/breeds/search',
		headers: dapiHeader,
		params: {
			q: breed
		}
	}

	try {
		const dapiResult = await axios.get(opt.url, opt);
		return dapiResult.data;
	}
	catch(error) {
		console.log(error);
	}
}