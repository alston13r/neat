/**
 * TODO
 */
class Species {
  static ExcessFactor: number = 1
  static DisjointFactor: number = 1
  static WeightFactor: number = 0.4
  static GenerationPenalization: number = 15
  static SpeciesIndex = 0
  static TargetSpecies = 10
  static DynamicThreshold = 100
  static DynamicThresholdStepSize = 0.5

  members: Brain[] = []
  allowedOffspring: number = 0
  gensSinceImproved: number = 0
  highestFitness: number = 0

  /**
   * TODO
   * @param brainA 
   * @param brainB 
   * @returns 
   */
  static Compare(brainA: Brain, brainB: Brain): number {
    const enabledA: Connection[] = brainA.connections.filter(connection => connection.enabled)
      .sort((connectionA, connectionB) => connectionA.innovationID - connectionB.innovationID)
    const enabledB: Connection[] = brainB.connections.filter(connection => connection.enabled)
      .sort((connectionA, connectionB) => connectionA.innovationID - connectionB.innovationID)

    const N = Math.max(enabledA.length, enabledB.length)

    let disjoint = 0
    let excess = 0
    let weights = 0

    let i = 0
    let j = 0
    const maxI = enabledA.length - 1
    const maxJ = enabledB.length - 1

    while (i <= maxI && j <= maxJ) {
      const currLeft = enabledA[i]
      const currRight = enabledB[j]
      const leftID = currLeft.innovationID
      const rightID = currRight.innovationID
      let di = 1
      let dj = 1
      if (leftID == rightID) {
        weights += Math.abs(currLeft.weight - currRight.weight)
      } else if (leftID < rightID) {
        if (i == maxI) excess++
        else {
          disjoint++
          dj = 0
        }
      } else {
        if (j == maxJ) excess++
        else {
          disjoint++
          di = 0
        }
      }
      if (i == maxI) di = 0
      if (j == maxJ) dj = 0
      if (i == maxI && j == maxJ) break
      i += di
      j += dj
    }

    excess *= Species.ExcessFactor / N
    disjoint *= Species.DisjointFactor / N
    weights *= Species.WeightFactor

    return excess + disjoint + weights
  }

  /**
   * TODO
   */
  adjustFitness(): void {
    const N: number = this.members.length
    this.members.forEach(member => {
      member.fitnessAdjusted = member.fitness / N
    })
  }

  /**
   * TODO
   * @returns 
   */
  getAverageFitness(): number {
    return this.members.reduce((sum, curr) => sum + curr.fitness / this.members.length, 0)
  }

  /**
   * TODO
   * @returns 
   */
  getAverageFitnessAdjusted(): number {
    return this.members.reduce((sum, curr) => sum + curr.fitnessAdjusted / this.members.length, 0)
  }

  /**
   * TODO
   */
  updateGensSinceImproved(): void {
    const max: number = this.members.reduce((best, curr) => Math.max(best, curr.fitness), 0)
    if (max > this.highestFitness) {
      this.gensSinceImproved = 0
      this.highestFitness = max
    }
    else this.gensSinceImproved++
  }

  /**
   * TODO
   * @param population 
   */
  static Speciate(population: Population): void {
    const speciesList: Species[] = population.speciesList
    const champions: Brain[] = []
    for (let species of speciesList) {
      const champion: Brain = species.members.splice(Math.floor(Math.random() * species.members.length), 1)[0]
      champions.push(champion)
      species.members.forEach(member => member.species = null)
      species.members = [champion]
    }

    const toSpeciate: Brain[] = population.members.filter(member => member.species == null)

    for (let champion of champions) {
      const count: number = toSpeciate.length
      for (let i = 0; i < count; i++) {
        const brain: Brain = toSpeciate.shift()
        const result: number = Species.Compare(champion, brain)
        if (result <= Species.DynamicThreshold) {
          brain.species = champion.species
          brain.species.members.push(brain)
        } else toSpeciate.push(brain)
      }
    }

    while (toSpeciate.length > 0) {
      const champion: Brain = toSpeciate.splice(Math.floor(Math.random() * toSpeciate.length), 1)[0]
      champion.species = new Species()
      champion.species.members.push(champion)
      const count = toSpeciate.length
      for (let i = 0; i < count; i++) {
        const brain: Brain = toSpeciate.shift()
        const result: number = Species.Compare(champion, brain)
        if (result <= Species.DynamicThreshold) {
          brain.species = champion.species
          brain.species.members.push(brain)
        } else toSpeciate.push(brain)
      }
    }
  }

  /**
   * TODO
   */
  produceOffspring(): void {
    if (this.allowedOffspring == 0 || this.gensSinceImproved > Species.GenerationPenalization) {
      this.members = []
    } else {
      const copyOfMembers: Brain[] = [...this.members]
      this.members = Population.Elitism ? Population.GetElites(this.members, this.allowedOffspring) : []

      const remainingCount: number = this.allowedOffspring - this.members.length
      const pairings: { p1: Brain, p2: Brain }[] = Population.GeneratePairings(copyOfMembers, remainingCount)

      pairings.forEach(({ p1, p2 }) => Brain.Crossover(p1, p2))
    }
  }
}