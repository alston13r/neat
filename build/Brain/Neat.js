/**
 * Utility class to manage a population. Has a method for finding a solution to a
 * set of TrainingValues, or an array of input-output values. TODO making a
 * method to evolve an optimal brain for a game.
 */
class Neat {
    /**
     * Sets the local reference for graphics to the specified object.
     * @param graphics the graphics to set
     * @returns a refrence to this Neat object
     */
    setGraphics(graphics) {
        this.graphics = graphics;
        return this;
    }
    // fragmentGame(Game, population) {
    //   return population.members.map(member => {
    //     return {
    //       member,
    //       game: new Game(this.graphics.width, this.graphics.height)
    //     }
    //   })
    // }
    // runOnGame(Game) {
    //   // curr position (x and y)
    //   // curr velocity (x and y)
    //   // curr heading
    //   // can fire
    //   // position of nearest asteroid (x and y)
    //   // velocity of nearest asteroid (x and y)
    //   // angle to nearest asteroid
    //   // thrusters
    //   // steering
    //   // fire
    //   let population = new Population(50, 7, 0, 3, 1)
    //   population.calculateFitness()
    //   let fragments = this.fragmentGame(Game, population)
    //   this.runThroughFragments(fragments)
    //   population.speciate()
    //   while (population.generationCounter < 1000) {
    //     population.nextGeneration()
    //     population.calculateFitness()
    //     fragments = this.fragmentGame(Game, population)
    //     this.runThroughFragments(fragments)
    //     let fittest = population.getFittest()
    //     // fittest.draw(this.graphics)
    //     population.speciate()
    //   }
    //   console.log(population.getFittest())
    // }
    // runThroughFragments(fragments) {
    //   let stillAlive = true
    //   while (fragments.length > 0 && stillAlive) {
    //     stillAlive = false
    //     for (let fragment of [...fragments].reverse()) {
    //       let member = fragment.member
    //       let game = fragment.game
    //       game.update()
    //       game.collisions()
    //       if (game.ship.alive) stillAlive = true
    //       else {
    //         member.fitness = game.asteroidCounter * 10 + game.updateCounter / 100
    //         fragments.splice(fragments.indexOf(fragment), 1)
    //       }
    //     }
    //   }
    // }
    /**
     * Helper method to find a solution to a valid TrainingValues at, or above, the desired
     * fitness level.
     * @param values the values to find a solution for
     * @param desiredFitness the desired fitness of the solution
     * @param populationSize the size of the population
     * @param updateInterval the update interval between generations
     * @returns a promise that will resolve with the solution brain
     */
    findSolution(values, desiredFitness, populationSize = 1000, updateInterval = 10) {
        const trainingValues = values instanceof TrainingValues ? values : new TrainingValues(values);
        const fitnessFunction = (brain) => {
            brain.fitness = trainingValues.maxLinearFitnessValue();
            for (let value of trainingValues.random()) {
                brain.loadInputs(value.inputs);
                brain.runTheNetwork();
                const output = brain.getOutput();
                const difference = value.outputs.map((exp, i) => Math.abs(exp - output[i]));
                brain.fitness -= difference.reduce((sum, curr) => sum + curr);
            }
            return brain.fitness;
        };
        const population = new Population(populationSize, values.values[0].inputs.length, 0, values.values[0].outputs.length, 1)
            .setGraphics(this.graphics);
        population.calculateFitness(fitnessFunction);
        population.speciate();
        return new Promise((resolve) => {
            const iterate = () => {
                if (this.graphics) {
                    this.graphics.bg();
                    population.draw();
                }
                if (population.fittestEver == null || population.fittestEver.fitness >= desiredFitness) {
                    const solution = population.fittestEver;
                    console.log(`Solution found`);
                    solution.loadInputs([0, 0]);
                    solution.runTheNetwork();
                    console.log(`[0, 0] -> [${solution.getOutput().join(', ')}]`);
                    solution.loadInputs([0, 1]);
                    solution.runTheNetwork();
                    console.log(`[0, 1] -> [${solution.getOutput().join(', ')}]`);
                    solution.loadInputs([1, 0]);
                    solution.runTheNetwork();
                    console.log(`[1, 0] -> [${solution.getOutput().join(', ')}]`);
                    solution.loadInputs([1, 1]);
                    solution.runTheNetwork();
                    console.log(`[1, 1] -> [${solution.getOutput().join(', ')}]`);
                    return resolve(solution);
                }
                else {
                    population.nextGeneration();
                    population.calculateFitness(fitnessFunction);
                    if (Population.Speciation)
                        population.speciate();
                    setTimeout(iterate, updateInterval);
                }
            };
            iterate();
        });
    }
    /**
     * Basic function to calculate the fitness of a brain based on values, where the ideal fitness is the exact output
     * and any deviation is simply subtracted from the max potential fitness.
     * @param brain the brain to calculate the fitness for
     * @param values the values
     * @returns the fitness of the brain
     */
    calculateLinearFitness(brain, values) {
        const trainingValues = values instanceof TrainingValues ? values : new TrainingValues(values);
        brain.fitness = trainingValues.maxLinearFitnessValue();
        for (let value of trainingValues.random()) {
            brain.loadInputs(value.inputs);
            brain.runTheNetwork();
            const output = brain.getOutput();
            const difference = value.outputs.map((exp, i) => Math.abs(exp - output[i]));
            brain.fitness -= difference.reduce((sum, curr) => sum + curr);
        }
        return brain.fitness;
    }
}
//# sourceMappingURL=Neat.js.map