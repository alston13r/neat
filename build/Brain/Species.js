/**
 * A species is a group of brains that have similar topologies. Two brains will
 * belong to the same species if their differences, as calculated in the static
 * Compare() method, are below the dynamic threshold. The dynamic threshold will
 * adjust depending on the current number of species present in the population
 * and the desired number.
 */
class Species {
    constructor(population) {
        /** An array of this species' members */
        this.members = [];
        /** The number of allowed offspring this species can produce */
        this.allowedOffspring = 0;
        /** The number of generations since this species has improved */
        this.gensSinceImproved = 0;
        /** Record of this species' highest fitness value */
        this.highestFitness = 0;
        this.population = population;
    }
    /**
     * Compares two brains based on their topologies. Topologies are compared by
     * only their enabled connections' innovation IDs and weights. For every connection
     * that is not in the other, they are considered disjoint, or excess if they
     * exceed the maximum innovation ID of the other. The weights of the connections
     * are only compared for connections in both topologies, with the weights value
     * simply being the sum of the differences between them. The disjoint number,
     * excess number, and weight differences are then weighted by the static Factor
     * values and that value is returned, indicating the compatibility of the two
     * brains. If the two brains are identical, the compatibility value is expected
     * to be 0. Two brains belong to the same species if their compatibility is
     * below the current threshold.
     * @param brainA the first brain to compare
     * @param brainB the second brain to compare
     * @returns the compatibility of the two brains
     */
    static Compare(brainA, brainB) {
        const enabledA = brainA.connections.filter(connection => connection.enabled)
            .sort((connectionA, connectionB) => connectionA.innovationID - connectionB.innovationID);
        const enabledB = brainB.connections.filter(connection => connection.enabled)
            .sort((connectionA, connectionB) => connectionA.innovationID - connectionB.innovationID);
        const N = Math.max(enabledA.length, enabledB.length);
        let disjoint = 0;
        let excess = 0;
        let weights = 0;
        let i = 0;
        let j = 0;
        const maxI = enabledA.length - 1;
        const maxJ = enabledB.length - 1;
        while (i <= maxI && j <= maxJ) {
            const currLeft = enabledA[i];
            const currRight = enabledB[j];
            const leftID = currLeft.innovationID;
            const rightID = currRight.innovationID;
            let di = 1;
            let dj = 1;
            if (leftID == rightID) {
                weights += Math.abs(currLeft.weight - currRight.weight);
            }
            else if (leftID < rightID) {
                if (i == maxI)
                    excess++;
                else {
                    disjoint++;
                    dj = 0;
                }
            }
            else {
                if (j == maxJ)
                    excess++;
                else {
                    disjoint++;
                    di = 0;
                }
            }
            if (i == maxI)
                di = 0;
            if (j == maxJ)
                dj = 0;
            if (i == maxI && j == maxJ)
                break;
            i += di;
            j += dj;
        }
        excess *= Species.ExcessFactor / N;
        disjoint *= Species.DisjointFactor / N;
        weights *= Species.WeightFactor;
        return excess + disjoint + weights;
    }
    /**
     * Adjusts the fitness of all members in this species. The members
     * need to have a fitness calculated prior to this being called.
     */
    adjustFitness() {
        const N = this.members.length;
        this.members.forEach(member => {
            member.fitnessAdjusted = member.fitness / N;
        });
    }
    /**
     * Returns the average fitness of all members in this species.
     * @returns the average fitness
     */
    getAverageFitness() {
        return this.members.reduce((sum, curr) => sum + curr.fitness / this.members.length, 0);
    }
    /**
     * Returns the average adjusted fitness of all members in this species.
     * The adjusted fitness for each member is calculated in adjustFitness().
     * @returns the average adjusted fitness
     */
    getAverageFitnessAdjusted() {
        return this.members.reduce((sum, curr) => sum + curr.fitnessAdjusted / this.members.length, 0);
    }
    /**
     * Updates the gensSinceImproved counter to indicate the number of generations
     * that have passed since this species has improved. This means that it has
     * produced a member with a fitness greater than the recorded highest.
     */
    updateGensSinceImproved() {
        const max = this.members.reduce((best, curr) => Math.max(best, curr.fitness), 0);
        if (max > this.highestFitness) {
            this.gensSinceImproved = 0;
            this.highestFitness = max;
        }
        else
            this.gensSinceImproved++;
    }
    /**
     * Speciates the population, placing every member into a species. This works
     * by selecting champions from either a preexisting set of species or a group
     * of unspeciated members. Then, the rest of the members are compared to these
     * champions and placed into their corresponding species.
     * @param population the population to speciate
     */
    static Speciate(population) {
        const speciesList = population.speciesList;
        const champions = [];
        for (let species of speciesList) {
            const champion = species.members.splice(Math.floor(Math.random() * species.members.length), 1)[0];
            champions.push(champion);
            species.members.forEach(member => member.species = null);
            species.members = [champion];
        }
        const toSpeciate = population.members.filter(member => member.species == null);
        for (let champion of champions) {
            const count = toSpeciate.length;
            for (let i = 0; i < count; i++) {
                const brain = toSpeciate.shift();
                const result = Species.Compare(champion, brain);
                if (result <= Species.DynamicThreshold) {
                    brain.species = champion.species;
                    brain.species.members.push(brain);
                }
                else
                    toSpeciate.push(brain);
            }
        }
        while (toSpeciate.length > 0) {
            const champion = toSpeciate.splice(Math.floor(Math.random() * toSpeciate.length), 1)[0];
            champion.species = new Species(champion.population);
            champion.species.members.push(champion);
            const count = toSpeciate.length;
            for (let i = 0; i < count; i++) {
                const brain = toSpeciate.shift();
                const result = Species.Compare(champion, brain);
                if (result <= Species.DynamicThreshold) {
                    brain.species = champion.species;
                    brain.species.members.push(brain);
                }
                else
                    toSpeciate.push(brain);
            }
        }
    }
    /**
     * Produces the next generation's offspring and returns an array of them.
     * If the allowed number of offspring is 0, this returns an empty array. The
     * offspring are first set to include the previous generation's elites and
     * any remaining spots are produced by crossover between two parents rolled
     * by a roulette wheel.
     */
    produceOffspring() {
        if (this.allowedOffspring == 0 || this.gensSinceImproved > Species.GenerationPenalization) {
            return [];
        }
        else {
            const offspring = this.population.elitism ? Population.GetElites(this.members, this.allowedOffspring) : [];
            const remainingCount = this.allowedOffspring - offspring.length;
            Population.GeneratePairings(this.members, remainingCount)
                .forEach(({ p1, p2 }) => offspring.push(Brain.Crossover(p1, p2)));
            return offspring;
        }
    }
}
/** The weight that excess connections have in the compatibility difference */
Species.ExcessFactor = 1;
/** The weight that disjoint connections have in the compatibility difference */
Species.DisjointFactor = 1;
/** The weight that the average of weight difference have in the compatibility difference  */
Species.WeightFactor = 0.4;
/** The number of generations that a species can run for simultaneously without improvement without being penalized */
Species.GenerationPenalization = 15;
/** The current target number of species */
Species.TargetSpecies = 10;
/** The current compatibility threshold used for comparisons */
Species.DynamicThreshold = 100;
/** The compatibility threshold step size */
Species.DynamicThresholdStepSize = 0.5;
//# sourceMappingURL=Species.js.map