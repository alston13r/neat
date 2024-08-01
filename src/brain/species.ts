/**
 * A species is a group of brains that have similar topologies. Two brains will
 * belong to the same species if their differences, as calculated in the static
 * Compare() method, are below the dynamic threshold. The dynamic threshold will
 * adjust depending on the current number of species present in the population
 * and the desired number.
 */
class Species {
  /** The weight that excess connections have in the compatibility difference */
  static ExcessFactor = 1
  /** The weight that disjoint connections have in the compatibility difference */
  static DisjointFactor = 1
  /** The weight that the average of weight difference have in the compatibility difference  */
  static WeightFactor = 0.4
  /** The number of generations that a species can run for simultaneously without improvement without being penalized */
  static GenerationPenalization = 15
  /** The current target number of species */
  static TargetSpecies = 10
  /** The current compatibility threshold used for comparisons */
  static DynamicThreshold = 100
  /** The compatibility threshold step size */
  static DynamicThresholdStepSize = 0.5

  /** An array of this species' members */
  members: Brain[] = []
  /** The number of allowed offspring this species can produce */
  allowedOffspring = 0
  /** The number of generations since this species has improved */
  gensSinceImproved = 0
  /** Record of this species' highest fitness value */
  highestFitness = 0

  /**
   * Compares two topologies based on connections. The comparison is a weighted
   * sum of the pairing's disjoint, excess, and overlapping connections. Disjoint
   * connections are ones that don't exist in the other topology. Excess are
   * connections that have innovation IDs outside the range of the other topology.
   * The overlapping connections are combined into an average difference of weights.
   * The more similar two topologies are, the closer to 0 this method returns. If
   * the value falls below the compatibility threshold, they belong to the same
   * species. This was derived from a big truth table and a lot of boolean algebra, see
   * {@link https://docs.google.com/spreadsheets/d/1vLFl3Y7DDsnzVoI0IpjJZIh0uJcby4OsPjn-gxxWptY/edit?usp=sharing | Google Sheets}.
   * @param brainA the first topology
   * @param brainB the second topology
   * @returns compatibility of the topologies
   */
  static Compare(brainA: Brain, brainB: Brain) {
    const enabledA = brainA.getSortedConnections()
    const enabledB = brainB.getSortedConnections()
    const lenA = enabledA.length
    const lenB = enabledB.length
    const N = Math.max(lenA, lenB)

    let disjoint = 0
    let excess = 0
    let weights = 0

    let A = false
    let B = false
    let C = false
    let D = false
    let E = false
    let F = false
    let G = false
    let H = false

    let i = 0
    let j = 0
    const iMax = lenA - 1
    const jMax = lenB - 1

    const iterMax = lenA + lenB
    for (let iter = 0; iter < iterMax; iter++) {
      if (H) {
        excess += iMax - i + jMax - j + 1
        break
      }

      const left = enabledA[i]
      const right = enabledB[j]
      const leftID = left.innovationID
      const rightID = right.innovationID

      C = i == iMax
      D = j == jMax
      E = leftID < rightID
      F = leftID > rightID
      G = leftID == rightID
      A = !C
      B = !D

      if (G) weights += Math.abs(left.weight - right.weight)
      else {
        disjoint++
        H = D && F && !E || C && E && !F
        if (H) excess++
        else {
          A &&= E
          B &&= F
        }
      }

      if (!A && !B) break
      if (A) i++
      if (B) j++
    }

    return disjoint * Species.DisjointFactor / N + excess * Species.ExcessFactor / N + weights * Species.WeightFactor
  }

  /**
   * Returns the average fitness of all members in this species.
   * @returns the average fitness
   */
  getAverageFitness() {
    const N = this.members.length
    return this.members.reduce((sum, curr) => sum + (N == 0 ? 0 : curr.fitness / N), 0)
  }

  /**
   * Returns the average adjusted fitness of all members in this species.
   * The adjusted fitness of a member is their fitness normalized to their
   * species, fitness / N, where N is the size of the species.
   * @returns the average adjusted fitness
   */
  getAverageFitnessAdjusted() {
    const N = this.members.length
    return (N == 0 ? 0 : this.getAverageFitness() / N)
  }

  /**
   * Updates the gensSinceImproved counter to indicate the number of generations
   * that have passed since this species has improved. This means that it has
   * produced a member with a fitness greater than the recorded highest.
   */
  updateGensSinceImproved() {
    const max = this.members.reduce((best, curr) => Math.max(best, curr.fitness), 0)
    if (max > this.highestFitness) {
      this.gensSinceImproved = 0
      this.highestFitness = max
    }
    else this.gensSinceImproved++
  }

  /**
   * Speciates the population, placing every member into a species. This works
   * by selecting champions from either a preexisting set of species or a group
   * of unspeciated members. Then, the rest of the members are compared to these
   * champions and placed into their corresponding species.
   * @param population the population to speciate
   */
  static Speciate(population: Population) {
    // get any preexisting species
    const speciesList = population.speciesList
    const champions: Brain[] = []
    // select champions from each one and store them in an array
    for (let species of speciesList) {
      const champion = species.members.splice(Math.floor(Math.random() * species.members.length), 1)[0]
      champions.push(champion)
      // clear species field for all other species members
      species.members.forEach(member => member.species = null)
      species.members = [champion]
    }

    // store all remaining and unspeciated members in an array
    const toSpeciate = population.members.filter(member => member.species == null)
    // while loop to go over each unspeciated member
    while (toSpeciate.length > 0) {
      // there can either be an array of champions from the previous generation
      // or no champions
      let champion: Brain
      // this selects a random champion from the unspeciated array
      if (champions.length == 0) {
        champion = toSpeciate.splice(Math.floor(Math.random() * toSpeciate.length), 1)[0]
        // create a species for the champion
        champion.species = new Species()
        champion.species.members.push(champion)
      }
      // this takes a champion from the front of the champions array
      else champion = champions.shift()

      // for loop to go over the remaining members of the unspeciated array
      // this will group them together with the champion if they are
      // compatible or throw them back at the end of the array
      const count = toSpeciate.length
      for (let i = 0; i < count; i++) {
        const brain = toSpeciate.shift()
        if (Species.Compare(champion, brain) <= Species.DynamicThreshold) {
          brain.species = champion.species
          brain.species.members.push(brain)
        } else toSpeciate.push(brain)
      }
    }
  }

  /**
   * Produces the next generation's offspring and returns an array of them.
   * If the allowed number of offspring is 0, this returns an empty array. The
   * offspring are first set to include the previous generation's elites and
   * any remaining spots are produced by crossover between two parents rolled
   * by a roulette wheel.
   */
  produceOffspring(): Brain[] {
    if (this.allowedOffspring == 0 || this.gensSinceImproved > Species.GenerationPenalization) {
      return []
    } else {
      const offspring = Population.Elitism ? Population.GetElites(this.members, this.allowedOffspring) : []
      const remainingCount = this.allowedOffspring - offspring.length
      Population.GeneratePairings(this.members, remainingCount)
        .forEach(({ p1, p2 }) => offspring.push(Brain.Crossover(p1, p2)))
      return offspring
    }
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
    }
  }
}