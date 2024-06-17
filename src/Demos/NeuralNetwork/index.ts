const neuralNetGraphics: Graphics = new Graphics().setSize(800, 600).appendToBody()

const desired = TrainingValues.XOR

const neuralNet: NeuralNetwork = new NeuralNetwork(2, 2, 1)

function getError(): number {
  let error: number = 0
  for (let pair of desired.ordered) {
    const actual: number[] = neuralNet.feedForward(pair.inputs)
    actual.forEach((output, i) => {
      error += Math.abs(pair.outputs[i] - output)
    })
  }
  return error
}

const maxIterations: number = 200000
const loopsPerAnimationFrame: number = 100
const desiredError: number = 0.05
let currentIteration: number = 0

function neuralNetLoop(): void {
  neuralNetGraphics.bg()

  let solutionFound: boolean = false

  for (let i = 0; i < loopsPerAnimationFrame; i++) {
    if (solutionFound) break

    currentIteration++

    const error: number = getError()
    neuralNet.adjustAlpha(error)

    if (error <= desiredError) {
      solutionFound = true
    }

    if (error <= desiredError) {
      solutionFound = true
      console.log(`Solution found in ${currentIteration} iterations`)
      for (let pair of desired.ordered) {
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

  neuralNetGraphics.createText(`Current iteration: ${currentIteration}`, 5, 5, '#fff', 20, 'left', 'top').draw()

  for (let [i, pair] of desired.ordered.entries()) {
    neuralNetGraphics.createText(
      '[' + pair.inputs.join(', ') + '] -> [' + neuralNet.feedForward(pair.inputs).join(', ') + ']',
      5, 25 + i * 20, '#fff', 20, 'left', 'top'
    ).draw()
  }

  if (solutionFound) neuralNetGraphics.createText('solution', 5, 105, '#fff', 20, 'left', 'top').draw()
  else if (currentIteration < maxIterations) window.requestAnimationFrame(neuralNetLoop)
}

window.requestAnimationFrame(neuralNetLoop)