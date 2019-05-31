var mongoose = require('mongoose');
var Dog = require('../models/dog');
var apiScr = require('../scripts/apiConsumer');
var dogFun = require('../scripts/dogFunctions');

module.exports = {
	breedNewDog
}

async function breedNewDog(female, male, user, pupIdx) {
	let mixedGenes = {
		brain: mixSingleSet(female.genetics.brain, male.genetics.brain),
		heart: mixSingleSet(female.genetics.heart, male.genetics.heart),
		lungs: mixSingleSet(female.genetics.lungs, male.genetics.lungs),
		joints: mixSingleSet(female.genetics.joints, male.genetics.joints),
		coat: mixSingleSet(female.genetics.coat, male.genetics.coat)
	};

	let pupGender = Math.random();
	if (pupGender < .5) {
		pupGender = 'Female';
	}
	else {
		pupGender = 'Male';
	}

	let breedPercent = determineDogBreed(female.breedPercent.toObject(), male.breedPercent.toObject());
	
	let newDog = new Dog();
	newDog.name = female.name + " x " + male.name + " Puppy " + pupIdx;
	newDog.gender = pupGender;
	newDog.mainBreed = breedPercent[0].breed;
	newDog.breedPercent = breedPercent;
	newDog.mom = female._id;
	newDog.dad = male._id;
	newDog.owner = user;
	newDog.genetics = mixedGenes;
	newDog.geneticHealth.brain = dogFun.healthFocusSet(newDog.genetics.brain);
	newDog.geneticHealth.heart = dogFun.healthFocusSet(newDog.genetics.heart);
	newDog.geneticHealth.lungs = dogFun.healthFocusSet(newDog.genetics.lungs);
	newDog.geneticHealth.joints = dogFun.healthFocusSet(newDog.genetics.joints);
	newDog.geneticHealth.coat = dogFun.healthFocusSet(newDog.genetics.coat);

	try {
		console.log("MAIN BREED DEBUGGER =========")
		newDog.img = await apiScr.getImage(breedPercent[0].breed);

	} catch (error) {
		console.log(error);
	}

	return newDog;
}

function determineDogBreed(dbp1, dbp2) {
	let dog1HalfPercent = halfPercent(dbp1);
	let dog2HalfPercent = halfPercent(dbp2);

	if (dog1HalfPercent.length < dog2HalfPercent.length) {
		let temp = dog1HalfPercent;
		dog1HalfPercent = dog2HalfPercent;
		dog2HalfPercent = temp;
	}

	let pupPercent = [];
	let dog1List = breedList(dog1HalfPercent);
	let dog2List = breedList(dog2HalfPercent);

	console.log("list 1 is =======================")
	console.log(dog1List)
	console.log("list 2 ==========================")
	console.log(dog2List)

	for (let i = 0; i < dog1List.length; i++) {
		if(dog2List.includes(dog1List[i])) {
			console.log("dog list 2 has the dog")
			let idx = dog2List.indexOf(dog1List[i]);
			console.log("dog is at this index " + idx)
			pupPercent.push([dog1List[i], dog1HalfPercent[i].percentage + dog2HalfPercent[idx].percentage]);
			console.log(pupPercent[pupPercent.length - 1])
		}
		else {
			pupPercent.push(dog1HalfPercent[i]);
		}
	}

	for (let i = 0; i < dog2List.length; i++) {
		if (!dog1List.includes(dog2List[i])) {
			pupPercent.push(dog2HalfPercent[i]);
		}
	}

	console.log("what is pup percent")
	console.log(pupPercent)

	pupPercent = sortBreedPercentage(pupPercent);

	return pupPercent;
}

function sortBreedPercentage(pupPercent) {
	let sorted = pupPercent.sort((ele1, ele2) => {
		if (ele1.percentage < ele2.percentage) {
			return -1;
		}
		return 1;
	});

	sorted.forEach(breedPercent => {
		console.log("Debugging the delete of data too small")
		console.log(breedPercent)
		if (breedPercent.percentage < 1) {
			sorted[sorted.length - 1].percentage += breedPercent.percentage;
			let index = sorted.indexOf(breedPercent);
			sorted.splice(index, 1);
		}
	})

	return sorted.reverse();
}

function breedList(dogList) {
	let list = [];
	for (let i = 0; i < dogList.length; i++) {
		list.push(dogList[i].breed);
	}
	return list;
}

function halfPercent(dogPercent) {
	let newPercent = [];
	for (let i = 0; i < dogPercent.length; i++) {
		let breedPer = dogPercent[i];

		let halfBreed = {
			_id: new mongoose.mongo.ObjectId(),
			breed: dogPercent[i].breed,
			percentage: dogPercent[i].percentage/2
		}

		newPercent.push(halfBreed);
	}

	console.log("new percent is ");
	console.log(newPercent);
	return newPercent;	
}

function mixSingleSet(geneSet1, geneSet2) {
	let mixedSet = [];
	for (let i = 0; i < geneSet1.length; i++) {
		let indGene1 = geneSet1[i];
		let indGene2 = geneSet2[i];
		let mixedGene = mixIndividGene(indGene1, indGene2);

		mixedSet.push(mixedGene);
	}

	return mixedSet;
}

function mixIndividGene(indGene1, indGene2) {
	indGene1 = indGene1.split('');
	indGene2 = indGene2.split('');

	let possible = [indGene1[0] + indGene2[0], indGene1[0] + indGene2[1], indGene1[1] + indGene2[0], indGene1[1] + indGene2[1]];

	for (let i = 0; i < possible.length; i++) {
		if (possible[i][0] == "h") {
			possible[i] = possible[i][1] + possible[i][0];
		}
	}

	let chosen = Math.floor(Math.random() * Math.floor(4));
	return possible[chosen];
}