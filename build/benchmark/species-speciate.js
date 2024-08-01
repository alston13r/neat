function calcFitness(brain) {
    brain.fitness = 0;
    for (const value of TrainingValues.XOR.random) {
        const actual = brain.think(value.inputs);
        const errors = value.outputs.map((expected, i) => lerp(Math.abs(expected - actual[i]), 0, 2, 1, 0));
        errors.forEach(error => brain.fitness += error);
    }
}
function oneTest() {
    const results = new Array(1000);
    const stressPop = new Population(1000, 2, 0, 1);
    for (let i = 0; i < 1000; i++) {
        console.log(i);
        stressPop.nextGeneration();
        stressPop.members.forEach(calcFitness);
        stressPop.updateFittestEver();
        const start = performance.now();
        stressPop.speciate();
        const end = performance.now();
        results[i] = end - start;
    }
    const resultsSum = results.reduce((sum, curr) => sum + curr);
    const resultsAvg = resultsSum / 1000;
    const resultsDeviation = Math.sqrt(results.reduce((sum, curr) => sum + (curr - resultsAvg) ** 2) / 1000);
    console.log('Total time: ' + resultsSum);
    console.log('Average time: ' + resultsAvg);
    console.log('Standard deviation: ' + resultsDeviation);
}
function fullTest() {
    const totalResults = [];
    for (let iteration = 0; iteration < 16; iteration++) {
        const results = new Array(1000);
        const stressPop = new Population(1000, 2, 0, 1);
        for (let i = 0; i < 1000; i++) {
            console.log(iteration + ': ' + i);
            stressPop.nextGeneration();
            stressPop.members.forEach(calcFitness);
            stressPop.updateFittestEver();
            const start = performance.now();
            stressPop.speciate();
            const end = performance.now();
            results[i] = end - start;
        }
        const resultsSum = results.reduce((sum, curr) => sum + curr);
        const resultsAvg = resultsSum / 1000;
        const resultsDeviation = Math.sqrt(results.reduce((sum, curr) => sum + (curr - resultsAvg) ** 2) / 1000);
        const index = iteration * 3;
        totalResults[index] = resultsSum;
        totalResults[index + 1] = resultsAvg;
        totalResults[index + 2] = resultsDeviation;
    }
    return totalResults;
}
//# sourceMappingURL=species-speciate.js.map