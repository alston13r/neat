class Population {
  static Speciation = true // add toggling
  static Elitism = true
  static ElitePercent = 0.3
  static Generation = 0

  constructor(popSize, inputN, hiddenN, outputN, connPerc) {
    this.popSize = popSize
    this.inputN = inputN
    this.hiddenN = hiddenN
    this.outputN = outputN
    this.connPerc = connPerc
    this.members = []
    this.generationCounter = 0
  }

  get speciesList() {
    let speciesList = []
    for (let m of this.members) {
      if (!speciesList.includes(m.species) && m.species != null) speciesList.push(m.species)
    }
    return speciesList
  }

  adjustThreshold() {
    Species.DynamicThreshold += Math.sign(this.speciesList.length - Species.TargetSpecies) * Species.DynamicThresholdStepSize
  }

  /**
   * @param {function(Brain): void} fitnessFunction 
   * @returns {Brain | null}
   */
  generation(fitnessFunction) {
    for (let i = this.members.length; i < this.popSize; i++) {
      this.members.push(new Brain().initialize(this.inputN, this.hiddenN, this.outputN, this.connPerc))
    }

    let fittest
    if (fitnessFunction) {
      for (let b of this.members) {
        fitnessFunction(b)
        if (fittest == null || b.fitness > fittest.fitness) fittest = b
      }
      if (this.fittestEver == null || fittest.fitness > this.fittestEver.fitness) this.fittestEver = fittest
    }

    this.fittest = this.members.reduce((best, curr) => curr.fitness > best.fitness ? curr : best)

    return fittest
  }

  getFittest() {
    return this.members.reduce((best, curr) => curr.fitness > best.fitness ? curr : best)
  }

  updateGensSinceImproved() {
    for (let species of this.speciesList) {
      species.updateGensSinceImproved()
    }
  }

  adjustFitness() {
    for (let m of this.members) {
      m.adjustFitness()
    }
  }

  getAverageFitness() {
    return this.members.reduce((sum, curr) => sum + curr.fitness / this.members.length, 0)
  }

  getAverageFitnessAdjusted() {
    return this.members.reduce((sum, curr) => sum + curr.fitnessAdjusted / this.members.length, 0)
  }

  calculateAllowedOffspring() {
    const globalAvg = this.getAverageFitnessAdjusted()

    const max = this.popSize

    let arr = this.speciesList.map(species => {
      return { species, temp: species.getAverageFitnessAdjusted() / globalAvg * species.members.length }
    })
    let maxCalculated = arr.reduce((sum, curr) => sum + curr.temp, 0)
    arr.forEach(x => {
      x.temp = max * x.temp / maxCalculated
    })
    arr.sort((a, b) => {
      let c = a.temp - Math.floor(a.temp)
      let d = b.temp - Math.floor(b.temp)
      if (c == d) return a.temp - b.temp
      return c - d
    })

    const min = arr.reduce((sum, curr) => sum + Math.floor(curr.temp), 0)
    const diff = max - min
    for (let i = 0; i < diff && arr.length > 0; i++) {
      let t = arr.pop()
      t.species.allowedOffspring = Math.ceil(t.temp)
    }
    arr.forEach(t => t.species.allowedOffspring = Math.floor(t.temp))

    // let sumCalculated = arr.reduce((sum, curr) => sum + curr.species.allowedOffspring, 0)
    // for (let i = max; i < sumCalculated; i++) {
    //   let largest = arr.reduce((largest, curr) => curr.species.allowedOffspring > largest.species.allowedOffspring ? curr : largest)
    //   largest.species.allowedOffspring--
    // }
  }

  produceOffspring() {
    let t = this.speciesList
    this.members = []
    for (let s of t) {
      s.produceOffspring()
      this.members.push(...s.members)
    }
    if (this.members.length < this.popSize) {
      let d = this.popSize - this.members.length
      for (let i = 0; i < d; i++) {
        this.members.push(new Brain().initialize(this.inputN, this.hiddenN, this.outputN, this.connPerc))
      }
    }
  }

  mutate() {
    for (let x of this.members) {
      x.mutate()
    }
  }

  step1() {
    this.produceOffspring()
    this.generationCounter++
    this.mutate()
  }

  step2() {
    Species.Speciate(this)
    this.updateGensSinceImproved()
    this.adjustThreshold()
    this.adjustFitness()
    this.calculateAllowedOffspring()
  }

  /**
   * @param {Graphics} graphics 
   */
  draw(graphics) {
    const round = (x, p) => Math.round(x * 10 ** p) / 10 ** p

    graphics.bg()
    let popHeader = new GraphicsText(`Generation: ${this.generationCounter} <${this.members.length}>`, 0, 0)

    let getMemberText = (brain, i) => {
      let b = i
      let c = round(brain.fitness, 5)
      let d = round(brain.fitnessAdjusted, 5)
      return `${b}: ${c} -> ${d}`
    }
    let members = [...this.members].sort((a, b) => b.fitness - a.fitness)
      .map((b, i) => new GraphicsText(getMemberText(b, i), 0, i * 10))
    graphics.listText(5, 5, members, '#fff', 10, popHeader, '#fff', 20)

    let speciesOffset = 250
    let speciesHeader = new GraphicsText(`Species (Threshold: ${Species.DynamicThreshold})`, 0, 0)

    let getSpeciesText = species => {
      let b = species.members.length
      let c = round(species.getAverageFitness(), 5)
      let d = round(species.getAverageFitnessAdjusted(), 5)
      return `Members: ${b}, Average Fitness: ${c}, Average Fitness Adjusted: ${d}`
    }
    let speciesList = this.speciesList.map((s, i) => new GraphicsText(getSpeciesText(s), 0, i * 10))
    graphics.listText(speciesOffset, 5, speciesList, '#fff', 10, speciesHeader, '#fff', 20)
  }
}