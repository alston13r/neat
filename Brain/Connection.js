const MutateWeightChance = 0.8
const NudgeWeightChance = 0.9

class Connection {
  static #InnovationIndex = 0
  static #InnovationMap = new Map()
  /**
   * @param {NNode} inNode 
   * @param {NNode} outNode 
   */
  static #GetInnovationID(inNode, outNode) {
    let innovation = inNode.id + ':' + outNode.id
    if (!this.#InnovationMap.has(innovation)) {
      this.#InnovationMap.set(innovation, ++this.#InnovationIndex)
    }
    return this.#InnovationMap.get(innovation)
  }

  /**
   * @param {NNode} inNode 
   * @param {NNode} outNode 
   * @param {number} weight 
   * @param {boolean} enabled 
   * @param {boolean} recurrent 
   */
  constructor(inNode, outNode, weight, enabled, recurrent) {
    this.inNode = inNode
    this.outNode = outNode
    this.weight = weight
    this.enabled = enabled
    this.recurrent = recurrent
    this.innovationID = Connection.#GetInnovationID(inNode, outNode)
    this.inNode.connectionsOut.push(this)
    this.outNode.connectionsIn.push(this)
  }

  static GetInnovationID(inNode, outNode) {
    return Connection.#GetInnovationID(inNode, outNode)
  }

  mutate() {
    if (Math.random() < MutateWeightChance) {
      if (Math.random() < NudgeWeightChance) {
        // +/- 20% change
        this.weight += 0.2 * this.weight * (Math.random() > 0.5 ? 1 : -1)
      } else {
        // new value
        this.weight = Math.random() * 20 - 10
      }
      this.clamp()
    }
  }

  clamp() {
    this.weight = Math.min(10, Math.max(-10, this.weight))
  }
}