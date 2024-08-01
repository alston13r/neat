/**
 * A population is a collection of a bunch of brains and allows for a large amount
 * of brains to explore different topologies. Larger populations allow for solutions
 * to be found quciker. This class also houses the methods necessary to produce the
 * offspring for the next generation.
 */
class Population {
  /** Toggle for speciation between generations */
  static Speciation = true
  /** Toggle for elitism */
  static Elitism = true
  /** The percent of members who get carried over as elites */
  static ElitePercent = 0.3

  /** A counter for the current generation */
  generationCounter = 0
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
  /** Array of all current species */
  speciesList: Species[] = []

  /**
   * Constructs a population with the specified size, input nodes, hidden nodes, output nodes,
   * and chance for connections to start enabled.
   * @param popSize the population size
   * @param inputN the number of input nodes
   * @param hiddenN the number of hidden nodes
   * @param outputN the number of output nodes
   * @param enabledChance the chance for connections to start enabled
   */
  constructor(popSize: number, inputN: number, hiddenN: number, outputN: number, enabledChance = 1) {
    this.popSize = popSize
    this.inputN = inputN
    this.hiddenN = hiddenN
    this.outputN = outputN
    this.enabledChance = enabledChance
  }

  /**
   * Adjusts the dynamic compatibility threshold for the species class given the current
   * number of species and the desired amount. If speciation is disabled, this will not be called.
   */
  adjustDynamicThreshold() {
    Species.DynamicThreshold += Math.sign(this.speciesList.length - Species.TargetSpecies) * Species.DynamicThresholdStepSize
  }

  /**
   * Returns the fittest member in the current list of members.
   * @returns the fittest member
   */
  getFittest() {
    return this.members.reduce((best, curr) => Brain.GetFitter(best, curr))
  }

  /**
   * Updates this population's fittest member ever. The fittestEver property
   * keeps track of the fittest member the population has ever produced. This
   * will be updated with the population's current generation's fittest member
   * if their fitness exceeds the record.
   */
  updateFittestEver() {
    const genFittest = this.getFittest()
    if (this.fittestEver == null) this.fittestEver = genFittest
    else this.fittestEver = Brain.GetFitter(this.fittestEver, genFittest)
    return this.fittestEver
  }

  /**
   * Updates the gensSinceImproved counter for each species given
   * whether or not they have improved their fitness since the last generation.
   * If speciation is disabled, this will not be called.
   */
  updateGensSinceImproved() {
    this.speciesList.forEach(species => species.updateGensSinceImproved())
  }

  /**
   * Returns the average fitness of all the members in the population.
   * @returns the average fitness of all members
   */
  getAverageFitness() {
    const N = this.members.length
    return this.members.reduce((sum, curr) => sum + (N == 0 ? 0 : curr.fitness / N), 0)
  }

