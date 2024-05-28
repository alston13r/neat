/**
 * // TODO
 * @returns
 */
function gauss() {
    let s = 0;
    for (let i = 0; i < 6; i++) {
        s += Math.random();
    }
    return s / 6;
}
/**
 * // TODO
 * @param items
 * @param param
 * @param count
 * @returns
 */
function rouletteWheel(items, param, count) {
    if (count == 0)
        return [];
    const list = items.map(item => { return { item, sum: 0 }; });
    const max = list.reduce((sum, curr) => {
        curr.sum = sum + curr.item[param];
        return curr.sum;
    }, 0);
    const res = new Array(count).fill(0).map(() => {
        const value = Math.random() * max;
        for (let x of list) {
            if (value < x.sum)
                return x.item;
        }
    });
    return res;
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
function clamp(x, minimum, maximum) {
    return Math.max(minimum, Math.min(x, maximum));
}
/**
 * Utility class containing references to an assortment of activation functions.
 * An activation function normalizes a node's output value before proceeding to
 * the next layer. Activation functions are needed since neural networks are meant
 * to run on arbitrary data inputs. They serve to put data onto the same scale, since
 * $100 is hard to compare with 5 lemons, but 0s and 1s are much more comparable.
 */
class ActivationFunction {
    /**
     * Constructs an Activation Function with the specified function and name.
     * @param fn the function's function :)
     * @param name the function's name
     */
    constructor(fn, name) {
        this.fn = fn;
        this.name = name;
    }
}
/** The sigmoid activation function */
ActivationFunction.Sigmoid = new ActivationFunction(x => 1 / (1 + Math.exp(-x)), 'Sigmoid');
/** The hyperbolic tangent activation function */
ActivationFunction.Tanh = new ActivationFunction(Math.tanh, 'Tanh');
/** The relu activation function */
ActivationFunction.ReLU = new ActivationFunction(x => Math.max(0, x), 'ReLU');
/** The leaky relu activation function */
ActivationFunction.LeakyReLU = new ActivationFunction(x => Math.max(0.1 * x, x), 'Leaky ReLU');
/** The soft plus activation function */
ActivationFunction.Softplus = new ActivationFunction(x => Math.log(1 + Math.exp(x)), 'Softplus');
/** The soft sign activation function */
ActivationFunction.Softsign = new ActivationFunction(x => x / (1 + Math.abs(x)), 'Softsign');
/** The identity activation function */
ActivationFunction.Identity = new ActivationFunction(x => x, 'Identity');
/** The sign activation function */
ActivationFunction.Sign = new ActivationFunction(Math.sign, 'Sign');
/**
 * A static array containing references to all activation functions, this is to help
 * with the mutation of a node's activation function
 */
ActivationFunction.Arr = [
    ActivationFunction.Sigmoid,
    ActivationFunction.Tanh,
    ActivationFunction.ReLU,
    ActivationFunction.LeakyReLU,
    ActivationFunction.Softplus,
    ActivationFunction.Softsign,
    ActivationFunction.Identity,
    ActivationFunction.Sign
];
/**
 * Utility class containing references to the derivatives of activation functions.
 * An activation function normalizes a node's output value before proceeding to
 * the next layer. The derivatives of activation functions are needed when a
 * neural network is conducting back propagation, where it needs to know how to
 * best adjust its weights and biases to more accurately predict data. This class
 * will be identicle to the ActivationFunction utility class.
 */
class DActivationFunction {
    /**
     * Constructs a the derivative of an Activation Function with the specified
     * derivative function, original function, and name.
     * @param fn the function's function :)
     * @param name the function's name
     */
    constructor(fn, original, name) {
        this.fn = fn;
        this.original = original;
        this.name = name;
    }
}
/** The derivative of the sigmoid activation function */
DActivationFunction.DSigmoid = new DActivationFunction(x => {
    const value = ActivationFunction.Sigmoid.fn(x);
    return value * (1 - value);
}, ActivationFunction.Sigmoid, 'D Sigmoid');
/** The derivative of the hyperbolic tangent activation function */
DActivationFunction.DTanh = new DActivationFunction(x => {
    return 1 - Math.tanh(x) ** 2;
}, ActivationFunction.Tanh, 'D Tanh');
/** The derivative of the relu activation function */
DActivationFunction.DReLU = new DActivationFunction(x => {
    return x >= 0 ? 1 : 0;
}, ActivationFunction.ReLU, 'D ReLU');
/** The derivative of the leaky relu activation function */
DActivationFunction.DLeakyReLU = new DActivationFunction(x => {
    return x >= 0 ? 1 : 0.1;
}, ActivationFunction.LeakyReLU, 'D Leaky ReLU');
/** The derivative of the soft plus activation function */
DActivationFunction.DSoftplus = new DActivationFunction(x => {
    const value = Math.exp(x);
    return value / (1 + value);
}, ActivationFunction.Softplus, 'D Softplus');
/** The derivative of the soft sign activation function */
DActivationFunction.DSoftsign = new DActivationFunction(x => {
    return 1 / (1 + Math.abs(x)) ** 2;
}, ActivationFunction.Softsign, 'D Softsign');
/** The derivative of the identity activation function */
DActivationFunction.DIdentity = new DActivationFunction(x => {
    return 1;
}, ActivationFunction.Identity, 'D Identity');
/** The derivative of the sign activation function */
DActivationFunction.DSign = new DActivationFunction(x => {
    return 0;
}, ActivationFunction.Sign, 'D Sign');
/**
 * A static array containing references to all activation functions, this is to help
 * with the mutation of a node's activation function
 */
DActivationFunction.Arr = [
    DActivationFunction.DSigmoid,
    DActivationFunction.DTanh,
    DActivationFunction.DReLU,
    DActivationFunction.DLeakyReLU,
    DActivationFunction.DSoftplus,
    DActivationFunction.DSoftsign,
    DActivationFunction.DIdentity,
    DActivationFunction.DSign
];
//# sourceMappingURL=Maths.js.map