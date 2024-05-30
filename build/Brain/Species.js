/**
 * TODO
 */
class Species {
    constructor() {
        this.members = [];
        this.allowedOffspring = 0;
        this.gensSinceImproved = 0;
        this.highestFitness = 0;
    }
    /**
     * TODO
     * @param brainA
     * @param brainB
     * @returns
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
     * TODO
     */
    adjustFitness() {
        const N = this.members.length;
        this.members.forEach(member => {
            member.fitnessAdjusted = member.fitness / N;
        });
    }
    /**
     * TODO
     * @returns
     */
    getAverageFitness() {
        return this.members.reduce((sum, curr) => sum + curr.fitness / this.members.length, 0);
    }
    /**
     * TODO
     * @returns
     */
    getAverageFitnessAdjusted() {
        return this.members.reduce((sum, curr) => sum + curr.fitnessAdjusted / this.members.length, 0);
    }
    /**
     * TODO
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
     * TODO
     * @param population
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
            champion.species = new Species();
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
     * TODO
     */
    produceOffspring() {
        if (this.allowedOffspring == 0 || this.gensSinceImproved > Species.GenerationPenalization) {
            this.members = [];
        }
        else {
            const copyOfMembers = [...this.members];
            this.members = Population.Elitism ? Population.GetElites(this.members, this.allowedOffspring) : [];
            const remainingCount = this.allowedOffspring - this.members.length;
            const pairings = Population.GeneratePairings(copyOfMembers, remainingCount);
            pairings.forEach(({ p1, p2 }) => Brain.Crossover(p1, p2));
        }
    }
}
Species.ExcessFactor = 1;
Species.DisjointFactor = 1;
Species.WeightFactor = 0.4;
Species.GenerationPenalization = 15;
Species.SpeciesIndex = 0;
Species.TargetSpecies = 10;
Species.DynamicThreshold = 100;
Species.DynamicThresholdStepSize = 0.5;
//# sourceMappingURL=Species.js.map