/**
 * Configuration type relating to Brain topology within the Neat algorithm.
 */
type BrainTopologyConfig = {
  /** The number of input nodes that members of the population will be initialized with */
  inputSize: number,
  /** The number of hidden nodes that members of the population will be initialized with */
  hiddenSize?: number,
  /** The number of output nodes that members of the population will be initialized with */
  outputSize: number
  /** The chance for the initial connections made in a member (in the first generation) to be enabled */
  enableChance?: number
}

/**
 * Configuration type relating to Mutations within the Neat algorithm.
 */
type MutationConfig = {
  /** Toggle for allowing new connections to be made */
  allowNewConnections?: boolean,
  /** Toggle for connections to be disabled */
  allowDisablingConnections?: boolean,
  /** Toggle for allowing recurrent connections */
  allowRecurrentConnections?: boolean,
  /** The chance for a new connection to be made */
  addConnectionChance?: number,
  /** The chance for an existing connection to be disabled */
  disableConnectionChance?: number,
  /** The chance for a disabled connection to be reenabled */
  reenableConnectionChance?: number
  /** Toggle for allowing new nodes to be made */
  allowNewNodes?: boolean,
  /** The chance for a new node to be made */
  addNodeChance?: number
  /** Toggle for allowing connection weight mutations */
  allowWeightMutations?: boolean
  /** The chance for a connection's weight to be mutated */
  mutateWeightChance?: number,
  /** The chance for a connection's weight mutation to just nudge the value, as opposed to complete randomization */
  nudgeWeightChange?: number
}

/**
 * Configuration type relating to Connections within the Neat algorithm.
 */
type ConnectionConfig = {
  /** The minimum value that a Connection's weight can be */
  minimumWeightValue?: number,
  /** The maximum value that a Connection's weight can be */
  maximumWeightValue?: number
}

/**
 * Configuration type relating to Species within the Neat algorithm.
 */
type SpeciesConfig = {
  /** Toggle for whether or not speciation should occur between generations */
  enabled?: boolean,
  /** Toggle for if elite members of a species should be preserved between generations */
  elitism?: boolean,
  /** The percentage of elite members that are preserved between generations */
  elitePercentage?: number
  /** The amount of influence that excess connections have when computing the compatibility between two Brain topologies */
  excessFactor?: number,
  /** The amount of influence that disjoint connections have when computing the compatibility between two Brain topologies */
  disjointFactor?: number,
  /** The amount of influence that the average weight difference has when computing the compatibility between two Brain topologies  */
  weightFactor?: number,
  /** The number of generations that a species can run for, simultaneously, without improvement before being penalized */
  generationPenalization?: number,
  /** The target number of species to be created, this target will not always be reached but serves as a direction for the dynamic threshold to adjust */
  targetSpecies?: number
  /** The step size of the dynamic threshold to take when the target number of species is not met */
  dynamicThresholdStepSize?: number
}

class Neat {
  #topology: BrainTopologyConfig

  #mutationConfig: MutationConfig = {
    allowNewConnections: true,
    allowDisablingConnections: false,
    allowRecurrentConnections: false,

    addConnectionChance: 0.4,
    disableConnectionChance: 0.05,
    reenableConnectionChance: 0.25,

    allowNewNodes: true,
    addNodeChance: 0.01,

    allowWeightMutations: true,
    mutateWeightChance: 0.8,
    nudgeWeightChange: 0.9
  }

  #connectionConfig: ConnectionConfig = {
    minimumWeightValue: -10,
    maximumWeightValue: 10
  }

  #speciesConfig: SpeciesConfig = {
    enabled: true,
    elitism: true,
    elitePercentage: 0.3,

    excessFactor: 1,
    disjointFactor: 1,
    weightFactor: 0.4,
    generationPenalization: 15,
    targetSpecies: 10,
    dynamicThresholdStepSize: 0.5
  }

  #size: number

  constructor(size: number, topology: BrainTopologyConfig) {
    this.#topology = {
      inputSize: topology.inputSize,
      hiddenSize: topology.hiddenSize ?? 0,
      outputSize: topology.outputSize,
      enableChance: topology.enableChance ?? 1,
    }

    this.#size = size
  }

  setMutationConfig(config: MutationConfig): Neat {
    for (const k in config)
      this.#mutationConfig[k] = config[k]

    return this
  }

  setConnectionConfig(config: ConnectionConfig): Neat {
    for (const k in config)
      this.#connectionConfig[k] = config[k]

    return this
  }

  setSpeciesConfig(config: SpeciesConfig): Neat {
    for (const k in config)
      this.#speciesConfig[k] = config[k]

    return this
  }
}

new Neat(100, { inputSize: 2, outputSize: 1 })