// TODO
class NeuralNetwork {
    constructor(a, b, c) {
        this.alpha = 0.01;
        this.inputSize = a;
        if (c == null) {
            this.hiddenSizes = [];
            this.outputSize = b;
        }
        else {
            this.hiddenSizes = b instanceof Array ? [...b] : [b];
            this.outputSize = c;
        }
        this.weights = [];
        this.biases = [];
        for (let i = 1; i < this.hiddenSizes.length; i++) {
            this.weights.push(new Matrix(this.hiddenSizes[i], this.hiddenSizes[i - 1]));
        }
        if (this.hiddenSizes.length > 0) {
            this.weights.push(new Matrix(this.outputSize, this.hiddenSizes[this.hiddenSizes.length - 1]));
            this.weights.unshift(new Matrix(this.hiddenSizes[0], this.inputSize));
        }
        else {
            this.weights.push(new Matrix(this.outputSize, this.inputSize));
        }
        for (let i = 0; i < this.hiddenSizes.length; i++) {
            this.biases.push(new Matrix(this.hiddenSizes[i], 1));
        }
        this.biases.push(new Matrix(this.outputSize, 1));
        for (let weightMatrix of this.weights)
            Matrix.Randomize(weightMatrix, NeuralNetwork.MinimumWeightValue, NeuralNetwork.MaximumWeightValue);
        for (let biasMatrix of this.biases)
            Matrix.Randomize(biasMatrix, NeuralNetwork.MinimumBiasValue, NeuralNetwork.MaximumBiasValue);
        const outputLayerDActivationFunctions = new Array(this.outputSize).fill(DActivationFunction.DSigmoid);
        const hiddenLayerDActivationFunctions = [];
        for (let row of this.hiddenSizes) {
            const tempLayer = new Array(row).fill(DActivationFunction.DSigmoid);
            hiddenLayerDActivationFunctions.push(tempLayer);
        }
        this.dActivationFunctions = [];
        for (let hiddenLayer of hiddenLayerDActivationFunctions) {
            this.dActivationFunctions.push(hiddenLayer);
        }
        this.dActivationFunctions.push(outputLayerDActivationFunctions);
        this.activationFunctions = [];
        for (let dActivationFunctionLayer of this.dActivationFunctions) {
            this.activationFunctions.push(dActivationFunctionLayer.map(dActivationFunction => dActivationFunction.original));
        }
    }
    // TODO
    static GenerateRandomWeight() {
        return Math.random() * (NeuralNetwork.MaximumWeightValue - NeuralNetwork.MinimumWeightValue) + NeuralNetwork.MinimumWeightValue;
    }
    // TODO
    static GenerateRandomBias() {
        return Math.random() * (NeuralNetwork.MaximumBiasValue - NeuralNetwork.MinimumBiasValue) + NeuralNetwork.MinimumBiasValue;
    }
    // TODO
    mutateWeights() {
        this.weights.forEach(weight => Matrix.Map(weight, x => {
            if (Math.random() < NeuralNetwork.MutateWeightChance) {
                if (Math.random() < NeuralNetwork.NudgeWeightChance)
                    return x + gauss() * 0.5;
                return NeuralNetwork.GenerateRandomWeight();
            }
            return x;
        }));
        this.clampWeights();
    }
    // TODO
    mutateBiases() {
        this.biases.forEach(bias => Matrix.Map(bias, x => {
            if (Math.random() < NeuralNetwork.MutateBiasChance) {
                if (Math.random() < NeuralNetwork.NudgeBiasChance)
                    return x + gauss() * 0.5;
                return NeuralNetwork.GenerateRandomBias();
            }
            return x;
        }));
        this.clampBiases();
    }
    // TODO
    clampWeights() {
        this.weights.forEach(weight => Matrix.Map(weight, x => clamp(x, NeuralNetwork.MinimumWeightValue, NeuralNetwork.MaximumWeightValue)));
    }
    // TODO
    clampBiases() {
        this.biases.forEach(bias => Matrix.Map(bias, x => clamp(x, NeuralNetwork.MinimumBiasValue, NeuralNetwork.MaximumBiasValue)));
    }
    // TODO
    mutateActivationFunctions() {
        for (let i = 0; i < this.dActivationFunctions.length; i++) {
            let row = this.dActivationFunctions[i];
            for (let j = 0; j < row.length; j++) {
                if (Math.random() < NeuralNetwork.MutateActivationFunctionChance) {
                    row[j] = DActivationFunction.Arr[Math.floor(Math.random() * DActivationFunction.Arr.length)];
                    this.activationFunctions[i][j] = row[j].original;
                }
            }
        }
    }
    // TODO
    feedForward(inputs) {
        let lastOutput = Matrix.FromArr(inputs).transpose();
        for (let [i, e] of this.weights.entries()) {
            lastOutput = e.dot(lastOutput).add(this.biases[i]).map((x, j) => this.activationFunctions[i][j].fn(x));
        }
        return lastOutput.toArray();
    }
    // TODO
    backPropagation(values) {
        const trainingValues = values instanceof TrainingValues ? values : new TrainingValues(values);
        for (let value of trainingValues.random()) {
            const layerOutputs = [Matrix.FromArr(value.inputs).transpose()];
            for (let [i, e] of this.weights.entries()) {
                const lastOutput = layerOutputs[layerOutputs.length - 1];
                const layerOutput = e.dot(lastOutput).add(this.biases[i]).map((x, j) => this.activationFunctions[i][j].fn(x));
                layerOutputs.push(layerOutput);
            }
            const layerErrors = [Matrix.FromArr(value.outputs).transpose().sub(layerOutputs[layerOutputs.length - 1])];
            for (let i = this.weights.length - 1; i >= 1; i--) {
                const lastError = layerErrors[layerErrors.length - 1];
                layerErrors.push(this.weights[i].transpose().dot(lastError));
            }
            layerErrors.reverse();
            const biasDeltas = [];
            const weightDeltas = [];
            for (let [i, error] of layerErrors.entries()) {
                const delta = error.mul(layerOutputs[i + 1].map((x, j) => this.dActivationFunctions[i][j].fn(x))).scale(this.alpha);
                biasDeltas.push(delta);
                weightDeltas.push(delta.dot(layerOutputs[i].transpose()));
            }
            for (let [i, e] of biasDeltas.entries()) {
                Matrix.Add(this.biases[i], e);
                Matrix.Add(this.weights[i], weightDeltas[i]);
            }
        }
    }
}
/** The chance for a weight to be mutated */
NeuralNetwork.MutateWeightChance = 0.5;
/** The chance for a weight to be nudged when mutated, rather than randomized */
NeuralNetwork.NudgeWeightChance = 0.8;
/** The minimum value that a weight can be */
NeuralNetwork.MinimumWeightValue = -1;
/** The maximum value that a weight can be */
NeuralNetwork.MaximumWeightValue = 1;
/** The chance for a bias to be mutated */
NeuralNetwork.MutateBiasChance = 0.5;
/** The chance for a bias to be nudged when mutated, rather than randomized */
NeuralNetwork.NudgeBiasChance = 0.8;
/** The minimum value that a bias can be */
NeuralNetwork.MinimumBiasValue = -1;
/** The maximum value that a bias can be */
NeuralNetwork.MaximumBiasValue = 1;
/** The chance for an activation function to be mutated */
NeuralNetwork.MutateActivationFunctionChance = 0.05;
// class BasicNeuralNetwork {
//   static Copy(n: BasicNeuralNetwork): BasicNeuralNetwork {
//     let a: BasicNeuralNetwork = new BasicNeuralNetwork(n.inputSize, n.hiddenSizes, n.outputSize)
//     for (let [i, e] of n.weights.entries()) a.weights[i] = e.copy()
//     for (let [i, e] of n.biases.entries()) a.biases[i] = e.copy()
//     a.activationFunction = n.activationFunction
//     a.dActivationFunction = n.dActivationFunction
//     a.learningRate = n.learningRate
//     return a
//   }
//   copy(): BasicNeuralNetwork {
//     return BasicNeuralNetwork.Copy(this)
//   }
//   static Crossover(a: BasicNeuralNetwork, b: BasicNeuralNetwork): BasicNeuralNetwork {
//     let listErr: string = '['
//     if (a.inputSize != b.inputSize) listErr += 'inputSize'
//     if (!a.hiddenSizes.every(e => b.hiddenSizes.includes(e))) {
//       if (listErr.length > 1) listErr += ','
//       listErr += 'hiddenSizes'
//     }
//     if (a.outputSize != b.outputSize) {
//       if (listErr.length > 1) listErr += ','
//       listErr += 'outputSize'
//     }
//     if (listErr.length > 1) {
//       listErr += ']'
//       throw Error('Network incompatibility - ' + listErr)
//     }
//     let n: BasicNeuralNetwork = a.copy()
//     for (let [i, e] of n.weights.entries()) Matrix.Map(e, (e, j, k) => rand(a.weights[i].m[j][k], b.weights[i].m[j][k]) as number)
//     for (let [i, e] of n.biases.entries()) Matrix.Map(e, (e, j, k) => rand(a.biases[i].m[j][k], b.biases[i].m[j][k]) as number)
//     return n
//   }
// }
//# sourceMappingURL=NeuralNetwork.js.map