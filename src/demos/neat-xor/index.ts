/// <reference path="../../utils/drawing/graphics.ts" />
/// <reference path="../../utils/training-values.ts" />

const xorGraphics = new Graphics(document.getElementById('mainCanvas') as HTMLCanvasElement).setSize(800, 550)
const xorTrainingValues = TrainingValues.XOR
const xorPopSize = 1000
const xorNeat = new Neat(xorPopSize, { inputSize: 2, outputSize: 1 }, { mutations: { allowRecurrentConnections: false } })
// const xorPopulation = new Population(xorPopSize, 2, 0, 1)

const xorDesiredFitness = 3.95
const xorMaxGenerations = 1000

// Brain.AllowRecurrent = false

let xorSolution: Brain

function calculateFitness(brain: Brain) {
  brain.fitness = 0
  for (const value of xorTrainingValues.random()) {
    const actual = brain.think(value.inputs)
    const errors = value.outputs.map((expected, i) => lerp(Math.abs(expected - actual[i]), 0, 2, 1, 0))
    errors.forEach(error => brain.fitness += error)
  }
}

function xorLoop() {
  xorNeat.nextGeneration()
  xorNeat.runFitnessFunction(calculateFitness)
  // xorPopulation.members.forEach(calculateFitness)

  xorNeat.updateFittest()
  // xorPopulation.updateFittestEver()
  xorNeat.speciateMembers()
  // xorPopulation.speciate()

  xorGraphics.bg()
  xorNeat.population.draw(xorGraphics)
  // xorPopulation.draw(xorGraphics)
  xorNeat.population.fittestEver.draw(xorGraphics, 320, 550, 480)

  if (xorNeat.population.fittestEver.fitness >= xorDesiredFitness) {
    xorSolution = xorNeat.population.fittestEver
    console.log('Solution found, storing to var<xorSolution>', xorSolution.fitness)
    xorTrainingValues.values.forEach(io => {
      console.log('[' + io.inputs.join(', ') + '] -> ['
        + xorSolution.think(io.inputs).join(', ') + ']')
    })
    return
  }

  if (xorNeat.getCurrentGeneration() >= xorMaxGenerations) {
    xorSolution = xorNeat.population.fittestEver
    console.log('Solution not found, storing best ever to var<xorSolution>', xorSolution.fitness)
    xorTrainingValues.values.forEach(io => {
      console.log('[' + io.inputs.join(', ') + '] -> ['
        + xorSolution.think(io.inputs).join(', ') + ']')
    })
    return
  }

  window.requestAnimationFrame(xorLoop)
}

window.requestAnimationFrame(xorLoop)