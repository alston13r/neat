/**
 * Utility class to manage a population. Has a method for finding a solution to a
 * set of TrainingValues, or an array of input-output values. TODO making a
 * method to evolve an optimal brain for a game.
 */
class Neat {
  /** A reference to the graphics object that this will draw to */
  graphics: Graphics

  /**
   * Sets the local reference for graphics to the specified object.
   * @param graphics the graphics to set
   * @returns a refrence to this Neat object
   */
  setGraphics(graphics: Graphics): Neat {
    this.graphics = graphics
    return this
  }

  /**
   * Helper method to find a solution to a valid TrainingValues at, or above, the desired
   * fitness level.
   * @param values the values to find a solution for
   * @param desiredFitness the desired fitness of the solution
   * @param populationSize the size of the population
   * @param updateInterval the update interval between generations
   * @returns a promise that will resolve with the solution brain
   */
  findSolution(values: TrainingValues | { inputs: number[], outputs: number[] }[],
    desiredFitness: number, populationSize: number = 1000, updateInterval: number = 10): Promise<Brain> {
    const trainingValues: TrainingValues = values instanceof TrainingValues ? values : new TrainingValues(values)

    const fitnessFunction = (brain: Brain) => {
      brain.fitness = trainingValues.maxLinearFitnessValue()
      for (let value of trainingValues.random()) {
        brain.loadInputs(value.inputs)
        brain.runTheNetwork()
        const output = brain.getOutput()
        const difference = value.outputs.map((exp, i) => Math.abs(exp - output[i]))
        brain.fitness -= difference.reduce((sum, curr) => sum + curr)
      }
      return brain.fitness
    }

    const population: Population = new Population(populationSize,
      values.values[0].inputs.length, 0, values.values[0].outputs.length, 1)
      .setGraphics(this.graphics)
    population.calculateFitness(fitnessFunction)
    if (Population.Speciation) population.speciate()

    return new Promise((resolve) => {
      const iterate = () => {
        if (this.graphics) {
          this.graphics.bg()
          population.draw()
        }
        if (population.fittestEver == null || population.fittestEver.fitness >= desiredFitness) {
          const solution: Brain = population.fittestEver
          console.log(`Solution found`)
          solution.loadInputs([0, 0])
          solution.runTheNetwork()
          console.log(`[0, 0] -> [${solution.getOutput().join(', ')}]`)
          solution.loadInputs([0, 1])
          solution.runTheNetwork()
          console.log(`[0, 1] -> [${solution.getOutput().join(', ')}]`)
          solution.loadInputs([1, 0])
          solution.runTheNetwork()
          console.log(`[1, 0] -> [${solution.getOutput().join(', ')}]`)
          solution.loadInputs([1, 1])
          solution.runTheNetwork()
          console.log(`[1, 1] -> [${solution.getOutput().join(', ')}]`)
          return resolve(solution)
        } else {
          population.nextGeneration()
          population.calculateFitness(fitnessFunction)
          if (Population.Speciation) population.speciate()

          setTimeout(iterate, updateInterval)
        }
      }
      iterate()
    })
  }

  /**
   * Basic function to calculate the fitness of a brain based on values, where the ideal fitness is the exact output
   * and any deviation is simply subtracted from the max potential fitness.
   * @param brain the brain to calculate the fitness for
   * @param values the values
   * @returns the fitness of the brain
   */
  calculateLinearFitness(brain: Brain, values: TrainingValues | { inputs: number[], outputs: number[] }[]): number {
    const trainingValues: TrainingValues = values instanceof TrainingValues ? values : new TrainingValues(values)
    brain.fitness = trainingValues.maxLinearFitnessValue()
    for (let value of trainingValues.random()) {
      brain.loadInputs(value.inputs)
      brain.runTheNetwork()
      const output = brain.getOutput()
      const difference = value.outputs.map((exp, i) => Math.abs(exp - output[i]))
      brain.fitness -= difference.reduce((sum, curr) => sum + curr)
    }
    return brain.fitness
  }
}