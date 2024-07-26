class Innovations {
  static #InnovationArray: number[] = []

  static GetInnovationID(inNode: NNode, outNode: NNode) {
    const identifier = (inNode.id << 16) + outNode.id
    const N = this.#InnovationArray.length
    for (let i = 0; i < N; i++) {
      const val = Innovations.#InnovationArray[i]
      if (identifier === val) return i
    }
    Innovations.#InnovationArray[N + 1] = identifier
    return N + 1
  }

  static Serialize() {
    return {
      'innovations': this.#InnovationArray.slice()
    }
  }
}