let genIndex = 0;
let fitPop;
function nextGeneration() {
	console.log(`Generation ${++genIndex}`);
	selectPop();
	calculateFitness();
	for (let i=0;i<TOTAL;i++) {
		let parents = pickTwo();
		birds[i] = crossover(parents[0],parents[1]);
	}
	savedBirds = [];
}

function selectPop() {
	fitPop = savedBirds.splice(-20,20);
}

function calculateFitness() {
	let sum = 0;
	for (let bird of fitPop) {
		sum += Math.pow(bird.score,2);
	}
	for (let bird of fitPop) {
		bird.fitness = Math.pow(bird.score,2)/sum;
	}
}

function pickOne() {
	let index = 0;
	let r = random(1);
	while(r > 0) {
		r = r - fitPop[index].fitness;
		index++;
	}
	index--;
	let bird = fitPop[index];
	return bird;
}

function pickTwo() {
	let parentOne = pickOne();
	let parentTwo = pickOne();
	return [parentOne, parentTwo];
}

function crossover(a,b) {
	let child = new Bird(a.brain);
	let weights = ['weights_ih','weights_ho','bias_h','bias_o'];
	for (let weightName of weights) {
		a.brain[weightName].map((e,i,j) => {
			return random(e,b.brain[weightName].data[i][j]);
		});
	}
	child.mutate();
	return child;
}

/*
function pickOne() {
	let index = 0;
	let r = random(1);
	while(r > 0) {
		r = r - savedBirds[index].fitness;
		index++;
	}
	index--;
	let bird = savedBirds[index];
	let child = new Bird(bird.brain);
	child.mutate();
	return child;
}

function nextGeneration() {
	console.log('Next generation');
	calculateFitness();
	for (let i=0;i<TOTAL;i++) {
		birds[i] = pickOne();
	}
	savedBirds = [];
}
*/