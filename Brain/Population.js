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

  /**
   * @param {Graphics} graphics 
   * @returns {Population}
   */
  setGraphics(graphics) {
    this.graphics = graphics
    return this
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
    const max = this.popSize
    const avg = this.getAverageFitnessAdjusted()
    const list = [...this.speciesList]
    list.forEach(x => x.temp = x.getAverageFitnessAdjusted() / avg * x.members.length)
    list.sort((a, b) => {
      const c = a.temp - Math.floor(a.temp)
      const d = b.temp - Math.floor(b.temp)
      if (c == d) return b.temp - a.temp
      return d - c
    })
    const min = list.reduce((sum, curr) => sum + Math.floor(curr.temp), 0)
    const roundUpCount = max - min
    for (let i = 0; i < roundUpCount; i++) {
      const x = list.shift()
      x.allowedOffspring = Math.ceil(x.temp)
      delete x.temp
    }
    for (let x of list) {
      x.allowedOffspring = Math.floor(x.temp)
      delete x.temp
    }
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
    // this falls under species stuff
    Species.Speciate(this)
    this.updateGensSinceImproved()
    this.adjustThreshold()
    this.adjustFitness()
    // this doesn't
    this.calculateAllowedOffspring()
  }

  /**
   * @param {Brain[]} list 
   * @param {number} count 
   */
  static GeneratePairings(list, count) {
    if (count == 0) return []
    const parents = rouletteWheel(list, 'fitness', count * 2)
    const res = new Array(count).fill(0).map(() => {
      return { p1: parents.pop(), p2: parents.pop() }
    })
    return res
  }

  /**
   * @param {Brain[]} list 
   * @param {number} softLimit 
   */
  static GetElites(list, softLimit) {
    if (softLimit == 0) return []
    const res = []
    const sorted = [...list].sort((a, b) => b.fitness - a.fitness)
    const count = Math.min(Math.round(Population.ElitePercent * list.length), softLimit)
    for (let i = 0; i < count; i++) {
      const eliteMember = sorted[i]
      eliteMember.isElite = true
      res.push(eliteMember)
    }
    return res
  }

  draw() {
    const round = (x, p) => Math.round(x * 10 ** p) / 10 ** p

    this.graphics.bg()
    new GraphicsText(this.graphics, `Generation: ${this.generationCounter} <${this.members.length}>`,
      5, 5, '#fff', 20, 'left', 'top').draw()

    let getMemberText = (brain, i) => {
      let b = i
      let c = round(brain.fitness, 5)
      let d = round(brain.fitnessAdjusted, 5)
      return `${b}: ${c} -> ${d}`
    }
    this.members.slice().sort((a, b) => b.fitness - a.fitness).slice(0, 50)
      .map((b, i) => new GraphicsText(this.graphics, getMemberText(b, i), 5, 25 + i * 10, '#fff', 10, 'left', 'top'))
      .forEach(member => member.draw())

    new GraphicsText(this.graphics, `Species (Threshold: ${Species.DynamicThreshold})`,
      250, 5, '#fff', 20, 'left', 'top')
      .draw()

    let getSpeciesText = species => {
      let a = species.members.length
      let b = round(species.getAverageFitness(), 5)
      let c = round(species.getAverageFitnessAdjusted(), 5)
      return `<${a}> ${b} -> ${c}`
    }
    this.speciesList.map((s, i) => new GraphicsText(this.graphics, getSpeciesText(s), 250, 25 + i * 10, '#fff', 10, 'left', 'top'))
      .forEach(species => species.draw())
  }
}