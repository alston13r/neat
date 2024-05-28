const desired = TrainingValues.XOR

const neuralNet: NeuralNetwork = new NeuralNetwork(2, 2, 1)

function getError(): number {
  let error: number = 0
  for (let pair of desired.ordered()) {
    const actual: number[] = neuralNet.feedForward(pair.inputs)
    actual.forEach((output, i) => {
      error += Math.abs(pair.outputs[i] - output)
    })
  }
  return error
}

const iterationCount: number = 200000
const logCount: number = 100
const desiredError: number = 0.05

for (let i = 0; i < iterationCount; i++) {
  const error: number = getError()
  neuralNet.adjustAlpha(error)

  if (i % (iterationCount / logCount) == 0) {
    for (let pair of desired.ordered()) {
      console.log('[' + pair.inputs.join(', ') + '] -> [' + neuralNet.feedForward(pair.inputs).join(', ') + ']')
    }
    console.log('Current error: ' + error)
  }
  if (error <= desiredError) {
    console.log('Solution found')
    break
  }
  neuralNet.backPropagation(desired)
}