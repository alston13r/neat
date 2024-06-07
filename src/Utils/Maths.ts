/**
 * Returns a random normally distributed gaussian number.
 * @returns the number
 */
function gauss(): number {
  let s = 0
  for (let i = 0; i < 6; i++) {
    s += Math.random()
  }
  return s / 6
}

/**
 * Does a roulette wheel on the list of items based on the specified param values.
 * A roulette wheel will assign a portion of a "roll" to each item in the list, where
 * items with bigger portions will come up more often when rolled. If smallValues is
 * set to true, then the wheel will revert the values and favor smaller values instead.
 * @param items the list of items to select from
 * @param param the value to assign portions from
 * @param count the number of items to select
 * @param smallValues boolean specifying if smaller values are favored, false by default
 * @returns the selected items
 */
function rouletteWheel<k>(items: k[], param: string, count: number, smallValues: boolean = false): k[] {
  if (count == 0) return []
  const list = items.map(item => { return { item, sum: 0 } })
  let max: number = list.reduce((highest, curr) => curr.item[param] > highest ? curr.item[param] : highest, 0)

  if (smallValues) {
    max = list.reduce((sum, curr) => {
      curr.sum = sum + max - curr.item[param]
      return curr.sum
    }, 0)
  } else {
    list.reduce((sum, curr) => {
      curr.sum = sum + curr.item[param]
      return curr.sum
    }, 0)
  }

  const res = new Array(count).fill(0).map(() => {
    const value = Math.random() * max
    for (let x of list) {
      if (value < x.sum) return x.item
    }
  })
  return res
}

/**
 * Clamps the given value to be within the bounds. If the value is greater
 * than the maximum, this will return the maximum value. Likewise, if the
 * value is less than the minimum, this will return the minimum value.
 * @param x the value
 * @param minimum the lower bound for the clamp
 * @param maximum the upper bound for the clamp
 * @returns the clamped value
 */
function clamp(x: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(x, maximum))
}

/**
 * Linearly interpolates x from the range of a-b to c-d.
 * @param x the number to interpolate
 * @param a the initial lower bound
 * @param b the initial upper bound
 * @param c the final lower bound
 * @param d the final upper bound
 * @returns the linearly interpolated x value
 */
function lerp(x: number, a: number, b: number, c: number, d: number): number {
  return (x - a) / (b - a) * (d - c) + c
}

/**
 * Utility class containing references to an assortment of activation functions.
 * An activation function normalizes a node's output value before proceeding to
 * the next layer. Activation functions are needed since neural networks are meant
 * to run on arbitrary data inputs. They serve to put data onto the same scale, since
 * $100 is hard to compare with 5 lemons, but 0s and 1s are much more comparable.
 */
class ActivationFunction {
  /** The sigmoid activation function */
  static Sigmoid: ActivationFunction = new ActivationFunction(x => 1 / (1 + Math.exp(-x)), 'Sigmoid')
  /** The hyperbolic tangent activation function */
  static Tanh: ActivationFunction = new ActivationFunction(Math.tanh, 'Tanh')
  /** The relu activation function */
  static ReLU: ActivationFunction = new ActivationFunction(x => Math.max(0, x), 'ReLU')
  /** The leaky relu activation function */
  static LeakyReLU: ActivationFunction = new ActivationFunction(x => Math.max(0.1 * x, x), 'Leaky ReLU')
  /** The soft plus activation function */
  static Softplus: ActivationFunction = new ActivationFunction(x => Math.log(1 + Math.exp(x)), 'Softplus')
  /** The soft sign activation function */
  static Softsign: ActivationFunction = new ActivationFunction(x => x / (1 + Math.abs(x)), 'Softsign')
  /** The identity activation function */
  static Identity: ActivationFunction = new ActivationFunction(x => x, 'Identity')
  /** The sign activation function */
  static Sign: ActivationFunction = new ActivationFunction(Math.sign, 'Sign')

