class Species {
    static ExcessFactor = 1;
    static DisjointFactor = 1;
    static WeightFactor = 0.4;
    static GenerationPenalization = 15;
    static TargetSpecies = 10;
    static DynamicThreshold = 100;
    static DynamicThresholdStepSize = 0.5;
    members = [];
    allowedOffspring = 0;
    gensSinceImproved = 0;
    highestFitness = 0;
    static Compare(brainA, brainB) {
        const enabledA = brainA.getSortedConnections();
        const enabledB = brainB.getSortedConnections();
        const lenA = enabledA.length;
        const lenB = enabledB.length;
        const N = Math.max(lenA, lenB);
        let disjoint = 0;
        let excess = 0;
        let weights = 0;
        let A = false;
        let B = false;
        let C = false;
        let D = false;
        let E = false;
        let F = false;
        let G = false;
        let H = false;
        let i = 0;
        let j = 0;
        const iMax = lenA - 1;
        const jMax = lenB - 1;
        const iterMax = lenA + lenB;
        for (let iter = 0; iter < iterMax; iter++) {
            if (H) {
                excess += iMax - i + jMax - j + 1;
                break;
            }
            const left = enabledA[i];
            const right = enabledB[j];
            const leftID = left.innovationID;
            const rightID = right.innovationID;
            C = i == iMax;
            D = j == jMax;
            E = leftID < rightID;
            F = leftID > rightID;
            G = leftID == rightID;
            A = !C;
            B = !D;
            if (G)
                weights += Math.abs(left.weight - right.weight);
            else {
                disjoint++;
                H = D && F && !E || C && E && !F;
                if (H)
                    excess++;
                else {
                    A &&= E;
                    B &&= F;
                }
            }
            if (!A && !B)
                break;
            if (A)
                i++;
            if (B)
                j++;
        }
        return disjoint * Species.DisjointFactor / N + excess * Species.ExcessFactor / N + weights * Species.WeightFactor;
    }
    getAverageFitness() {
        const N = this.members.length;
        return this.members.reduce((sum, curr) => sum + (N == 0 ? 0 : curr.fitness / N), 0);
    }
    getAverageFitnessAdjusted() {
        const N = this.members.length;
        return (N == 0 ? 0 : this.getAverageFitness() / N);
    }
    updateGensSinceImproved() {
        const max = this.members.reduce((best, curr) => Math.max(best, curr.fitness), 0);
        if (max > this.highestFitness) {
            this.gensSinceImproved = 0;
            this.highestFitness = max;
        }
        else
            this.gensSinceImproved++;
    }
    static Speciate(population) {
        const list = population.speciesList;
        const champions = list.map(species => {
            const champion = Brain.TakeRandomMember(species.members);
            species.members.forEach(member => member.species = null);
            species.members = [champion];
            return champion;
        });
        let unspeciated;
        champions.forEach(champion => {
            unspeciated = population.members.filter(member => member.species == null);
            if (unspeciated.length == 0)
                return;
            for (let i = 0; i < unspeciated.length; i++) {
                const brain = unspeciated[i];
                if (this.Compare(champion, brain) <= this.DynamicThreshold) {
                    brain.species = champion.species;
                    brain.species.members.push(brain);
                }
            }
        });
        unspeciated = population.members.filter(member => member.species == null);
        while (unspeciated.length > 0) {
            const champion = Brain.TakeRandomMember(unspeciated);
            champion.species = new Species();
            champion.species.members.push(champion);
            population.speciesList.push(champion.species);
            for (let i = 0; i < unspeciated.length; i++) {
                const brain = unspeciated[i];
                if (this.Compare(champion, brain) <= this.DynamicThreshold) {
                    brain.species = champion.species;
                    brain.species.members.push(brain);
                }
            }
            unspeciated = population.members.filter(member => member.species == null);
        }
    }
    produceOffspring() {
        if (this.allowedOffspring == 0 || this.gensSinceImproved > Species.GenerationPenalization) {
            this.members.length = 0;
            return [];
        }
        const offspring = [];
        if (Population.Elitism)
            Population.GetElites(offspring, this.members, this.allowedOffspring);
        const remainingCount = this.allowedOffspring - offspring.length;
        Population.GeneratePairings(this.members, remainingCount)
            .forEach(({ p1, p2 }) => offspring.push(Brain.Crossover(p1, p2)));
        return offspring;
    }
    static GetPresets() {
        return {
            'ExcessFactor': Species.ExcessFactor,
            'DisjointFactor': Species.DisjointFactor,
            'WeightFactor': Species.WeightFactor,
            'GenerationPenalization': Species.GenerationPenalization,
            'TargetSpecies': Species.TargetSpecies,
            'DynamicThreshold': Species.DynamicThreshold,
            'DynamicThresholdStepSize': Species.DynamicThresholdStepSize
        };
    }
}
//# sourceMappingURL=species.js.map