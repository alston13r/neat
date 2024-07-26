/** Constant for 2 PI */
const TwoPi = Math.PI * 2

/** Lookup table for sine and cosine within a tenth of a degree */
const TrigLookup: ReadonlyVec2[] = new Array(3600).fill(0)
  .map((_, i) => {
    const radian = i * Math.PI / 1800
    return vec2.fromValues(Math.cos(radian), Math.sin(radian))
  })

/**
 * Uses the TrigLookup table for a precomputed sine value for the specified degree.
 * @param angle the degree to lookup, scaled by 10
 * @returns sine of the angle
 */
function FastSin(angle: number) {
  return TrigLookup[angle][0]
}

/**
 * Uses the TrigLookup table for a precomputed cosine value for the specified degree.
 * @param angle the degree to lookup, scaled by 10
 * @returns cosine of the angle
 */
function FastCos(angle: number) {
  return TrigLookup[angle][1]
}

function FastVec2FromRadian(angle: number) {
  angle = Math.floor(matrix.toDegree(angle) * 10)
  angle = ((angle % 3600) + 3600) % 3600
  return TrigLookup[angle]
}

/**
 * Returns a random normally distributed gaussian number.
 * @returns the number
 */
function gauss() {
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
 * @param list the list of items to select from
 * @param param the value to assign portions from
 * @param count the number of items to select
 * @param smallValues boolean specifying if smaller values are favored, false by default
 * @returns the selected items
 */
function rouletteWheel<k>(list: k[], param: string, count: number): k[] {
  if (count == 0) return []
  if (list.length == 0) return []
  if (list.length == 1) return new Array(count).fill(list[0])
  const entry = list.map(item => ({ item, value: item[param] as number, sum: 0 }))
  const max = entry.reduce((sum, curr) => {
    curr.sum = sum + curr.value
    return curr.sum
  }, 0)
  return new Array(count).fill(0).map(() => {
    const value = Math.random() * max
    for (const pair of entry) {
      if (value < pair.sum) return pair.item
    }
  })
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
function clamp(x: number, minimum: number, maximum: number) {
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
function lerp(x: number, a: number, b: number, c: number, d: number) {
  return (x - a) / (b - a) * (d - c) + c
}

function roundNicely<T>(list: T[], key: string, total: number) {
  const copy: T[] = list.slice()
  copy.sort((a, b) => {
    const c: number = a[key] - Math.floor(a[key])
    const d: number = b[key] - Math.floor(b[key])
    if (c == d) return b[key] - a[key]
    return d - c
  })
  const min: number = copy.reduce((sum, curr) => sum + Math.floor(curr[key]), 0)
  const roundUpCount: number = Math.min(total - min, copy.length)
  for (let i = 0; i < roundUpCount; i++) {
    const item: T = copy.shift()
    item[key] = Math.ceil(item[key])
  }
  for (let item of copy) {
    item[key] = Math.floor(item[key])
  }
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
  static Sigmoid = new ActivationFunction(x => 1 / (1 + Math.exp(-x)), 'Sigmoid')
  /** A scaled version of the sigmoid activation function */
  static ScaledSigmoid = new ActivationFunction(x => 2 / (1 + Math.exp(-x)) - 1, 'Scaled Sigmoid')
  /** The hyperbolic tangent activation function */
  static Tanh = new ActivationFunction(Math.tanh, 'Tanh')
  /** The relu activation function */
  static ReLU = new ActivationFunction(x => Math.max(0, x), 'ReLU')
  /** The leaky relu activation function */
  static LeakyReLU = new ActivationFunction(x => Math.max(0.1 * x, x), 'Leaky ReLU')
  /** The soft plus activation function */
  static Softplus = new ActivationFunction(x => (x >= 20 ? x : Math.log(1 + Math.exp(x))), 'Softplus')
  /** The soft sign activation function */
  static Softsign = new ActivationFunction(x => x / (1 + Math.abs(x)), 'Softsign')
  /** The identity activation function */
  static Identity = new ActivationFunction(x => x, 'Identity')
  /** The sign activation function */
  static Sign = new ActivationFunction(Math.sign, 'Sign')

  /**
   * A static array containing references to all activation functions, this is to help
   * with the mutation of a node's activation function
   */
  static Arr: ActivationFunction[] = [
    ActivationFunction.Sigmoid,
    ActivationFunction.ScaledSigmoid,
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

  static FromName(name: string) {
    for (const activationFunction of this.Arr) {
      if (activationFunction.name == name) return activationFunction
    }
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
  static DSigmoid = new DActivationFunction(x => {
    const value: number = ActivationFunction.Sigmoid.fn(x)
    return value * (1 - value)
  }, ActivationFunction.Sigmoid, 'D Sigmoid')
  static DScaledSigmoid = new DActivationFunction(x => {
    const value: number = ActivationFunction.Sigmoid.fn(x)
    return 2 * value * (1 - value)
  }, ActivationFunction.ScaledSigmoid, 'D Scaled Sigmoid')
  /** The derivative of the hyperbolic tangent activation function */
  static DTanh = new DActivationFunction(x => {
    return 1 - Math.tanh(x) ** 2
  }, ActivationFunction.Tanh, 'D Tanh')
  /** The derivative of the relu activation function */
  static DReLU = new DActivationFunction(x => {
    return x >= 0 ? 1 : 0
  }, ActivationFunction.ReLU, 'D ReLU')
  /** The derivative of the leaky relu activation function */
  static DLeakyReLU = new DActivationFunction(x => {
    return x >= 0 ? 1 : 0.1
  }, ActivationFunction.LeakyReLU, 'D Leaky ReLU')
  /** The derivative of the soft plus activation function */
  static DSoftplus = new DActivationFunction(x => {
    const value: number = Math.exp(x)
    return value / (1 + value)
  }, ActivationFunction.Softplus, 'D Softplus')
  /** The derivative of the soft sign activation function */
  static DSoftsign = new DActivationFunction(x => {
    return 1 / (1 + Math.abs(x)) ** 2
  }, ActivationFunction.Softsign, 'D Softsign')
  /** The derivative of the identity activation function */
  static DIdentity = new DActivationFunction(x => {
    return 1
  }, ActivationFunction.Identity, 'D Identity')
  /** The derivative of the sign activation function */
  static DSign = new DActivationFunction(x => {
    return 0
  }, ActivationFunction.Sign, 'D Sign')

  /**
   * A static array containing references to all activation functions, this is to help
   * with the mutation of a node's activation function
   */
  static Arr = [
    DActivationFunction.DSigmoid,
    DActivationFunction.DScaledSigmoid,
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