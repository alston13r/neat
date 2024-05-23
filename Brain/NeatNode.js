class NNodeType {
  static #Input = new NNodeType('input')
  static #Hidden = new NNodeType('hidden')
  static #Output = new NNodeType('output')

  constructor(type) {
    this.symbol = Symbol(type)
  }

  static get Input() { return NNodeType.#Input }
  static get Hidden() { return NNodeType.#Hidden }
  static get Output() { return NNodeType.#Output }
}

class ActivationFunction {
  static Sigmoid = new ActivationFunction(x => 1 / (1 + Math.exp(-x)), 'Sigmoid')
  static Tanh = new ActivationFunction(Math.tanh, 'Tanh')
  static ReLU = new ActivationFunction(x => Math.max(0, x), 'ReLU')
  static LeakyReLU = new ActivationFunction(x => Math.max(0.1 * x, x), 'Leaky ReLU')
  static Softplus = new ActivationFunction(x => Math.log(1 + Math.exp(x)), 'Softplus')
  static Softsign = new ActivationFunction(x => x / (1 + Math.abs(x)), 'Softsign')
  static Identity = new ActivationFunction(x => x, 'Identity')
  static Sign = new ActivationFunction(Math.sign, 'Sign')

  static Arr = [
    ActivationFunction.Sigmoid,
    ActivationFunction.Tanh,
    ActivationFunction.ReLU,
    ActivationFunction.LeakyReLU,
    ActivationFunction.Softplus,
    ActivationFunction.Softsign,
    ActivationFunction.Identity,
    ActivationFunction.Sign
  ]

  /**
   * @param {function(number): number} fn
   */
  constructor(fn, name) {
    this.fn = fn
    this.name = name
  }
}

const AllowHiddenActivationMutations = true
const AllowOutputActivationMutations = false

const MutateActivationFunctionChance = 0.03
const MutateBiasChance = 0.3
const NudgeBiasChance = 0.9

class NNode {
  /**
   * @param {number} id 
   * @param {NNodeType} type 
   * @param {number} layer 
   */
  constructor(id, type, layer) {
    this.id = id
    this.type = type
    this.layer = layer
    this.sumInput = 0
    this.sumOutput = 0
    this.bias = Math.random() * 20 - 10
    this.connectionsIn = []
    this.connectionsOut = []
    this.activationFunction = type == NNodeType.Input ? ActivationFunction.Identity : ActivationFunction.Sigmoid
  }

  /**
   * @return {number}
   */
  activate() {
    this.sumOutput = this.activationFunction.fn(this.sumInput + this.bias)
  }

  /**
   * @returns {NNode}
   */
  clone() {
    let n = new NNode(this.id, this.type, this.layer)
    n.bias = this.bias
    n.activationFunction = this.activationFunction
    return n
  }

  mutate() {
    // mutate bias
    if (Math.random() < MutateBiasChance) {
      if (Math.random() < NudgeBiasChance) {
        this.bias += 0.2 * this.bias * (Math.random() > 0.5 ? 1 : -1)
      } else {
        this.bias = Math.random() * 20 - 10
      }
      this.clamp()
    }

    // mutate activation function
    if (this.type == NNodeType.Input) return
    if (this.type == NNodeType.Output && !AllowOutputActivationMutations) return
    if (this.type == NNodeType.Hidden && !AllowHiddenActivationMutations) return
    if (Math.random() < MutateActivationFunctionChance) {
      let fn = ActivationFunction.Arr[Math.floor(Math.random() * ActivationFunction.Arr.length)]
      this.activationFunction = fn
    }
  }

  clamp() {
    this.bias = Math.min(10, Math.max(-10, this.bias))
  }
}