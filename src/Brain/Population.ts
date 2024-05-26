/**
 * A population is a collection of a bunch of brains and allows for a large amount
 * of brains to explore different topologies. Larger populations allow for solutions
 * to be found quciker. This class also houses the methods necessary to produce the
 * offspring for the next generation.
 */
class Population {
  /** Toggle for speciation between generations */
  static Speciation: boolean = true
  /**
   * Toggle for elitism, where the specified percent of members gets preserved from
   * each generation with no mutations
   */
  static Elitism: boolean = true
  /** The percent of members who get carried over as elites */
  static ElitePercent: number = 0.3

  /** A counter for the current generation */
  generationCounter: number = 0
  /** An array of the population's members */
  members: Brain[] = []
  /** The number of members the population will always have */
  popSize: number
  /** The number of input nodes that members will be initialized with */
  inputN: number
  /** The number of hidden nodes that members will be initialized with */
  hiddenN: number
  /** The number of output nodes that members will be initialized with */
  outputN: number
  /** The enabled connections percent that members will be initialized with */
  enabledChance: number
  /** A reference to the population's fittest member ever */
  fittestEver: Brain
  /** A reference to the graphics object that the population can be drawn to */
  graphics: Graphics

  /**
   * Constructs a population with the specified size, input nodes, hidden nodes, output nodes,
   * and chance for connections to start enabled.
   * @param popSize the population size
   * @param inputN the number of input nodes
   * @param hiddenN the number of hidden nodes
   * @param outputN the number of output nodes
   * @param enabledChance the chance for connections to start enabled
   */
  constructor(popSize: number, inputN: number, hiddenN: number, outputN: number, enabledChance: number = 1) {
    this.popSize = popSize
    this.inputN = inputN
    this.hiddenN = hiddenN
    this.outputN = outputN
    this.enabledChance = enabledChance
  }

  /**
   * The list of all current species that the members are registered to.
   */
  get speciesList(): Species[] {
    const returnArr: Species[] = []
    this.members.forEach(member => {
      if (member.species != null && !returnArr.includes(member.species)) returnArr.push(member.species)
    })
    return returnArr
  }

  /**
   * Adjusts the dynamic compatibility threshold for the species class given the current
   * number of species and the desired amount. If speciation is disabled, this will not be called.
   */
  adjustThreshold(): void {
    Species.DynamicThreshold += Math.sign(this.speciesList.length - Species.TargetSpecies) * Species.DynamicThresholdStepSize
  }

  /**
   * Runs the specified fitness function on the population's members. This keeps track
   * of the fittest member of this iteration as well as the fittest member ever.
   * @param fitnessFunction the fitness function
   * @returns the fittest member of the iteration
   */
  calculateFitness(fitnessFunction: (brain: Brain) => number) {
    for (let i = this.members.length; i < this.popSize; i++) {
      this.members.push(new Brain().initialize(this.inputN, this.hiddenN, this.outputN, this.enabledChance))
    }

    let fittest: Brain
    if (fitnessFunction) {
      for (let b of this.members) {
        fitnessFunction(b)
        if (fittest == null || b.fitness > fittest.fitness) fittest = b
      }
      if (this.fittestEver == null || fittest.fitness > this.fittestEver.fitness) this.fittestEver = fittest
    }

    return this.getFittest()
  }

  /**
   * Returns the fittest member in the current list of members.
   * @returns the fittest member
   */
  getFittest(): Brain {
    return this.members.reduce((best, curr) => curr.fitness > best.fitness ? curr : best)
  }

  /**
   * Updates the gensSinceImproved counter for each species given
   * whether or not they have improved their fitness since the last generation.
   * If speciation is disabled, this will not be called.
   */
  updateGensSinceImproved(): void {
    this.speciesList.forEach(species => species.updateGensSinceImproved())
  }

  /**
   * Goes through each species and calls their adjustFitness() methods. Adjusting
   * the fitness will normalize each member's fitness to their individual species.
   * If speciation is disabled, this will not be called.
   */
  adjustFitness(): void {
    this.speciesList.forEach(species => species.adjustFitness())
  }

  /**
   * Returns the average fitness of all the members in the population.
   * @returns the average fitness of all members
   */
  getAverageFitness(): number {
    const N: number = this.members.length
    return this.members.reduce((sum, curr) => sum + curr.fitness / N, 0)
  }

  /**
   * Returns the average adjusted fitness of all the members in the population.
   * @returns the average adjusted fitness of all members
   */
  getAverageFitnessAdjusted(): number {
    const N: number = this.members.length
    return this.members.reduce((sum, curr) => sum + curr.fitnessAdjusted / N, 0)
  }

  /**
   * Calculates the number of allowed offspring that each species can produce.
   * If speciation is disabled, this calculation will not run and offspring are
   * produced solely by the fittest members of the population.
   */
  calculateAllowedOffspring(): void {
    const max: number = this.popSize
    const avg: number = this.getAverageFitnessAdjusted()
    const list: Species[] = [...this.speciesList]
    list.forEach(species => species.allowedOffspring = species.getAverageFitnessAdjusted() / avg * species.members.length)
    list.sort((a, b) => {
      const c: number = a.allowedOffspring - Math.floor(a.allowedOffspring)
      const d: number = b.allowedOffspring - Math.floor(b.allowedOffspring)
      if (c == d) return b.allowedOffspring - a.allowedOffspring
      return d - c
    })
    const min: number = list.reduce((sum, curr) => sum + Math.floor(curr.allowedOffspring), 0)
    const roundUpCount: number = max - min
    for (let i = 0; i < roundUpCount; i++) {
      const species: Species = list.shift()
      species.allowedOffspring = Math.ceil(species.allowedOffspring)
    }
    for (let species of list) {
      species.allowedOffspring = Math.floor(species.allowedOffspring)
    }
  }

