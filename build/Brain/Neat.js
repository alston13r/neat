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
    /**
     * Runs the Neat algorithm on the specified TrainingValues and resolves with a solution.
     * If the algorithm runs beyond the specified max generations, this resolves with the
     * fittest member it made during the algorithm.
     * @param trainingValues the values to find a solution for
     * @param desiredFitness the desired fitness of the solution
     * @param populationSize the size of the population
     * @param maxGenerations the maximum number of generations to run for
     * @param updateInterval the delay between generations
     * @returns a promise that will resolve with the solution
     */
    findSolution(trainingValues, desiredFitness, populationSize = 1000, maxGenerations = 1000, updateInterval = 10) {
        const population = new Population(populationSize, trainingValues.inputSize, 0, trainingValues.outputSize, 1)
            .setGraphics(this.graphics);
        population.draw();
        return new Promise(resolve => {
            function iterate() {
                // if the population's fittest member ever has the desired fitness, resolve it
                if (population.fittestEver && population.fittestEver.fitness >= desiredFitness)
                    resolve(population.fittestEver);
                // if the population has run for too many generations, resolve the fittest ever
                else if (population.generationCounter >= maxGenerations)
                    resolve(population.fittestEver);
                else {
                    population.nextGeneration();
                    // fitness calculation
                    // takes the average of 5 run throughs of a random order of training values
                    // this ensures that, if recurrent connections are enabled, the solution's
                    // fitness wasn't just a fluke from that random ordering
                    const maxFitness = trainingValues.length * trainingValues.outputSize;
                    population.members.forEach(member => {
                        let fitnessSum = 0;
                        for (let i = 0; i < 5; i++) {
                            let tempFitness = maxFitness;
                            for (let value of trainingValues.random) {
                                const actual = member.think(value.inputs);
                                const errors = value.outputs.map((expected, i) => Math.abs(expected - actual[i]));
                                const errorSum = errors.reduce((sum, curr) => sum + curr);
                                tempFitness -= errorSum;
                            }
                            fitnessSum += tempFitness;
                        }
                        fitnessSum /= 5;
                        member.fitness = fitnessSum;
                    });
                    population.updateFittestEver();
                    population.speciate();
                    population.graphics.bg();
                    population.draw();
                    setTimeout(iterate, updateInterval);
                }
            }
            iterate();
        });
    }
}
//# sourceMappingURL=Neat.js.map