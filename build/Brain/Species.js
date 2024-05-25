const ExcessFactor = 1;
const DisjointFactor = 1;
const WeightsFactor = 0.4;
const GenerationPenalization = 15;
class Species {
    constructor() {
        this.members = [];
        this.allowedOffspring = 0;
        this.gensSinceImproved = 0;
        this.highestFitness = 0;
    }
    /**
     * @param {Brain} a
     * @param {Brain} b
     * @returns {number}
     */
    static Compare(a, b) {
        let enabledA = a.connections.filter(c => c.enabled).sort((c, d) => c.innovationID - d.innovationID);
        let enabledB = b.connections.filter(c => c.enabled).sort((c, d) => c.innovationID - d.innovationID);
        let N = Math.max(enabledA.length, enabledB.length);
        let disjoint = 0;
        let excess = 0;
        let weights = 0;
        let i = 0;
        let j = 0;
        let maxI = enabledA.length - 1;
        let maxJ = enabledB.length - 1;
        while (i <= maxI && j <= maxJ) {
            let currLeft = enabledA[i];
            let currRight = enabledB[j];
            let leftID = currLeft.innovationID;
            let rightID = currRight.innovationID;
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
        excess *= ExcessFactor / N;
        disjoint *= DisjointFactor / N;
        weights *= WeightsFactor;
        return excess + disjoint + weights;
    }
    adjustFitness() {
        const N = this.members.length;
        this.members.forEach(member => {
            member.fitnessAdjusted = member.fitness / N;
        });
    }
    getAverageFitness() {
        return this.members.reduce((sum, curr) => sum + curr.fitness / this.members.length, 0);
    }
    getAverageFitnessAdjusted() {
        return this.members.reduce((sum, curr) => sum + curr.fitnessAdjusted / this.members.length, 0);
    }
    updateGensSinceImproved() {
        let max = this.members.reduce((best, curr) => Math.max(best, curr.fitness), 0);
        if (max > this.highestFitness) {
            this.gensSinceImproved = 0;
            this.highestFitness = max;
        }
        else
            this.gensSinceImproved++;
    }
    /**
     * @param {Population} pop
     */
    static Speciate(pop) {
        let speciesList = pop.speciesList;
        let champions = [];
        for (let s of speciesList) {
            let champion = s.members.splice(Math.floor(Math.random() * s.members.length), 1)[0];
            champions.push(champion);
            for (let x of s.members) {
                x.species = null;
            }
            s.members = [champion];
        }
        let toSpeciate = pop.members.filter(b => b.species == null);
        for (let champion of champions) {
            let amount = toSpeciate.length;
            for (let i = 0; i < amount; i++) {
                let b = toSpeciate.shift();
                let result = Species.Compare(champion, b);
                if (result <= Species.DynamicThreshold) {
                    b.species = champion.species;
                    b.species.members.push(b);
                }
                else
                    toSpeciate.push(b);
            }
        }
        while (toSpeciate.length > 0) {
            let champion = toSpeciate.splice(Math.floor(Math.random() * toSpeciate.length), 1)[0];
            champion.species = new Species();
            champion.species.members.push(champion);
            let amount = toSpeciate.length;
            for (let i = 0; i < amount; i++) {
                let b = toSpeciate.shift();
                let result = Species.Compare(champion, b);
                if (result <= Species.DynamicThreshold) {
                    b.species = champion.species;
                    b.species.members.push(b);
                }
                else
                    toSpeciate.push(b);
            }
        }
    }
    produceOffspring() {
        if (this.allowedOffspring == 0 || this.gensSinceImproved > GenerationPenalization) {
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
Species.SpeciesIndex = 0;
Species.TargetSpecies = 10;
Species.DynamicThreshold = 40;
Species.DynamicThresholdStepSize = 0.5;
//# sourceMappingURL=Species.js.map