  /**
   * Calculates the number of allowed offspring that each species can produce.
   * If speciation is disabled, this calculation will not run and offspring are
   * produced solely by the fittest members of the population.
   */
  calculateAllowedOffspring() {
    const maxSize = this.popSize
    const speciesList = [...this.speciesList]
    const items = speciesList.map(species => {
      return {
        fitness: species.getAverageFitnessAdjusted(),
        species,
        length: species.members.length
      }
    })

    const avg = items.reduce((sum, curr) => sum + curr.fitness * curr.length, 0) / maxSize
    items.forEach(item => item.species.allowedOffspring = item.fitness / (avg == 0 ? 1 : avg) * item.length)

    // ensure that the allowed offspring values are whole numbers and total
    // to the population size
    roundNicely(speciesList, 'allowedOffspring', maxSize)
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
      this.members = []
      this.speciesList.forEach(species => {
        const speciesOffspring = species.produceOffspring()
        this.members.push(...speciesOffspring)
        speciesOffspring.forEach(offspring => offspring.species = species)
        species.members = speciesOffspring
      })

      this.speciesList = this.speciesList.filter(s => s.members.length > 0)

      if (this.members.length < this.popSize) {
        const difference = this.popSize - this.members.length
        for (let i = 0; i < difference; i++) {
          this.members.push(new Brain().initialize(this.inputN, this.hiddenN, this.outputN, this.enabledChance))
        }
      }
    } else {
      const copyOfMembers = [...this.members]
      if (Population.Elitism) Population.GetElites(this.members, copyOfMembers, this.popSize)
      else this.members.length = 0
      const parents: Brain[] = []
      Population.GeneratePairings(parents, copyOfMembers, this.popSize - this.members.length)
      for (let i = 0; i < parents.length; i += 2) {
        this.members.push(Brain.Crossover(parents[i], parents[i + 1]))
      }
    }
  }

  /**
   * Goes through all the members in the population and calls their mutate() method.
   */
  mutate() {
    this.members.forEach(member => member.mutate())
  }

  /**
   * Produces the next generation of members for the population. This produces the offspring,
   * increments the generationCounter denoting which generation the current members are, and
   * mutates them.
   */
  nextGeneration() {
    if (this.members.length == 0) {
      this.members = new Array(this.popSize).fill(0)
        .map(() => new Brain().initialize(this.inputN, this.hiddenN, this.outputN, this.enabledChance))
    } else {
      this.produceOffspring()
      this.generationCounter++
      this.mutate()
    }
  }

  /**
   * Speciates the current members of the population. If speciation is disabled, this is
   * completely skipped during the evolution process. This speciates members, updates
   * each species gensSinceImproved counters, adjusts the dynamic compatibility threshold,
   * adjusts the fitness of all members, and calculates the allowed offspring for each species.
   */
  speciate() {
    if (Population.Speciation) {
      Species.Speciate(this)
      this.updateGensSinceImproved()
      this.adjustDynamicThreshold()
      this.calculateAllowedOffspring()
    }
  }

  /**
   * Conducts a roulette wheel selection on the list of brains passed in
   * based on their fitness values. A roulette wheel assigns a portion of
   * a wheel to each brain in the list. Brains with higher fitness values
   * take up larger portions of the wheel. The wheel is then spun and the
   * brain corresponding to the portion of the wheel that was selected is
   * passed into the out array.
   * @param out the array to put the selections in
   * @param list the list to select brains from
   * @param count the number of brains to select
   * @returns the selections
   */
  static RouletteWheel(out: Brain[], list: Brain[], count: number) {
    if (count == 0 || list.length == 0) {
      out.length = 0
      return out
    }
    if (list.length == 1) {
      out.fill(list[0])
      return out
    }

    const items: RouletteWheelItem[] = list.map(item => ({ brain: item, value: item.fitness, sum: 0 }))
    const max = items.reduce((sum, curr) => {
      curr.sum = sum + curr.value
      return curr.sum
    }, 0)

    for (let i = 0; i < count; i++) {
      const value = Math.random() * max
      search: for (const item of items) {
        if (value < item.sum) {
          out[i] = item.brain
          break search
        }
      }
    }

    return out
  }

  /**
   * Generates a selection of brains that will be the parents of the
   * next generation. Selections are made through the
   * {@link Population.RouletteWheel RouletteWheel} method where the
   * wheel is portioned out by fitness values.
   * @param out the array to put the pairings in
   * @param list the list of brains
   * @param count the number of pairs to select
   * @returns the array of pairings
   */
  static GeneratePairings(out: Brain[], list: Brain[], count: number) {
    if (count == 0) {
      out.length = 0
      return out
    }
    out.length = count * 2
    return this.RouletteWheel(out, list, count * 2)
  }

  /**
   * Static helper method to produce an array of elites.
   * @param out the array to put the elites in
   * @param list the list of members to select elites from
   * @param limit the limit for the number of elites
   * @returns the elites
   */
  static GetElites(out: Brain[], list: Brain[], limit: number) {
    out.length = 0
    if (limit == 0) return out
    list.sort((a, b) => b.fitness - a.fitness)
    const N = Math.min(limit, Math.round(Population.ElitePercent * list.length))
    for (let i = 0; i < N; i++) {
      out[i] = list[i]
      out[i].isElite = true
    }
    return out
  }

  /**
   * Draws this population to the local graphics.
   */
  draw(g: Graphics) {
    g.textBaseline = 'top'
    g.textAlign = 'left'
    g.fillStyle = '#fff'
    g.font = '20px arial'
    g.fillText(`Generation: ${this.generationCounter} <${this.members.length}>`, 5, 5)

    const getMemberText = (brain: Brain, i: number) => {
      const a = brain.fitness.toPrecision(6)
      const b = (brain.fitness / brain.species.members.length).toPrecision(6)
      return `${i + 1}: ${a} ${Population.Speciation ? ' -> ' + b : ''}`
    }
    g.font = '10px arial'
    this.members.slice()
      .sort((a, b) => b.fitness - a.fitness)
      .slice(0, 50)
      .forEach((brain, i) => {
        g.fillText(getMemberText(brain, i), 5, 25 + i * 10)
      })

    if (Population.Speciation) {
      g.font = '20px arial'
      g.fillText(`Species (Threshold: ${Species.DynamicThreshold})`, 240, 5)

      const getSpeciesText = (species: Species) => {
        const a = species.members.length
        const b = species.getAverageFitness().toPrecision(6)
        const c = species.getAverageFitnessAdjusted().toPrecision(6)
        const d = species.gensSinceImproved
        return `<${a}, ${d}> ${b} -> ${c}`
      }
      g.font = '10px arial'
      this.speciesList
        .sort((a, b) => b.members.length - a.members.length)
        .slice(0, 50)
        .forEach((s, i) => g.fillText(getSpeciesText(s), 240, 25 + i * 10))
    }
  }

  static GetPresets() {
    return {
      'Speciation': Population.Speciation,
      'Elitism': Population.Elitism,
      'ElitePercent': Population.ElitePercent
    }
  }
}