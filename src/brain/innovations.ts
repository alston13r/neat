class Innovations {
  static #InnovationArray: number[] = []

  static GetInnovationID(inNode: number, outNode: number) {
    const identifier = (inNode << 16) + outNode
    const N = this.#InnovationArray.length
    for (let i = 0; i < N; i++) {
      const val = Innovations.#InnovationArray[i]
      if (identifier === val) return i
    }
    Innovations.#InnovationArray[N] = identifier
    return N
  }
}