var Dog = require('../models/dog');
var apiScr = require('../scripts/apiConsumer');

let apiBreedList = apiScr.getComboLists()[0];

module.exports = {
	createNewPureDog,
	createNewMixDog
}

async function createNewPureDog(name, gender, breed, user) {
	let newDog = new Dog();
	newDog.name = name;
	newDog.gender = gender.toLowerCase();
	newDog.mainBreed = breed;
	newDog.breedPercent = [{breed: breed, percentage: 100}];
	newDog.mom = null;
	newDog.dad = null;
	newDog.owner = user;

	newDog.genetics.brain = generateSetRandomHealthGene();
	newDog.geneticHealth.brain = healthFocusSet(newDog.genetics.brain);

	newDog.genetics.heart = generateSetRandomHealthGene();
	newDog.geneticHealth.heart = healthFocusSet(newDog.genetics.heart);

	newDog.genetics.lungs = generateSetRandomHealthGene();
	newDog.geneticHealth.lungs = healthFocusSet(newDog.genetics.lungs);

	newDog.genetics.joints = generateSetRandomHealthGene();
	newDog.geneticHealth.joints = healthFocusSet(newDog.genetics.joints);

	newDog.genetics.coat = generateSetRandomHealthGene();
	newDog.geneticHealth.coat = healthFocusSet(newDog.genetics.coat);
	
	try {
		newDog.img = await apiScr.getImage(breed);

	} catch (error) {
		console.log(error);
	}


	return newDog;
}

async function createNewMixDog(name, gender, breed, user) {
	let newDog = new Dog();
	newDog.name = name;
	newDog.gender = gender;
	newDog.mainBreed = breed;
	newDog.breedPercent = generateBreedPercent(breed);
	newDog.mom = null;
	newDog.dad = null;
	newDog.owner = user;

	newDog.genetics.brain = generateSetRandomHealthGene();
	newDog.geneticHealth.brain = healthFocusSet(newDog.genetics.brain);

	newDog.genetics.heart = generateSetRandomHealthGene();
	newDog.geneticHealth.heart = healthFocusSet(newDog.genetics.heart);

	newDog.genetics.lungs = generateSetRandomHealthGene();
	newDog.geneticHealth.lungs = healthFocusSet(newDog.genetics.lungs);

	newDog.genetics.joints = generateSetRandomHealthGene();
	newDog.geneticHealth.joints = healthFocusSet(newDog.genetics.joints);

	newDog.genetics.coat = generateSetRandomHealthGene();
	newDog.geneticHealth.coat = healthFocusSet(newDog.genetics.coat);
	
	try {
		newDog.img = await apiScr.getImage(breed);

	} catch (error) {
		console.log(error);
	}

	return newDog;
}

function generateBreedPercent(breed) {
	let whole = 100;
	let breedArr = [];
	let perVal = getRandomIntInc(51, 80);
	let breedPicker = getRandomIntInc(0, apiBreedList.length - 1);
	let newBreed = apiBreedList[breedPicker]; 
	breedArr.push({breed: breed, percentage: perVal});
	whole -= perVal;

	while (whole != 0) {
		if (whole <= 5) {
			breedArr.push({breed: newBreed, percentage: whole});
			whole = 0;
		}
		else {
			perVal = getRandomIntInc(5, whole);
			breedArr.push({breed: newBreed, percentage: perVal});
			breedPicker = getRandomIntInc(0, apiBreedList.length - 1);
			newBreed = apiBreedList[breedPicker];
			whole -= perVal;
		}
	}
	breedArr = combineDupBreed(breedArr);
	breedArr = sortBreedPercentage(breedArr);
	breedArr = removeTooSmallPercentage(breedArr);
	
	return breedArr;
}

function combineDupBreed(arr) {
	let nameFound = [];
	let sumArr = [];

	for (let i = 0; i < arr.length; i++) {
		let name = arr[i].breed;
		if (nameFound.includes(name)) {
			nameFound.push("Duplicate");
			let idx = nameFound.indexOf(name);
			arr[idx].percentage += arr[i].percentage;
		}
		else {
			nameFound.push(name);
			sumArr.push(arr[i]);
		}
	}
	return sumArr;
}

function sortBreedPercentage(arr) {
	let sorted = arr.sort(
		function(ele1, ele2) {
			return ele2.percentage - ele1.percentage
		}
	);

	return sorted;
}

function removeTooSmallPercentage(arr) {
	if (arr[arr.length - 1].percentage < 3) {
		arr[0].percentage += arr[arr.length - 1].percentage;
		arr.pop();
	}

	return arr;
}

function generateSetRandomHealthGene() {
	let healthVal = [];
	for (let i = 0; i < 5; i++) {
		healthVal.push(generatePairRandomHealthGene());
	}
	return healthVal;
}

function generatePairRandomHealthGene() {
	let val1 = generateIndividualRandomHealthGene();
	let val2 = generateIndividualRandomHealthGene();
	let healthVal = val1 + val2;
	if (val1 == "h") {
		healthVal = val2 + val1;
	}
	return healthVal;
}

function generateIndividualRandomHealthGene() {
	let randHealthPoint = Math.random();
	let healthVal = "h";
	if (randHealthPoint > .5) {
		healthVal = "H";
	}
	return healthVal;
}

function getRandomIntInc(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function healthFocusSet(geneticArr) {
	let hCount = 0;

	for (let i = 0; i < geneticArr.length; i++) {
		let word = geneticArr[i];
		if (word[0] === 'h') {
			hCount++;
		}
		if (word[1] === 'h') {
			hCount++;
		}
	}

	if (hCount == 0) {
		return "Perfect";
	}
	if (hCount >= 1 && hCount <= 2) {
		return "Good";
	}
	if (hCount >= 3 && hCount <= 4) {
		return "Fair";
	}
	return "Poor";
}