const neuralNetGraphics = new Graphics().setSize(800, 600).appendToBody();
const desired = TrainingValues.XOR;
const neuralNet = new NeuralNetwork(2, 2, 1);
function getError() {
    let error = 0;
    for (let pair of desired.ordered) {
        const actual = neuralNet.feedForward(pair.inputs);
        actual.forEach((output, i) => {
            error += Math.abs(pair.outputs[i] - output);
        });
    }
    return error;
}
const maxIterations = 200000;
const loopsPerAnimationFrame = 100;
const desiredError = 0.05;
let currentIteration = 0;
function neuralNetLoop() {
    neuralNetGraphics.bg();
    let solutionFound = false;
    for (let i = 0; i < loopsPerAnimationFrame; i++) {
        if (solutionFound)
            break;
        currentIteration++;
        const error = getError();
        neuralNet.adjustAlpha(error);
        if (error <= desiredError) {
            solutionFound = true;
        }
        if (error <= desiredError) {
            solutionFound = true;
            console.log(`Solution found in ${currentIteration} iterations`);
            for (let pair of desired.ordered) {
                console.log('[' + pair.inputs.join(', ') + '] -> [' + neuralNet.feedForward(pair.inputs).join(', ') + ']');
            }
            break;
        }
        neuralNet.backPropagation(desired);
    }
    if (Math.random() < 0.005) {
        console.log('mutate');
        neuralNet.mutateWeights();
        neuralNet.mutateBiases();
        neuralNet.mutateActivationFunctions();
    }
    neuralNetGraphics.createText(`Current iteration: ${currentIteration}`, 5, 5, { size: 20 }).draw();
    for (let [i, pair] of desired.ordered.entries()) {
        neuralNetGraphics.createText('[' + pair.inputs.join(', ') + '] -> [' + neuralNet.feedForward(pair.inputs).join(', ') + ']', 5, 25 + i * 20, { size: 20 }).draw();
    }
    if (solutionFound)
        neuralNetGraphics.createText('solution', 5, 105, { size: 20 }).draw();
    else if (currentIteration < maxIterations)
        window.requestAnimationFrame(neuralNetLoop);
}
window.requestAnimationFrame(neuralNetLoop);
//# sourceMappingURL=index.js.map