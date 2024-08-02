/// <reference path="../../neural-network/neural-network.ts" />

const neuralNetGraphics = new Graphics().setSize(800, 600).appendToBody()
neuralNetGraphics.font = '20px arial'
neuralNetGraphics.textBaseline = 'top'

const desired = TrainingValues.XOR

const neuralNet = new NeuralNetwork(2, 2, 1)

function getError() {
  let error = 0
  for (let value of desired.values) {
    const actual = neuralNet.feedForward(value.inputs)
    const errors = value.outputs.map((expected, i) => lerp(Math.abs(expected - actual[i]), 0, 2, 1, 0))
    errors.forEach(e => error += e)
  }
  return error
}

const maxIterations = 200000
const loopsPerAnimationFrame = 100
const desiredError = 3.95
let currentIteration = 0

function neuralNetLoop() {
  neuralNetGraphics.bg()

  let solutionFound = false

  for (let i = 0; i < loopsPerAnimationFrame; i++) {
    if (solutionFound) break

    currentIteration++

    const error = getError()
    neuralNet.adjustAlpha(error)

    if (error >= desiredError) {
      solutionFound = true
      console.log(`Solution found in ${currentIteration} iterations`)
      for (let pair of desired.values) {
        console.log('[' + pair.inputs.join(', ') + '] -> [' + neuralNet.feedForward(pair.inputs).join(', ') + ']')
      }
      break
    }
    neuralNet.backPropagation(desired)
  }

  if (Math.random() < 0.005) {
    console.log('mutate')
    neuralNet.mutateWeights()
    neuralNet.mutateBiases()
    neuralNet.mutateActivationFunctions()
  }

  neuralNetGraphics.fillStyle = '#fff'
  neuralNetGraphics.fillText(`Current iteration: ${currentIteration}`, 5, 5)

  for (let [i, pair] of desired.values.entries()) {
    neuralNetGraphics.fillText(
      `[${pair.inputs.join(', ')}] -> [${neuralNet.feedForward(pair.inputs).join(', ')}]`,
      5, 25 + i * 20
    )
  }

  if (solutionFound) neuralNetGraphics.fillText('solution', 5, 105)
  else if (currentIteration < maxIterations) window.requestAnimationFrame(neuralNetLoop)
}

window.requestAnimationFrame(neuralNetLoop)