  /**
   * A static array containing references to all activation functions, this is to help
   * with the mutation of a node's activation function
   */
  static Arr: ActivationFunction[] = [
    ActivationFunction.Sigmoid,
    ActivationFunction.Tanh,
    ActivationFunction.ReLU,
    ActivationFunction.LeakyReLU,
    ActivationFunction.Softplus,
    ActivationFunction.Softsign,
    ActivationFunction.Identity,
    ActivationFunction.Sign
  ]

  /** The activation function */
  fn: (x: number) => number
  /** The name of the activation function */
  name: string

  /**
   * Constructs an Activation Function with the specified function and name.
   * @param fn the function's function :)
   * @param name the function's name
   */
  constructor(fn: (x: number) => number, name: string) {
    this.fn = fn
    this.name = name
  }
}

/**
 * Utility class containing references to the derivatives of activation functions.
 * An activation function normalizes a node's output value before proceeding to
 * the next layer. The derivatives of activation functions are needed when a
 * neural network is conducting back propagation, where it needs to know how to
 * best adjust its weights and biases to more accurately predict data. This class
 * will be identicle to the ActivationFunction utility class.
 */
class DActivationFunction {
  /** The derivative of the sigmoid activation function */
  static DSigmoid: DActivationFunction = new DActivationFunction(x => {
    const value: number = ActivationFunction.Sigmoid.fn(x)
    return value * (1 - value)
  }, ActivationFunction.Sigmoid, 'D Sigmoid')
  /** The derivative of the hyperbolic tangent activation function */
  static DTanh: DActivationFunction = new DActivationFunction(x => {
    return 1 - Math.tanh(x) ** 2
  }, ActivationFunction.Tanh, 'D Tanh')
  /** The derivative of the relu activation function */
  static DReLU: DActivationFunction = new DActivationFunction(x => {
    return x >= 0 ? 1 : 0
  }, ActivationFunction.ReLU, 'D ReLU')
  /** The derivative of the leaky relu activation function */
  static DLeakyReLU: DActivationFunction = new DActivationFunction(x => {
    return x >= 0 ? 1 : 0.1
  }, ActivationFunction.LeakyReLU, 'D Leaky ReLU')
  /** The derivative of the soft plus activation function */
  static DSoftplus: DActivationFunction = new DActivationFunction(x => {
    const value: number = Math.exp(x)
    return value / (1 + value)
  }, ActivationFunction.Softplus, 'D Softplus')
  /** The derivative of the soft sign activation function */
  static DSoftsign: DActivationFunction = new DActivationFunction(x => {
    return 1 / (1 + Math.abs(x)) ** 2
  }, ActivationFunction.Softsign, 'D Softsign')
  /** The derivative of the identity activation function */
  static DIdentity: DActivationFunction = new DActivationFunction(x => {
    return 1
  }, ActivationFunction.Identity, 'D Identity')
  /** The derivative of the sign activation function */
  static DSign: DActivationFunction = new DActivationFunction(x => {
    return 0
  }, ActivationFunction.Sign, 'D Sign')

  /**
   * A static array containing references to all activation functions, this is to help
   * with the mutation of a node's activation function
   */
  static Arr: DActivationFunction[] = [
    DActivationFunction.DSigmoid,
    DActivationFunction.DTanh,
    DActivationFunction.DReLU,
    DActivationFunction.DLeakyReLU,
    DActivationFunction.DSoftplus,
    DActivationFunction.DSoftsign,
    DActivationFunction.DIdentity,
    DActivationFunction.DSign
  ]

  /** The derivative activation function */
  fn: (x: number) => number
  /** The original activation function */
  original: ActivationFunction
  /** The name of the derivative activation function */
  name: string

  /**
   * Constructs a the derivative of an Activation Function with the specified
   * derivative function, original function, and name.
   * @param fn the function's function :)
   * @param name the function's name
   */
  constructor(fn: (x: number) => number, original: ActivationFunction, name: string) {
    this.fn = fn
    this.original = original
    this.name = name
  }
}