// @ts-nocheck
/**
 * TODO
 */
class Population {
    /**
     * TODO
     * @param popSize
     * @param inputN
     * @param hiddenN
     * @param outputN
     * @param enabledChance
     */
    constructor(popSize, inputN, hiddenN, outputN, enabledChance = 1) {
        this.generationCounter = 0;
        this.members = [];
        this.popSize = popSize;
        this.inputN = inputN;
        this.hiddenN = hiddenN;
        this.outputN = outputN;
        this.enabledChance = enabledChance;
    }
    /**
     * TODO
     */
    setGraphics(graphics) {
        this.graphics = graphics;
        return this;
    }
    /**
     * TODO
     */
    get speciesList() {
        const returnArr = [];
        this.members.forEach(member => {
            if (member.species != null && !returnArr.includes(member.species))
                returnArr.push(member.species);
        });
        return returnArr;
    }
    /**
     * TODO
     */
    adjustThreshold() {
        Species.DynamicThreshold += Math.sign(this.speciesList.length - Species.TargetSpecies) * Species.DynamicThresholdStepSize;
    }
    // /**
    //  * @param {function(Brain): void} fitnessFunction 
    //  * @returns {Brain | null}
    //  */
    calculateFitness(fitnessFunction) {
        for (let i = this.members.length; i < this.popSize; i++) {
            this.members.push(new Brain().initialize(this.inputN, this.hiddenN, this.outputN, this.connPerc));
        }
        let fittest;
        if (fitnessFunction) {
            for (let b of this.members) {
                fitnessFunction(b);
                if (fittest == null || b.fitness > fittest.fitness)
                    fittest = b;
            }
            if (this.fittestEver == null || fittest.fitness > this.fittestEver.fitness)
                this.fittestEver = fittest;
        }
        this.fittest = this.members.reduce((best, curr) => curr.fitness > best.fitness ? curr : best);
        return fittest;
    }
    /**
     * TODO
     * @returns
     */
    getFittest() {
        return this.members.reduce((best, curr) => curr.fitness > best.fitness ? curr : best);
    }
    /**
     * TODO
     */
    updateGensSinceImproved() {
        this.speciesList.forEach(species => species.updateGensSinceImproved());
    }
    /**
     * TODO
     */
    adjustFitness() {
        this.speciesList.forEach(species => species.adjustFitness());
    }
    /**
     * TODO
     * @returns
     */
    getAverageFitness() {
        const N = this.members.length;
        return this.members.reduce((sum, curr) => sum + curr.fitness / N, 0);
    }
    /**
     *
     * @returns
     */
    getAverageFitnessAdjusted() {
        const N = this.members.length;
        return this.members.reduce((sum, curr) => sum + curr.fitnessAdjusted / N, 0);
    }
    /**
     * TODO
     */
    calculateAllowedOffspring() {
        const max = this.popSize;
        const avg = this.getAverageFitnessAdjusted();
        const list = [...this.speciesList];
        list.forEach(species => species.allowedOffspring = species.getAverageFitnessAdjusted() / avg * species.members.length);
        list.sort((a, b) => {
            const c = a.allowedOffspring - Math.floor(a.allowedOffspring);
            const d = b.allowedOffspring - Math.floor(b.allowedOffspring);
            if (c == d)
                return b.allowedOffspring - a.allowedOffspring;
            return d - c;
        });
        const min = list.reduce((sum, curr) => sum + Math.floor(curr.allowedOffspring), 0);
        const roundUpCount = max - min;
        for (let i = 0; i < roundUpCount; i++) {
            const species = list.shift();
            species.allowedOffspring = Math.ceil(species.allowedOffspring);
        }
        for (let species of list) {
            species.allowedOffspring = Math.floor(species.allowedOffspring);
        }
    }
    /**
     * TODO
     */
    produceOffspring() {
        if (Population.Speciation) {
            this.members = [];
            this.speciesList.forEach(species => {
                species.produceOffspring();
                this.members.push(...species.members);
            });
            if (this.members.length < this.popSize) {
                for (let i = 0; i < this.popSize - this.members.length; i++) {
                    this.members.push(new Brain().initialize(this.inputN, this.hiddenN, this.outputN, this.enabledChance));
                }
            }
        }
        else {
            const copyOfMembers = [...this.members];
            this.members = Population.Elitism ? Population.GetElites(this.members, this.popSize) : [];
            const pairings = Population.GeneratePairings(copyOfMembers, this.popSize);
            pairings.forEach(({ p1, p2 }) => this.members.push(Brain.Crossover(p1, p2)));
        }
    }
    /**
     * TODO
     */
    mutate() {
        this.members.forEach(member => member.mutate());
    }
    /**
     * TODO
     */
    nextGeneration() {
        this.produceOffspring();
        this.generationCounter++;
        this.mutate();
    }
    /**
     * TODO
     */
    speciate() {
        Species.Speciate(this);
        this.updateGensSinceImproved();
        this.adjustThreshold();
        this.adjustFitness();
        this.calculateAllowedOffspring();
    }
    /**
     * TODO
     * @param list
     * @param offspringN
     * @returns
     */
    static GeneratePairings(list, offspringN) {
        if (offspringN == 0)
            return [];
        const parents = rouletteWheel(list, 'fitness', offspringN * 2);
        return new Array(offspringN).fill(0).map(() => {
            return { p1: parents.pop(), p2: parents.pop() };
        });
    }
    /**
     * TODO
     * @param list
     * @param softLimit
     * @returns
     */
    static GetElites(list, softLimit) {
        if (softLimit == 0)
            return [];
        const res = [];
        const sorted = [...list].sort((a, b) => b.fitness - a.fitness);
        for (let i = 0; i < Math.min(Math.round(Population.ElitePercent * list.length), softLimit); i++) {
            const eliteMember = sorted[i];
            eliteMember.isElite = true;
            res.push(eliteMember);
        }
        return res;
    }
    draw() {
        const round = (x, p) => Math.round(x * 10 ** p) / 10 ** p;
        this.graphics.bg();
        new GraphicsText(this.graphics, `Generation: ${this.generationCounter} <${this.members.length}>`, 5, 5, '#fff', 20, 'left', 'top').draw();
        let getMemberText = (brain, i) => {
            let b = i;
            let c = round(brain.fitness, 5);
            let d = round(brain.fitnessAdjusted, 5);
            return `${b}: ${c} ${Population.Speciation ? ' -> ' + d : ''}`;
        };
        this.members.slice().sort((a, b) => b.fitness - a.fitness).slice(0, 50)
            .map((b, i) => new GraphicsText(this.graphics, getMemberText(b, i), 5, 25 + i * 10, '#fff', 10, 'left', 'top'))
            .forEach(member => member.draw());
        if (Population.Speciation) {
            new GraphicsText(this.graphics, `Species (Threshold: ${Species.DynamicThreshold})`, 250, 5, '#fff', 20, 'left', 'top')
                .draw();
            let getSpeciesText = species => {
                let a = species.members.length;
                let b = round(species.getAverageFitness(), 5);
                let c = round(species.getAverageFitnessAdjusted(), 5);
                return `<${a}> ${b} -> ${c}`;
            };
            this.speciesList.map((s, i) => new GraphicsText(this.graphics, getSpeciesText(s), 250, 25 + i * 10, '#fff', 10, 'left', 'top'))
                .forEach(species => species.draw());
        }
    }
}
Population.Speciation = true;
Population.Elitism = true;
Population.ElitePercent = 0.3;
//# sourceMappingURL=Population.js.map