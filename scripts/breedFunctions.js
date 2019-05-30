var Dog = require('../models/dog');

module.exports = {
	breedNewDog
}

function breedNewDog(female, male) {
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

	let breedPercent = determineDogBreed(JSON.stringify(female.breedPercent), JSON.stringify(male.breedPercent));
	// console.log(breedPercent);
}

function determineDogBreed(dbp1, dbp2) {
	console.log("determineDogBreed")

	let dog1HalfPercent = halfPercent(dbp1);
	let dog2HalfPercent = halfPercent(dbp2);

	console.log("\n dbp1")
	console.log(dbp1)
	console.log("\n")
	console.log(dog1HalfPercent)
	console.log("\n dbp2")
	console.log(dbp2)
	console.log("\n")
	console.log(dog2HalfPercent)
	console.log("\n")

	if (dog1HalfPercent.length < dog2HalfPercent.length) {
		let temp = dog1HalfPercent;
		dog1HalfPercent = dog2HalfPercent;
		dog2HalfPercent = temp;
	}

	let pupPercent = [];
	let dog1List = breedList(dog1HalfPercent);
	let dog2List = breedList(dog2HalfPercent);

	for (let i = 0; i < dog1List.length; i++) {
		if(dog2List.includes(dog1List[i])) {
			let idx = dog2List.indexOf(dog1List[i]);
			pupPercent.push([dog1List[i], dog1HalfPercent[i][1] + dog2HalfPercent[idx][1]]);
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

	pupPercent = sortBreedPercentage(pupPercent);

	return pupPercent;
}

function sortBreedPercentage(pupPercent) {
	console.log("sortBreedPercentage")
	let sorted = [];
	let numVals = [];
	for (let i = 0; i < pupPercent.length; i++) {
		numVals.push(pupPercent[i][1]);
	}
	let sortedNumVals = numVals.sort();
	for (let i = 0; i < sortedNumVals.length; i++) {
		let idx = numVals.indexOf(sortedNumVals[i])
		sorted.push(pupPercent[idx]);
	}
	return sorted.reverse();
}

function breedList(dogList) {
	console.log("breedList")
	let list = [];
	for (let i = 0; i < dogList.length; i++) {
		list.push(dogList[i].breed);
	}
	return list;
}

function halfPercent(dogPercent) {
	console.log("halfPercent")
	console.log(dogPercent);
	let newPercent = [];
	for (let i = 0; i < dogPercent.length; i++) {
		let breedPer = dogPercent[i];

		console.log("breed per: ==== " + breedPer)

		newPercent.push({breed: dogPercent[i][0], percentage: dogPercent[i][1]/2});
	}
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