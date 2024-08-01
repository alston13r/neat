/**
 * Type outlining what an entry in the TrainingValues class needs to have.
 * This is mostly for ease-of-use when writing types since writing out
 * objects is a pain.
 */
type InputOutput = {
  inputs: number[]
  outputs: number[]
}

/**
 * Utility class to help with organizing basic training data. This already includes data
 * for XOR, OR, and AND training.
 */
class TrainingValues {
  /** Training data for XOR */
  static XOR = new TrainingValues([
    {
      inputs: [0, 0],
      outputs: [0]
    },
    {
      inputs: [0, 1],
      outputs: [1]
    },
    {
      inputs: [1, 0],
      outputs: [1]
    },
    {
      inputs: [1, 1],
      outputs: [0]
    }
  ])
  /** Training data for OR */
  static OR = new TrainingValues([
    {
      inputs: [0, 0],
      outputs: [0]
    },
    {
      inputs: [0, 1],
      outputs: [1]
    },
    {
      inputs: [1, 0],
      outputs: [1]
    },
    {
      inputs: [1, 1],
      outputs: [1]
    }
  ])
  /** Training data for AND */
  static AND = new TrainingValues([
    {
      inputs: [0, 0],
      outputs: [0]
    },
    {
      inputs: [0, 1],
      outputs: [0]
    },
    {
      inputs: [1, 0],
      outputs: [0]
    },
    {
      inputs: [1, 1],
      outputs: [1]
    }
  ])

  values: { inputs: number[], outputs: number[] }[]
  inputSize = 0
  outputSize = 0

  /**
   * Constructs a TrainingValues wrapper object. Values can be added using addValue(),
   * which return a reference to this object to allow for chaining.
   */
  constructor()
  /**
   * Constructs a TrainingValues wrapper object for the specified values. If the
   * values are null, then the values are initialized to an empty array. Values can be
   * added using addValue(), which return a reference to this object to allow for chaining.
   * @param values the values
   */
  constructor(values: { inputs: number[], outputs: number[] }[])
  constructor(values?: { inputs: number[], outputs: number[] }[]) {
    this.values = values || []
    if (values != null) {
      this.inputSize = this.values[0].inputs.length
      this.outputSize = this.values[0].outputs.length
    }
  }

  /**
   * Adds the specified given inputs and outputs to the internal array.
   * @param inputs the inputs to add
   * @param outputs the outputs to add
   * @returns a reference to this TrainingValues object
   */
  addValue(inputs: number[], outputs: number[]) {
    if (this.inputSize == 0 || this.outputSize == 0) {
      this.inputSize = inputs.length
      this.outputSize = outputs.length
    }
    this.values.push({ inputs, outputs })
    return this
  }

  /**
   * Returns the number of training values in this set
   * @returns the number of training values
   */
  size() {
    return this.values.length
  }

  /**
   * Returns a generator for the local values in a random sequence.
   * @returns the array of values
   */
  random() {
    const N = this.values.length
    const res: InputOutput[] = new Array(N)
    const temp = this.values.slice()
    for (let i = 0; i < N; i++) {
      res[i] = temp.splice(Math.floor(Math.random() * temp.length), 1)[0]
    }
    return res
  }
}