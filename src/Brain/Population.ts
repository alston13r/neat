// @ts-nocheck
/**
 * TODO
 */
class Population {
  static Speciation: boolean = true
  static Elitism: boolean = true
  static ElitePercent: number = 0.3

  generationCounter: number = 0
  members: Brain[] = []
  popSize: number
  inputN: number
  hiddenN: number
  outputN: number
  enabledChance: number
  graphics: Graphics

  /**
   * TODO
   * @param popSize 
   * @param inputN 
   * @param hiddenN 
   * @param outputN 
   * @param enabledChance 
   */
  constructor(popSize: number, inputN: number, hiddenN: number, outputN: number, enabledChance: number = 1) {
    this.popSize = popSize
    this.inputN = inputN
    this.hiddenN = hiddenN
    this.outputN = outputN
    this.enabledChance = enabledChance
  }

  /**
   * TODO
   */
  setGraphics(graphics: Graphics): Brain {
    this.graphics = graphics
    return this
  }

  /**
   * TODO
   */
  get speciesList(): Species[] {
    const returnArr: Species[] = []
    this.members.forEach(member => {
      if (member.species != null && !returnArr.includes(member.species)) returnArr.push(member.species)
    })
    return returnArr
  }

  /**
   * TODO
   */
  adjustThreshold(): void {
    Species.DynamicThreshold += Math.sign(this.speciesList.length - Species.TargetSpecies) * Species.DynamicThresholdStepSize
  }

  // /**
  //  * @param {function(Brain): void} fitnessFunction 
  //  * @returns {Brain | null}
  //  */
  calculateFitness(fitnessFunction) {
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

  /**
   * TODO
   * @returns 
   */
  getFittest(): Brain {
    return this.members.reduce((best, curr) => curr.fitness > best.fitness ? curr : best)
  }

  /**
   * TODO
   */
  updateGensSinceImproved(): void {
    this.speciesList.forEach(species => species.updateGensSinceImproved())
  }

  /**
   * TODO
   */
  adjustFitness(): void {
    this.speciesList.forEach(species => species.adjustFitness())
  }

  /**
   * TODO
   * @returns 
   */
  getAverageFitness(): number {
    const N: number = this.members.length
    return this.members.reduce((sum, curr) => sum + curr.fitness / N, 0)
  }

  /**
   * 
   * @returns 
   */
  getAverageFitnessAdjusted(): number {
    const N: number = this.members.length
    return this.members.reduce((sum, curr) => sum + curr.fitnessAdjusted / N, 0)
  }

  /**
   * TODO
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
   * TODO
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
   * TODO
   */
  mutate(): void {
    this.members.forEach(member => member.mutate())
  }

  /**
   * TODO
   */
  nextGeneration(): void {
    this.produceOffspring()
    this.generationCounter++
    this.mutate()
  }

  /**
   * TODO
   */
  speciate(): void {
    Species.Speciate(this)
    this.updateGensSinceImproved()
    this.adjustThreshold()
    this.adjustFitness()
    this.calculateAllowedOffspring()
  }

  /**
   * TODO
   * @param list 
   * @param offspringN 
   * @returns 
   */
  static GeneratePairings(list: Brain[], offspringN: number): { p1: Brain, p2: Brain }[] {
    if (offspringN == 0) return []
    const parents: Brain[] = rouletteWheel(list, 'fitness', offspringN * 2)
    return new Array(offspringN).fill(0).map(() => {
      return { p1: parents.pop(), p2: parents.pop() }
    })
  }

  /**
   * TODO
   * @param list 
   * @param softLimit 
   * @returns 
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

  draw() {
    const round = (x, p) => Math.round(x * 10 ** p) / 10 ** p

    this.graphics.bg()
    new GraphicsText(this.graphics, `Generation: ${this.generationCounter} <${this.members.length}>`,
      5, 5, '#fff', 20, 'left', 'top').draw()

    let getMemberText = (brain, i) => {
      let b = i
      let c = round(brain.fitness, 5)
      let d = round(brain.fitnessAdjusted, 5)
      return `${b}: ${c} ${Population.Speciation ? ' -> ' + d : ''}`
    }
    this.members.slice().sort((a, b) => b.fitness - a.fitness).slice(0, 50)
      .map((b, i) => new GraphicsText(this.graphics, getMemberText(b, i), 5, 25 + i * 10, '#fff', 10, 'left', 'top'))
      .forEach(member => member.draw())

    if (Population.Speciation) {
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
}