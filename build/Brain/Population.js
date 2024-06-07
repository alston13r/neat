/**
 * A population is a collection of a bunch of brains and allows for a large amount
 * of brains to explore different topologies. Larger populations allow for solutions
 * to be found quciker. This class also houses the methods necessary to produce the
 * offspring for the next generation.
 */
class Population {
    /**
     * Constructs a population with the specified size, input nodes, hidden nodes, output nodes,
     * and chance for connections to start enabled.
     * @param popSize the population size
     * @param inputN the number of input nodes
     * @param hiddenN the number of hidden nodes
     * @param outputN the number of output nodes
     * @param enabledChance the chance for connections to start enabled
     */
    constructor(popSize, inputN, hiddenN, outputN, enabledChance = 1) {
        /** Toggle for speciation between generations */
        this.speciation = true;
        /** Toggle for elitism */
        this.elitism = true;
        /** A counter for the current generation */
        this.generationCounter = 0;
        /** An array of the population's members */
        this.members = [];
        this.popSize = popSize;
        this.inputN = inputN;
        this.hiddenN = hiddenN;
        this.outputN = outputN;
        this.enabledChance = enabledChance;
    }
    /**
     * The list of all current species that the members are registered to.
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
     * Adjusts the dynamic compatibility threshold for the species class given the current
     * number of species and the desired amount. If speciation is disabled, this will not be called.
     */
    adjustThreshold() {
        Species.DynamicThreshold += Math.sign(this.speciesList.length - Species.TargetSpecies) * Species.DynamicThresholdStepSize;
    }
    /**
     * Returns the fittest member in the current list of members.
     * @returns the fittest member
     */
    getFittest() {
        return this.members.reduce((best, curr) => curr.fitness > best.fitness ? curr : best);
    }
    /**
     * Updates this population's fittest member ever. The fittestEver property
     * keeps track of the fittest member the population has ever produced. This
     * will be updated with the population's current generation's fittest member
     * if their fitness exceeds the record.
     */
    updateFittestEver() {
        const genFittest = this.getFittest();
        if (this.fittestEver == null || genFittest.fitness > this.fittestEver.fitness)
            this.fittestEver = genFittest;
        return this.fittestEver;
    }
    /**
     * Updates the gensSinceImproved counter for each species given
     * whether or not they have improved their fitness since the last generation.
     * If speciation is disabled, this will not be called.
     */
    updateGensSinceImproved() {
        this.speciesList.forEach(species => species.updateGensSinceImproved());
    }
    /**
     * Goes through each species and calls their adjustFitness() methods. Adjusting
     * the fitness will normalize each member's fitness to their individual species.
     * If speciation is disabled, this will not be called.
     */
    adjustFitness() {
        this.speciesList.forEach(species => species.adjustFitness());
    }
    /**
     * Returns the average fitness of all the members in the population.
     * @returns the average fitness of all members
     */
    getAverageFitness() {
        const N = this.members.length;
        return this.members.reduce((sum, curr) => sum + curr.fitness / N, 0);
    }
    /**
     * Returns the average adjusted fitness of all the members in the population.
     * @returns the average adjusted fitness of all members
     */
    getAverageFitnessAdjusted() {
        const N = this.members.length;
        return this.members.reduce((sum, curr) => sum + curr.fitnessAdjusted / N, 0);
    }
    /**
     * Calculates the number of allowed offspring that each species can produce.
     * If speciation is disabled, this calculation will not run and offspring are
     * produced solely by the fittest members of the population.
     */
    calculateAllowedOffspring() {
        const max = this.popSize;
        const avg = this.getAverageFitnessAdjusted();
        const list = [...this.speciesList];
        list.forEach(species => species.allowedOffspring = species.getAverageFitnessAdjusted() / (avg == 0 ? 1 : avg) * species.members.length);
        list.sort((a, b) => {
            const c = a.allowedOffspring - Math.floor(a.allowedOffspring);
            const d = b.allowedOffspring - Math.floor(b.allowedOffspring);
            if (c == d)
                return b.allowedOffspring - a.allowedOffspring;
            return d - c;
        });
        const min = list.reduce((sum, curr) => sum + Math.floor(curr.allowedOffspring), 0);
        const roundUpCount = Math.min(max - min, list.length);
        for (let i = 0; i < roundUpCount; i++) {
            const species = list.shift();
            species.allowedOffspring = Math.ceil(species.allowedOffspring);
        }
        for (let species of list) {
            species.allowedOffspring = Math.floor(species.allowedOffspring);
        }
    }
    /**
     * Produces the next generation of members. If speciation is enabled, it produces them
     * based on the calculation done in the calculateAllowedOffspring() method. If speciation
     * is disabled, members are simply produced based on the fittest members. Elitism will
     * preserve the specified percentage of members in each species when speciation is enabled,
     * otherwise its the percentage of members that gets preserved.
     */
    produceOffspring() {
        if (this.speciation) {
            const speciesList = this.speciesList;
            this.members = [];
            speciesList.forEach(species => {
                const speciesOffspring = species.produceOffspring();
                this.members.push(...speciesOffspring);
                speciesOffspring.forEach(offspring => offspring.species = species);
                species.members = speciesOffspring;
            });
            if (this.members.length < this.popSize) {
                const difference = this.popSize - this.members.length;
                for (let i = 0; i < difference; i++) {
                    this.members.push(new Brain(this).initialize(this.inputN, this.hiddenN, this.outputN, this.enabledChance));
                }
            }
        }
        else {
            const copyOfMembers = [...this.members];
            this.members = this.elitism ? Population.GetElites(this.members, this.popSize) : [];
            const pairings = Population.GeneratePairings(copyOfMembers, this.popSize);
            pairings.forEach(({ p1, p2 }) => this.members.push(Brain.Crossover(p1, p2)));
        }
    }
    /**
     * Goes through all the members in the population and calls their mutate() method.
     */
    mutate() {
        this.members.forEach(member => member.mutate());
    }
    /**
     * Produces the next generation of members for the population. This produces the offspring,
     * increments the generationCounter denoting which generation the current members are, and
     * mutates them.
     */
    nextGeneration() {
        if (this.members.length == 0) {
            this.members = new Array(this.popSize).fill(0)
                .map(() => new Brain(this).initialize(this.inputN, this.hiddenN, this.outputN, this.enabledChance));
        }
        else {
            this.produceOffspring();
            this.generationCounter++;
            this.mutate();
        }
    }
    /**
     * Speciates the current members of the population. If speciation is disabled, this is
     * completely skipped during the evolution process. This speciates members, updates
     * each species gensSinceImproved counters, adjusts the dynamic compatibility threshold,
     * adjusts the fitness of all members, and calculates the allowed offspring for each species.
     */
    speciate() {
        if (this.speciation) {
            Species.Speciate(this);
            this.updateGensSinceImproved();
            this.adjustThreshold();
            this.adjustFitness();
            this.calculateAllowedOffspring();
        }
    }
    /**
     * Static helper method to generate pairings of brains that will serve as parents
     * for the next generation. Parents are chosen based on fitness and rolled through
     * a roulette wheel.
     * @param list the list of parents to choose from
     * @param offspringN the number of offspring desired
     * @returns an array of parent pairings where parents are p1 and p2
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
     * Static helper method to produce an array of elites.
     * @param list the list of members to select elites from
     * @param softLimit the soft limit for the number of elites
     * @returns the elites
     */
    static GetElites(list, softLimit) {
        if (softLimit == 0)
            return [];
        const res = [];
        const sorted = [...list].sort((a, b) => b.fitness - a.fitness);
        const amount = Math.min(Math.round(Population.ElitePercent * list.length), softLimit);
        for (let i = 0; i < amount; i++) {
            const eliteMember = sorted[i];
            eliteMember.isElite = true;
            res.push(eliteMember);
        }
        return res;
    }
    /**
     * Sets the local reference for graphics to the specified object.
     * @param graphics the graphics to set
     * @returns a refrence to this population
     */
    setGraphics(graphics) {
        this.graphics = graphics;
        return this;
    }
    /**
     * Draws this population to the local graphics.
     */
    draw() {
        const round = (x, p) => Math.round(x * 10 ** p) / 10 ** p;
        new TextGraphics(this.graphics, `Generation: ${this.generationCounter} <${this.members.length}>`, 5, 5, '#fff', 20, 'left', 'top').draw();
        const getMemberText = (brain, i) => {
            const a = round(brain.fitness, 5);
            const b = round(brain.fitnessAdjusted, 5);
            return `${i}: ${a} ${this.speciation ? ' -> ' + b : ''}`;
        };
        this.members.slice().sort((a, b) => b.fitness - a.fitness)
            .map((b, i) => new TextGraphics(this.graphics, getMemberText(b, i), 5, 25 + i * 10, '#fff', 10, 'left', 'top'))
            .forEach(member => member.draw());
        if (this.speciation) {
            new TextGraphics(this.graphics, `Species (Threshold: ${Species.DynamicThreshold})`, 250, 5, '#fff', 20, 'left', 'top')
                .draw();
            const getSpeciesText = (species) => {
                const a = species.members.length;
                const b = round(species.getAverageFitness(), 5);
                const c = round(species.getAverageFitnessAdjusted(), 5);
                const d = species.gensSinceImproved;
                return `<${a}, ${d}> ${b} -> ${c}`;
            };
            this.speciesList.map((s, i) => new TextGraphics(this.graphics, getSpeciesText(s), 250, 25 + i * 10, '#fff', 10, 'left', 'top'))
                .forEach(species => species.draw());
        }
    }
}
/** The percent of members who get carried over as elites */
Population.ElitePercent = 0.3;
//# sourceMappingURL=Population.js.map