  /**
   * Produces the next generation of members. If speciation is enabled, it produces them
   * based on the calculation done in the calculateAllowedOffspring() method. If speciation
   * is disabled, members are simply produced based on the fittest members. Elitism will
   * preserve the specified percentage of members in each species when speciation is enabled,
   * otherwise its the percentage of members that gets preserved.
   */
  produceOffspring(): void {
    if (Population.Speciation) {
      const speciesList: Species[] = this.speciesList
      this.members = []
      speciesList.forEach(species => {
        species.produceOffspring()
        this.members.push(...species.members)
      })
      if (this.members.length < this.popSize) {
        for (let i = 0; i < this.popSize - this.members.length; i++) {
          this.members.push(new Brain().initialize(this.inputN, this.hiddenN, this.outputN, this.enabledChance))
        }
      }
    } else {
      const copyOfMembers = [...this.members]
      this.members = Population.Elitism ? Population.GetElites(this.members, this.popSize) : []
      const pairings = Population.GeneratePairings(copyOfMembers, this.popSize)
      pairings.forEach(({ p1, p2 }) => this.members.push(Brain.Crossover(p1, p2)))
    }
  }

  /**
   * Goes through all the members in the population and calls their mutate() method.
   */
  mutate(): void {
    this.members.forEach(member => member.mutate())
  }

  /**
   * Produces the next generation of members for the population. This produces the offspring,
   * increments the generationCounter denoting which generation the current members are, and
   * mutates them.
   */
  nextGeneration(): void {
    this.produceOffspring()
    this.generationCounter++
    this.mutate()
  }

  /**
   * Speciates the current members of the population. If speciation is disabled, this is
   * completely skipped during the evolution process. This speciates members, updates
   * each species gensSinceImproved counters, adjusts the dynamic compatibility threshold,
   * adjusts the fitness of all members, and calculates the allowed offspring for each species.
   */
  speciate(): void {
    Species.Speciate(this)
    this.updateGensSinceImproved()
    this.adjustThreshold()
    this.adjustFitness()
    this.calculateAllowedOffspring()
  }

  /**
   * Static helper method to generate pairings of brains that will serve as parents
   * for the next generation. Parents are chosen based on fitness and rolled through
   * a roulette wheel.
   * @param list the list of parents to choose from
   * @param offspringN the number of offspring desired
   * @returns an array of parent pairings where parents are p1 and p2
   */
  static GeneratePairings(list: Brain[], offspringN: number): { p1: Brain, p2: Brain }[] {
    if (offspringN == 0) return []
    const parents: Brain[] = rouletteWheel(list, 'fitness', offspringN * 2)
    return new Array(offspringN).fill(0).map(() => {
      return { p1: parents.pop(), p2: parents.pop() }
    })
  }

  /**
   * Static helper method to produce an array of elites.
   * @param list the list of members to select elites from
   * @param softLimit the soft limit for the number of elites
   * @returns the elites
   */
  static GetElites(list: Brain[], softLimit: number): Brain[] {
    if (softLimit == 0) return []
    const res: Brain[] = []
    const sorted: Brain[] = [...list].sort((a, b) => b.fitness - a.fitness)
    const amount: number = Math.min(Math.round(Population.ElitePercent * list.length), softLimit)
    for (let i = 0; i < amount; i++) {
      const eliteMember: Brain = sorted[i]
      eliteMember.isElite = true
      res.push(eliteMember)
    }
    return res
  }

  /**
   * Sets the local reference for graphics to the specified object.
   * @param graphics the graphics to set
   * @returns a refrence to this population
   */
  setGraphics(graphics: Graphics): Population {
    this.graphics = graphics
    return this
  }

  /**
   * Draws this population to the local graphics.
   */
  draw(): void {
    const round = (x, p) => Math.round(x * 10 ** p) / 10 ** p

    this.graphics.bg()
    new TextGraphics(this.graphics, `Generation: ${this.generationCounter} <${this.members.length}>`,
      5, 5, '#fff', 20, 'left', 'top').draw()

    let getMemberText = (brain, i) => {
      let b = i
      let c = round(brain.fitness, 5)
      let d = round(brain.fitnessAdjusted, 5)
      return `${b}: ${c} ${Population.Speciation ? ' -> ' + d : ''}`
    }
    this.members.slice().sort((a, b) => b.fitness - a.fitness).slice(0, 50)
      .map((b, i) => new TextGraphics(this.graphics, getMemberText(b, i), 5, 25 + i * 10, '#fff', 10, 'left', 'top'))
      .forEach(member => member.draw())

    if (Population.Speciation) {
      new TextGraphics(this.graphics, `Species (Threshold: ${Species.DynamicThreshold})`,
        250, 5, '#fff', 20, 'left', 'top')
        .draw()

      let getSpeciesText = species => {
        let a = species.members.length
        let b = round(species.getAverageFitness(), 5)
        let c = round(species.getAverageFitnessAdjusted(), 5)
        return `<${a}> ${b} -> ${c}`
      }
      this.speciesList.map((s, i) => new TextGraphics(this.graphics, getSpeciesText(s), 250, 25 + i * 10, '#fff', 10, 'left', 'top'))
        .forEach(species => species.draw())
    }
  }
}