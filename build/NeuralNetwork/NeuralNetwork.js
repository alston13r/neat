// function mutateWeight(x: number): number {
//   if (Math.random() < 0.05) return x + gauss() * 0.5
//   return x
// }
// class BasicNeuralNetwork {
//   inputSize: number
//   outputSize: number
//   hiddenSizes: number[]
//   weights: Matrix[]
//   biases: Matrix[]
//   activationFunction: (x: number) => number
//   dActivationFunction: (x: number) => number
//   learningRate: number
//   constructor(a: number, b: number | number[], c?: number) {
//     this.inputSize = a
//     if (c == undefined) {
//       this.hiddenSizes = []
//       this.outputSize = b as number
//     } else {
//       this.hiddenSizes = b instanceof Array ? [...b] : [b]
//       this.outputSize = c
//     }
//     this.weights = []
//     this.biases = []
//     for (let i = 1; i < this.hiddenSizes.length; i++) this.weights.push(new Matrix(this.hiddenSizes[i], this.hiddenSizes[i - 1]))
//     if (this.hiddenSizes.length > 0) {
//       this.weights.push(new Matrix(this.outputSize, this.hiddenSizes[this.hiddenSizes.length - 1]))
//       this.weights.unshift(new Matrix(this.hiddenSizes[0], this.inputSize))
//     } else {
//       this.weights.push(new Matrix(this.outputSize, this.inputSize))
//     }
//     for (let i = 0; i < this.hiddenSizes.length; i++) this.biases.push(new Matrix(this.hiddenSizes[i], 1))
//     this.biases.push(new Matrix(this.outputSize, 1))
//     for (let w of this.weights) Matrix.Randomize(w)
//     for (let b of this.biases) Matrix.Randomize(b)
//     this.activationFunction = tanh as (x: number) => number
//     this.dActivationFunction = dtanh as (x: number) => number
//     this.learningRate = 0.01
//   }
//   feedForward(input: number[]): number[] {
//     let lastOutput: Matrix = Matrix.FromArr(input).transpose()
//     for (let [i, e] of this.weights.entries()) lastOutput = e.dot(lastOutput).add(this.biases[i]).map(this.activationFunction)
//     return lastOutput.toArray()
//   }
//   train(inputs: number[], targets: number[]): void {
//     let layerOutputs: Matrix[] = [Matrix.FromArr(inputs).transpose()]
//     for (let [i, e] of this.weights.entries()) {
//       let lastOutput: Matrix = layerOutputs[layerOutputs.length - 1]
//       let layerOutput: Matrix = e.dot(lastOutput).add(this.biases[i]).map(this.activationFunction)
//       layerOutputs.push(layerOutput)
//     }
//     let layerErrors: Matrix[] = [Matrix.FromArr(targets).transpose().sub(layerOutputs[layerOutputs.length - 1])]
//     for (let i = this.weights.length - 1; i >= 1; i--) {
//       let lastError: Matrix = layerErrors[layerErrors.length - 1]
//       layerErrors.push(this.weights[i].transpose().dot(lastError))
//     }
//     layerErrors.reverse()
//     let biasDeltas: Matrix[] = []
//     let weightDeltas: Matrix[] = []
//     for (let [i, error] of layerErrors.entries()) {
//       biasDeltas.push(error.mul(layerOutputs[i + 1].map(this.dActivationFunction)).mul(this.learningRate))
//       weightDeltas.push(biasDeltas[biasDeltas.length - 1].dot(layerOutputs[i].transpose()))
//     }
//     for (let [i, e] of biasDeltas.entries()) {
//       Matrix.Add(this.biases[i], e)
//       Matrix.Add(this.weights[i], weightDeltas[i])
//     }
//   }
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
//   clamp(): void {
//     for (let w of this.weights) {
//       Matrix.Map(w, e => {
//         if (e > 1) return 1
//         if (e < -1) return -1
//         return e
//       })
//     }
//     for (let b of this.biases) {
//       Matrix.Map(b, e => {
//         if (e > 1) return 1
//         if (e < -1) return -1
//         return e
//       })
//     }
//   }
//   mutate(fn: (x: number) => number): void {
//     for (let w of this.weights) Matrix.Map(w, fn)
//     for (let b of this.biases) Matrix.Map(b, fn)
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