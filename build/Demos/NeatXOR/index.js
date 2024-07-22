const xorGraphics = new Graphics().setSize(800, 600).appendTo(document.body);
const xorTrainingValues = TrainingValues.XOR;
const xorPopSize = 1000;
const xorPopulation = new Population(xorPopSize, 2, 0, 1);
const xorDesiredFitness = 3.95;
const xorMaxGenerations = 1000;
Brain.AllowRecurrent = false;
function xorLoop() {
    if (xorPopulation.fittestEver && xorPopulation.fittestEver.fitness >= xorDesiredFitness) {
        let solution = xorPopulation.fittestEver;
        console.log('Solution found', solution.fitness);
        xorTrainingValues.ordered.forEach(io => {
            console.log('inputs: [' + io.inputs.join(', ') + ']');
            console.log('outputs: [' + solution.think(io.inputs).join(', ') + ']');
        });
        return;
    }
    if (xorPopulation.generationCounter >= xorMaxGenerations) {
        let solution = xorPopulation.fittestEver;
        console.log('Solution not found, defaulting', solution.fitness);
        xorTrainingValues.ordered.forEach(io => {
            console.log('inputs: [' + io.inputs.join(', ') + ']');
            console.log('outputs: [' + solution.think(io.inputs).join(', ') + ']');
        });
        return;
    }
    xorPopulation.nextGeneration();
    xorPopulation.members.forEach(member => {
        member.fitness = 0;
        for (const value of xorTrainingValues.random) {
            const actual = member.think(value.inputs);
            const errors = value.outputs.map((expected, i) => lerp(Math.abs(expected - actual[i]), 0, 2, 1, 0));
            errors.forEach(error => member.fitness += error);
        }
    });
    xorPopulation.updateFittestEver();
    xorPopulation.speciate();
    xorGraphics.bg();
    xorPopulation.draw(xorGraphics);
    window.requestAnimationFrame(xorLoop);
}
window.requestAnimationFrame(xorLoop);
//# sourceMappingURL=index.js.map