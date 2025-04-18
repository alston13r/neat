/**
 * A connection connects two nodes within the brain's topology. Each connection has a weight
 * associated with it, multiplying the value of the node prior to passing it on. Connections
 * can be enabled or disabled, passing or being skipped over during the propagation process.
 * Connections can also be recurrent, where values get passed from a node in a layer further
 * in the brain's topology to a node in an earlier layer.
 */
class Connection {
  /**
   * Helper method to generate a random weight value between the minimum and maximum values.
   */
  static GenerateRandomWeight(config: ConnectionConfig) {
    return lerp(Math.random(), 0, 1, config.minimumWeightValue, config.maximumWeightValue)
  }

  /** This connection's incoming node */
  inNode: NNode
  /** This connection's outgoing node */
  outNode: NNode
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
   * Constructs a connection with the specified incoming node, outgoing node, weight,
   * enabled and recurrent flags.
   * @param inNode the connection's incoming node
   * @param outNode the connection's outgoing node
   * @param weight the connection's weight
   * @param enabled whether or not the connection is enabled
   * @param recurrent whether or not the connection is recurrent
   */
  constructor(id: number, inNode: NNode, outNode: NNode, weight: number, enabled = true, recurrent = false) {
    this.id = id
    this.inNode = inNode
    this.outNode = outNode
    this.weight = weight
    this.enabled = enabled
    this.recurrent = recurrent
    this.innovationID = Innovations.GetInnovationID(inNode.id, outNode.id)
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
  mutate(neat: Neat) {
    if (neat.mutationConfig.allowWeightMutations
      && Math.random() < neat.mutationConfig.mutateWeightChance) { // connection weight will be mutated

      if (Math.random() < neat.mutationConfig.nudgeWeightChance) { // weight will only be nudged by 20%
        this.weight += 0.2 * this.weight * (Math.random() > 0.5 ? 1 : -1)
      } else { // weight will be randomized
        this.weight = lerp(Math.random(), 0, 1, neat.connectionConfig.minimumWeightValue, neat.connectionConfig.maximumWeightValue)
      }

      // ensure weight is within acceptable bounds
      this.weight = clamp(this.weight, neat.connectionConfig.minimumWeightValue, neat.connectionConfig.maximumWeightValue)
    }
  }
}