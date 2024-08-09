const xorGraphics = new Graphics(document.getElementById('mainCanvas')).setSize(800, 550);
const xorTrainingValues = TrainingValues.XOR;
const xorPopSize = 1000;
const xorPopulation = new Population(xorPopSize, 2, 0, 1);
const xorDesiredFitness = 3.95;
const xorMaxGenerations = 1000;
Brain.AllowRecurrent = false;
let xorSolution;
function calculateFitness(brain) {
    brain.fitness = 0;
    for (const value of xorTrainingValues.random()) {
        const actual = brain.think(value.inputs);
        const errors = value.outputs.map((expected, i) => lerp(Math.abs(expected - actual[i]), 0, 2, 1, 0));
        errors.forEach(error => brain.fitness += error);
    }
}
function xorLoop() {
    xorPopulation.nextGeneration();
    xorPopulation.members.forEach(calculateFitness);
    xorPopulation.updateFittestEver();
    xorPopulation.speciate();
    xorGraphics.bg();
    xorPopulation.draw(xorGraphics);
    xorPopulation.fittestEver.draw(xorGraphics, 320, 550, 480);
    if (xorPopulation.fittestEver.fitness >= xorDesiredFitness) {
        xorSolution = xorPopulation.fittestEver;
        console.log('Solution found, storing to var<xorSolution>', xorSolution.fitness);
        xorTrainingValues.values.forEach(io => {
            console.log('[' + io.inputs.join(', ') + '] -> ['
                + xorSolution.think(io.inputs).join(', ') + ']');
        });
        return;
    }
    if (xorPopulation.generationCounter >= xorMaxGenerations) {
        xorSolution = xorPopulation.fittestEver;
        console.log('Solution not found, storing best ever to var<xorSolution>', xorSolution.fitness);
        xorTrainingValues.values.forEach(io => {
            console.log('[' + io.inputs.join(', ') + '] -> ['
                + xorSolution.think(io.inputs).join(', ') + ']');
        });
        return;
    }
    window.requestAnimationFrame(xorLoop);
}
window.requestAnimationFrame(xorLoop);
//# sourceMappingURL=index.js.map