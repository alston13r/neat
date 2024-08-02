/**
 * A connection serves as the pathway between a brain's nodes within the brain's topology.
 * Each connection has a unique innovation id that allows brain's with differing topologies
 * to be compared. Connections also have weights that tell nodes how important the data is
 * from the incoming node. Connections can be enabled or disabled, where disabled connections
 * do not pass on their data while enabled ones do. Connections can also be recurrent,
 * where their incoming node's layer is greater than the outgoing node's, this can be
 * interpreted as a Brain's "memory" since inputs from one propagation can influence the output
 * of the next propagation.
 */


/**
 * A connection connects two nodes within the brain's topology. Each connection has a weight
 * associated with it, multiplying the value of the node prior to passing it on. Connections
 * can be enabled or disabled, passing or being skipped over during the propagation process.
 * Connections can also be recurrent, where values get passed from a node in a layer further
 * in the brain's topology to a node in an earlier layer.
 */
class Connection {
  /** Toggle for weight mutations */
  static AllowWeightMutations = true
  /** The minimum value that a weight can be */
  static MinimumWeightValue = -10
  /** The maximum value that a weight can be */
  static MaximumWeightValue = 10
  /** The chance for the weight to get mutated */
  static MutateWeightChance = 0.8
  /** The chance for the weight to be nudged rather than randomized when mutated */
  static NudgeWeightChance = 0.9

  /**
   * Helper method to generate a random weight value between the minimum and maximum values.
   */
  static GenerateRandomWeight() {
    return lerp(Math.random(), 0, 1, this.MinimumWeightValue, this.MaximumWeightValue)
  }

  /** This connection's incoming node id */
  inNode: number
  /** This connection's outgoing node id */
  outNode: number
  /** This connection's weight */
  weight: number
  /** Whether or not this Connection is enabled */
  enabled: boolean
  /** Whether or not this Connection is recurrent */
  recurrent: boolean
  /** This Connection's innovation id */
  innovationID: number
  /** This Connection's index in the Brain's connections array */
  id: number

  /**
   * Constructs a connection with the specified incoming node id, outgoing node id, weight,
   * enabled and recurrent flags.
   * @param inNode the connection's incoming node's id
   * @param outNode the connection's outgoing node's id
   * @param weight the connection's weight
   * @param enabled whether or not the connection is enabled
   * @param recurrent whether or not the connection is recurrent
   */
  constructor(id: number, inNode: number, outNode: number, weight: number, enabled = true, recurrent = false) {
    this.id = id
    this.inNode = inNode
    this.outNode = outNode
    this.weight = weight
    this.enabled = enabled
    this.recurrent = recurrent
    this.innovationID = Innovations.GetInnovationID(inNode, outNode)
  }

  /**
   * Clones this connection and returns said clone with the same id, input node, output node, weight,
   * enabled and recurrent flags, and innovation id.
   * @returns the clone
   */
  clone() {
    return new Connection(this.id, this.inNode, this.outNode, this.weight, this.enabled, this.recurrent)
  }

  /**
   * Mutates this connection's weight. Mutations occur by chance, only if a call to Math.random()
   * yields a value less than the predefined static values. A connection's weight, when mutated,
   * can either be nudged or completely randomized.
   */
  mutate() {
    if (Connection.AllowWeightMutations
      && Math.random() < Connection.MutateWeightChance) { // connection weight will be mutated
      if (Math.random() < Connection.NudgeWeightChance) { // weight will only be nudged by 20%
        this.weight += 0.2 * this.weight * (Math.random() > 0.5 ? 1 : -1)
      } else { // weight will be randomized
        this.weight = Connection.GenerateRandomWeight()
      } // ensure weight is within acceptable bounds
      this.clamp()
    }
  }

  /**
   * Clamps this connection's weight to be within predefined bounds.
   */
  clamp() {
    this.weight = clamp(this.weight, Connection.MinimumWeightValue, Connection.MaximumWeightValue)
  }
}