type BrainTopology = {
  inputSize: number,
  hiddenSize?: number,
  outputSize: number
  enableChance?: number
}

type MutationConfig = {
  allowNewConnections?: boolean,
  allowDisablingConnections?: boolean,
  allowRecurrentConnections?: boolean,

  addConnectionChance?: number,
  disableConnectionChance?: number,
  reenableConnectionChance?: number

  allowNewNodes?: boolean,
  addNodeChance?: number

  allowWeightMutations?: boolean
  mutateWeightChance?: number,
  nudgeWeightChange?: number
}

type ConnectionConfig = {
  minimumWeightValue?: number,
  maximumWeightValue?: number
}

type SpeciesConfig = {
  enabled?: boolean,
  elitism?: boolean,
  elitePercentage?: number

  excessFactor?: number,
  disjointFactor?: number,
  weightFactor?: number,
  generationPenalization?: number,
  targetSpecies?: number
  dynamicThresholdStepSize?: number
}

class Neat {
  topology: BrainTopology

  mutationConfig: MutationConfig = {
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

  connectionConfig: ConnectionConfig = {
    minimumWeightValue: -10,
    maximumWeightValue: 10
  }

  speciesConfig: SpeciesConfig = {
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

  size: number

  constructor(topology: BrainTopology, size: number) {
    this.topology = {
      inputSize: topology.inputSize,
      hiddenSize: topology.hiddenSize ?? 0,
      outputSize: topology.outputSize,
      enableChance: topology.enableChance ?? 1,
    }

    this.size = size
  }

  setMutationConfig(config: MutationConfig): Neat {
    for (const k in config)
      this.mutationConfig[k] = config[k]

    return this
  }

  setConnectionConfig(config: ConnectionConfig): Neat {
    for (const k in config)
      this.connectionConfig[k] = config[k]

    return this
  }

  setSpeciesConfig(config: SpeciesConfig): Neat {
    for (const k in config)
      this.speciesConfig[k] = config[k]

    return this
  }
}