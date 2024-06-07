/** The different ways the neat algorithm can optimize the fitness function. */
enum OptimizationType {
  /** Specifies the algorithm should try to maximize the fitness function */
  Maximizing,
  /** Specifies the algorithm should try to minimize the fitness function */
  Minimizing
}

/**
 * Utility class to manage a population. Has a method for finding a solution to a
 * set of TrainingValues, or an array of input-output values. TODO making a
 * method to evolve an optimal brain for a game.
 */
class Neat {
  /**
   * Toggle for averaging the fitness over some number of
   * iterations when recurrent connections are enabled
   */
  static AverageFitnessForRecurrentFlag: boolean = true
  /** The number of iterations to average over when the corresponding flag is true */
  static IterationsToAverageOverForRecurrent: number = 5

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
   * Runs the Neat algorithm on the specified TrainingValues and resolves with a solution.
   * If the algorithm runs beyond the specified max generations, this resolves with the
   * fittest member it made during the algorithm.
   * @param trainingValues the values to find a solution for
   * @param desiredError the desired fitness of the solution
   * @param populationSize the size of the population
   * @param maxGenerations the maximum number of generations to run for
   * @param updateInterval the delay between generations
   * @returns a promise that will resolve with the solution
   */
  findSolution(trainingValues: TrainingValues, desiredError: number, populationSize: number = 1000,
    maxGenerations: number = 1000, updateInterval: number = 10): Promise<Brain> {

    const population: Population = new Population(populationSize, trainingValues.inputSize, 0, trainingValues.outputSize, 1)
      .setGraphics(this.graphics)
      .setFitnessType(OptimizationType.Minimizing)

    return new Promise(resolve => {
      function iterate() {
        // if the population's fittest member ever has the desired fitness, resolve it
        if (population.fittestEver && population.fittestEver.fitness <= desiredError) resolve(population.fittestEver)
        // if the population has run for too many generations, resolve the fittest ever
        else if (population.generationCounter >= maxGenerations) resolve(population.fittestEver)
        else {
          population.nextGeneration()
          // fitness calculation
          // takes the results of 5 run throughs of a random order of training values
          // this ensures that, if recurrent connections are enabled, the solution's
          // fitness wasn't just a fluke from that random ordering
          population.members.forEach(member => {
            member.fitness = 0
            if (Brain.AllowRecurrent && Neat.AverageFitnessForRecurrentFlag) {
              for (let i = 0; i < Neat.IterationsToAverageOverForRecurrent; i++) {
                for (let value of desiredValues.random) {
                  const actual: number[] = member.think(value.inputs)
                  const errors: number[] = value.outputs.map((expected, i) => Math.abs(expected - actual[i]))
                  errors.forEach(error => member.fitness += error)
                }
              }
              member.fitness /= Neat.IterationsToAverageOverForRecurrent
            } else {
              for (let value of desiredValues.random) {
                const actual: number[] = member.think(value.inputs)
                const errors: number[] = value.outputs.map((expected, i) => Math.abs(expected - actual[i]))
                errors.forEach(error => member.fitness += error)
              }
            }
          })
          population.updateFittestEver()
          population.speciate()
          population.graphics.bg()
          population.draw()

          setTimeout(iterate, updateInterval)
        }
      }
      iterate()
    })
  }
}