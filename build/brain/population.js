class Population {
    static Speciation = true;
    static Elitism = true;
    static ElitePercent = 0.3;
    generationCounter = 0;
    members = [];
    popSize;
    inputN;
    hiddenN;
    outputN;
    enabledChance;
    fittestEver;
    speciesList = [];
    constructor(popSize, inputN, hiddenN, outputN, enabledChance = 1) {
        this.popSize = popSize;
        this.inputN = inputN;
        this.hiddenN = hiddenN;
        this.outputN = outputN;
        this.enabledChance = enabledChance;
    }
    adjustDynamicThreshold() {
        Species.DynamicThreshold += Math.sign(this.speciesList.length - Species.TargetSpecies) * Species.DynamicThresholdStepSize;
    }
    getFittest() {
        return this.members.reduce((best, curr) => Brain.GetFitter(best, curr));
    }
    updateFittestEver() {
        const genFittest = this.getFittest();
        if (this.fittestEver == null)
            this.fittestEver = genFittest;
        else
            this.fittestEver = Brain.GetFitter(this.fittestEver, genFittest);
        return this.fittestEver;
    }
    updateGensSinceImproved() {
        this.speciesList.forEach(species => species.updateGensSinceImproved());
    }
    getAverageFitness() {
        const N = this.members.length;
        return this.members.reduce((sum, curr) => sum + (N == 0 ? 0 : curr.fitness / N), 0);
    }
    calculateAllowedOffspring() {
        const maxSize = this.popSize;
        const speciesList = [...this.speciesList];
        const items = speciesList.map(species => {
            return {
                fitness: species.getAverageFitnessAdjusted(),
                species,
                length: species.members.length
            };
        });
        const avg = items.reduce((sum, curr) => sum + curr.fitness * curr.length, 0) / maxSize;
        items.forEach(item => item.species.allowedOffspring = item.fitness / (avg == 0 ? 1 : avg) * item.length);
        roundNicely(speciesList, 'allowedOffspring', maxSize);
    }
    produceOffspring() {
        if (Population.Speciation) {
            this.members = [];
            this.speciesList.forEach(species => {
                const speciesOffspring = species.produceOffspring();
                this.members.push(...speciesOffspring);
                speciesOffspring.forEach(offspring => offspring.species = species);
                species.members = speciesOffspring;
            });
            this.speciesList = this.speciesList.filter(s => s.members.length > 0);
            if (this.members.length < this.popSize) {
                const difference = this.popSize - this.members.length;
                for (let i = 0; i < difference; i++) {
                    this.members.push(new Brain().initialize(this.inputN, this.hiddenN, this.outputN, this.enabledChance));
                }
            }
        }
        else {
            const copyOfMembers = [...this.members];
            if (Population.Elitism)
                Population.GetElites(this.members, copyOfMembers, this.popSize);
            else
                this.members.length = 0;
            const parents = [];
            Population.GeneratePairings(parents, copyOfMembers, this.popSize - this.members.length);
            for (let i = 0; i < parents.length; i += 2) {
                this.members.push(Brain.Crossover(parents[i], parents[i + 1]));
            }
        }
    }
    mutate() {
        this.members.forEach(member => member.mutate());
    }
    nextGeneration() {
        if (this.members.length == 0) {
            this.members = new Array(this.popSize).fill(0)
                .map(() => new Brain().initialize(this.inputN, this.hiddenN, this.outputN, this.enabledChance));
        }
        else {
            this.produceOffspring();
            this.generationCounter++;
            this.mutate();
        }
    }
    speciate() {
        if (Population.Speciation) {
            Species.Speciate(this);
            this.updateGensSinceImproved();
            this.adjustDynamicThreshold();
            this.calculateAllowedOffspring();
        }
    }
    static RouletteWheel(out, list, count) {
        if (count == 0 || list.length == 0) {
            out.length = 0;
            return out;
        }
        if (list.length == 1) {
            out.fill(list[0]);
            return out;
        }
        const items = list.map(item => ({ brain: item, value: item.fitness, sum: 0 }));
        const max = items.reduce((sum, curr) => {
            curr.sum = sum + curr.value;
            return curr.sum;
        }, 0);
        for (let i = 0; i < count; i++) {
            const value = Math.random() * max;
            search: for (const item of items) {
                if (value < item.sum) {
                    out[i] = item.brain;
                    break search;
                }
            }
        }
        return out;
    }
    static GeneratePairings(out, list, count) {
        if (count == 0) {
            out.length = 0;
            return out;
        }
        out.length = count * 2;
        return this.RouletteWheel(out, list, count * 2);
    }
    static GetElites(out, list, limit) {
        out.length = 0;
        if (limit == 0)
            return out;
        list.sort((a, b) => b.fitness - a.fitness);
        const N = Math.min(limit, Math.round(Population.ElitePercent * list.length));
        for (let i = 0; i < N; i++) {
            out[i] = list[i];
            out[i].isElite = true;
        }
        return out;
    }
    draw(g) {
        g.textBaseline = 'top';
        g.textAlign = 'left';
        g.fillStyle = '#fff';
        g.font = '20px arial';
        g.fillText(`Generation: ${this.generationCounter} <${this.members.length}>`, 5, 5);
        const getMemberText = (brain, i) => {
            const a = brain.fitness.toPrecision(6);
            const b = (brain.fitness / brain.species.members.length).toPrecision(6);
            return `${i + 1}: ${a} ${Population.Speciation ? ' -> ' + b : ''}`;
        };
        g.font = '10px arial';
        this.members.slice()
            .sort((a, b) => b.fitness - a.fitness)
            .slice(0, 50)
            .forEach((brain, i) => {
            g.fillText(getMemberText(brain, i), 5, 25 + i * 10);
        });
        if (Population.Speciation) {
            g.font = '20px arial';
            g.fillText(`Species (Threshold: ${Species.DynamicThreshold})`, 240, 5);
            const getSpeciesText = (species) => {
                const a = species.members.length;
                const b = species.getAverageFitness().toPrecision(6);
                const c = species.getAverageFitnessAdjusted().toPrecision(6);
                const d = species.gensSinceImproved;
                return `<${a}, ${d}> ${b} -> ${c}`;
            };
            g.font = '10px arial';
            this.speciesList
                .sort((a, b) => b.members.length - a.members.length)
                .slice(0, 50)
                .forEach((s, i) => g.fillText(getSpeciesText(s), 240, 25 + i * 10));
        }
    }
}
//# sourceMappingURL=population.js.map