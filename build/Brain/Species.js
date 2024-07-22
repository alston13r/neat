/**
 * A species is a group of brains that have similar topologies. Two brains will
 * belong to the same species if their differences, as calculated in the static
 * Compare() method, are below the dynamic threshold. The dynamic threshold will
 * adjust depending on the current number of species present in the population
 * and the desired number.
 */
class Species {
    /** The weight that excess connections have in the compatibility difference */
    static ExcessFactor = 1;
    /** The weight that disjoint connections have in the compatibility difference */
    static DisjointFactor = 1;
    /** The weight that the average of weight difference have in the compatibility difference  */
    static WeightFactor = 0.4;
    /** The number of generations that a species can run for simultaneously without improvement without being penalized */
    static GenerationPenalization = 15;
    /** The current target number of species */
    static TargetSpecies = 10;
    /** The current compatibility threshold used for comparisons */
    static DynamicThreshold = 100;
    /** The compatibility threshold step size */
    static DynamicThresholdStepSize = 0.5;
    /** A reference to this species' containing population */
    population;
    /** An array of this species' members */
    members = [];
    /** The number of allowed offspring this species can produce */
    allowedOffspring = 0;
    /** The number of generations since this species has improved */
    gensSinceImproved = 0;
    /** Record of this species' highest fitness value */
    highestFitness = 0;
    constructor(population) {
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
     * Returns the average fitness of all members in this species.
     * @returns the average fitness
     */
    getAverageFitness() {
        const N = this.members.length;
        let res = this.members.reduce((sum, curr) => sum + (N == 0 ? 0 : curr.fitness / N), 0);
        if (Number.isNaN(res)) {
            console.log(N, this.members.length);
            for (const member of this.members) {
                if (member.fitness < 0 || Number.isNaN(member.fitness) || !Number.isFinite(member.fitness)) {
                    console.log('inner ' + member.fitness);
                }
            }
        }
        return res;
    }
    /**
     * Returns the average adjusted fitness of all members in this species.
     * The adjusted fitness of a member is their fitness normalized to their
     * species, fitness / N, where N is the size of the species.
     * @returns the average adjusted fitness
     */
    getAverageFitnessAdjusted() {
        const N = this.members.length;
        return (N == 0 ? 0 : this.getAverageFitness() / N);
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
        // get any preexisting species
        const speciesList = population.speciesList;
        const champions = [];
        // select champions from each one and store them in an array
        for (let species of speciesList) {
            const champion = species.members.splice(Math.floor(Math.random() * species.members.length), 1)[0];
            champions.push(champion);
            // clear species field for all other species members
            species.members.forEach(member => member.species = null);
            species.members = [champion];
        }
        // store all remaining and unspeciated members in an array
        const toSpeciate = population.members.filter(member => member.species == null);
        // while loop to go over each unspeciated member
        while (toSpeciate.length > 0) {
            // there can either be an array of champions from the previous generation
            // or no champions
            let champion;
            // this selects a random champion from the unspeciated array
            if (champions.length == 0) {
                champion = toSpeciate.splice(Math.floor(Math.random() * toSpeciate.length), 1)[0];
                // create a species for the champion
                champion.species = new Species(champion.population);
                champion.species.members.push(champion);
            }
            // this takes a champion from the front of the champions array
            else
                champion = champions.shift();
            // for loop to go over the remaining members of the unspeciated array
            // this will group them together with the champion if they are
            // compatible or throw them back at the end of the array
            const count = toSpeciate.length;
            for (let i = 0; i < count; i++) {
                const brain = toSpeciate.shift();
                if (Species.Compare(champion, brain) <= Species.DynamicThreshold) {
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
//# sourceMappingURL=Species.js.map