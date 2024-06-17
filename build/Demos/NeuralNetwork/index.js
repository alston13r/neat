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
const iterationCount = 200000;
const logCount = 100;
const desiredError = 0.05;
for (let i = 0; i < iterationCount; i++) {
    const error = getError();
    neuralNet.adjustAlpha(error);
    if (i % (iterationCount / logCount) == 0) {
        for (let pair of desired.ordered) {
            console.log('[' + pair.inputs.join(', ') + '] -> [' + neuralNet.feedForward(pair.inputs).join(', ') + ']');
        }
        console.log('Current error: ' + error);
    }
    if (error <= desiredError) {
        console.log(`Solution found in ${i} iterations`);
        for (let pair of desired.ordered) {
            console.log('[' + pair.inputs.join(', ') + '] -> [' + neuralNet.feedForward(pair.inputs).join(', ') + ']');
        }
        break;
    }
    neuralNet.backPropagation(desired);
}
//# sourceMappingURL=index.js.map