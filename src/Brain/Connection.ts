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
class Connection {
  /** The minimum value that a weight can be */
  static MinimumWeightValue: number = -10
  /** The maximum value that a weight can be */
  static MaximumWeightValue: number = 10
  /** The chance for the weight to get mutated */
  static MutateWeightChance: number = 0.8
  /** The chance for the weight to be nudged rather than randomized when mutated */
  static NudgeWeightChance: number = 0.9

  /** The current global innovation index, this increments when an innovation is made */
  static #InnovationIndex: number = 0
  /**
   * A Map containing all currently known innovations. The keys are a concatenation of
   * the input node id, a colon, and the output node id. The values are the innovation ids
   * which are made whenever a new innovation is found.
   */
  static #InnovationMap: Map<string, number> = new Map<string, number>()
  /**
   * Private helper method to generate internal innovation ids.
   * @param inNode the connection's incoming node
   * @param outNode the connection's outgoing node
   * @returns the Connections innovation id
   */
  static #GetInnovationID(inNode: NNode, outNode: NNode): number {
    // concatenate ids
    const innovationString: string = inNode.id + ':' + outNode.id
    if (!this.#InnovationMap.has(innovationString)) {
      // increment innovation counter and set value accordingly
      this.#InnovationMap.set(innovationString, ++this.#InnovationIndex)
    }
    // return the innovation id
    return this.#InnovationMap.get(innovationString)
  }

  /**
   * Public helper method to return the innovation id for the specified
   * input node and output node.
   * @param inNode the incoming Node
   * @param outNode the outgoing Node
   * @returns the innovation id
   */
  static GetInnovationID(inNode: NNode, outNode: NNode): number {
    return this.#GetInnovationID(inNode, outNode)
  }

  /**
   * Helper method to generate a random weight value between the minimum and maximum
   * values. This is used since writing Math.random() in place of calling this would lead
   * to a lot of numbers needing to be changed when you can just change the static minimum
   * and maximum values.
   */
  static GenerateRandomWeight(): number {
    return Math.random() * (Connection.MaximumWeightValue - Connection.MinimumWeightValue) + Connection.MinimumWeightValue
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

  /**
   * Constructs a connection with the specified incoming node, outgoing node, weight, enabled value,
   * and recurrent value. A connection will take the incoming node's sum output value, multiply it
   * by the connection's weight, and pass it on to the outgoing node's sum input value. This transfer
   * of data only happens if the Connection is enabled.
   * @param inNode the connection's incoming node
   * @param outNode the connection's outgoing node
   * @param weight the Connection's weight
   * @param enabled whether or not the connection is enabled
   * @param recurrent whether or not the connection is recurrent
   */
  constructor(inNode: NNode, outNode: NNode, weight: number, enabled: boolean, recurrent: boolean) {
    this.inNode = inNode
    this.outNode = outNode
    this.weight = weight
    this.enabled = enabled
    this.recurrent = recurrent
    this.innovationID = Connection.#GetInnovationID(inNode, outNode)
    this.inNode.connectionsOut.push(this)
    this.outNode.connectionsIn.push(this)
  }

  /**
   * Mutates this connection's weight. Mutations occur by chance, only if a call to Math.random()
   * yields a value less than the predefined static values. A connection's weight, when mutated,
   * can either be nudged or completely randomized.
   */
  mutate(): void {
    if (Math.random() < Connection.MutateWeightChance) {
      // connection weight will be mutated
      if (Math.random() < Connection.NudgeWeightChance) {
        // weight will only be nudged by 20%
        this.weight += 0.2 * this.weight * (Math.random() > 0.5 ? 1 : -1)
      } else {
        // weight will be randomized
        this.weight = Connection.GenerateRandomWeight()
      }
      this.clamp()
    }
  }

  /**
   * Clamps this connection's weight to be within predefined bounds.
   */
  clamp(): void {
    this.weight = clamp(this.weight, Connection.MinimumWeightValue, Connection.MaximumWeightValue)
  }
}