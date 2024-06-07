/** The different ways that the neat algorithm can optimize for. */
var FitnessType;
(function (FitnessType) {
    /** Specifies the algorithm should try to maximize fitness, the more positive the better */
    FitnessType[FitnessType["Maximizing"] = 0] = "Maximizing";
    /** Specifies the algorithm should try to minimize fitness, the closer to 0 the better */
    FitnessType[FitnessType["Minimizing"] = 1] = "Minimizing";
})(FitnessType || (FitnessType = {}));
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
     * @param desiredError the desired fitness of the solution
     * @param populationSize the size of the population
     * @param maxGenerations the maximum number of generations to run for
     * @param updateInterval the delay between generations
     * @returns a promise that will resolve with the solution
     */
    findSolution(trainingValues, desiredError, populationSize = 1000, maxGenerations = 1000, updateInterval = 10) {
        const population = new Population(populationSize, trainingValues.inputSize, 0, trainingValues.outputSize, 1)
            .setGraphics(this.graphics)
            .setFitnessType(FitnessType.Minimizing);
        return new Promise(resolve => {
            function iterate() {
                // if the population's fittest member ever has the desired fitness, resolve it
                if (population.fittestEver && population.fittestEver.fitness <= desiredError)
                    resolve(population.fittestEver);
                // if the population has run for too many generations, resolve the fittest ever
                else if (population.generationCounter >= maxGenerations)
                    resolve(population.fittestEver);
                else {
                    population.nextGeneration();
                    // fitness calculation
                    // takes the results of 5 run throughs of a random order of training values
                    // this ensures that, if recurrent connections are enabled, the solution's
                    // fitness wasn't just a fluke from that random ordering
                    population.members.forEach(member => {
                        member.fitness = 0;
                        if (Brain.AllowRecurrent) {
                            for (let i = 0; i < 5; i++) {
                                for (let value of desiredValues.random) {
                                    const actual = member.think(value.inputs);
                                    const errors = value.outputs.map((expected, i) => Math.abs(expected - actual[i]));
                                    errors.forEach(error => member.fitness += error);
                                }
                            }
                            member.fitness /= 5;
                        }
                        else {
                            for (let value of desiredValues.random) {
                                const actual = member.think(value.inputs);
                                const errors = value.outputs.map((expected, i) => Math.abs(expected - actual[i]));
                                errors.forEach(error => member.fitness += error);
                            }
                        }
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