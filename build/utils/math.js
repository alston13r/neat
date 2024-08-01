const mat2 = glMatrix.mat2;
const mat2d = glMatrix.mat2d;
const mat3 = glMatrix.mat3;
const mat4 = glMatrix.mat4;
const quat = glMatrix.quat;
const quat2 = glMatrix.quat2;
const vec2 = glMatrix.vec2;
const vec3 = glMatrix.vec3;
const vec4 = glMatrix.vec4;
glMatrix.ARRAY_TYPE = Array;
const TwoPi = Math.PI * 2;
const RadToLookupDegConstant = 1800 / Math.PI;
const TrigLookup = new Array(3600).fill(0)
    .map((_, i) => {
    const radian = i * Math.PI / 1800;
    return vec2.fromValues(Math.cos(radian), Math.sin(radian));
});
function FastSin(angle) {
    return TrigLookup[angle][0];
}
function FastCos(angle) {
    return TrigLookup[angle][1];
}
function FastVec2FromRadian(angle) {
    angle = Math.floor(angle * RadToLookupDegConstant);
    angle = ((angle % 3600) + 3600) % 3600;
    return TrigLookup[angle];
}
function gauss() {
    let s = 0;
    for (let i = 0; i < 6; i++) {
        s += Math.random();
    }
    return s / 6;
}
function clamp(x, minimum, maximum) {
    return Math.max(minimum, Math.min(x, maximum));
}
function lerp(x, a, b, c, d) {
    return (x - a) / (b - a) * (d - c) + c;
}
function roundNicely(list, key, total) {
    const copy = list.slice();
    copy.sort((a, b) => {
        const c = a[key] - Math.floor(a[key]);
        const d = b[key] - Math.floor(b[key]);
        if (c == d)
            return b[key] - a[key];
        return d - c;
    });
    const min = copy.reduce((sum, curr) => sum + Math.floor(curr[key]), 0);
    const roundUpCount = Math.min(total - min, copy.length);
    for (let i = 0; i < roundUpCount; i++) {
        const item = copy.shift();
        item[key] = Math.ceil(item[key]);
    }
    for (let item of copy) {
        item[key] = Math.floor(item[key]);
    }
}
class ActivationFunction {
    static Sigmoid = new ActivationFunction(x => 1 / (1 + Math.exp(-x)), 'Sigmoid');
    static ScaledSigmoid = new ActivationFunction(x => 2 / (1 + Math.exp(-x)) - 1, 'Scaled Sigmoid');
    static Tanh = new ActivationFunction(Math.tanh, 'Tanh');
    static ReLU = new ActivationFunction(x => Math.max(0, x), 'ReLU');
    static LeakyReLU = new ActivationFunction(x => Math.max(0.1 * x, x), 'Leaky ReLU');
    static Softplus = new ActivationFunction(x => (x >= 20 ? x : Math.log(1 + Math.exp(x))), 'Softplus');
    static Softsign = new ActivationFunction(x => x / (1 + Math.abs(x)), 'Softsign');
    static Identity = new ActivationFunction(x => x, 'Identity');
    static Sign = new ActivationFunction(Math.sign, 'Sign');
    static Arr = [
        ActivationFunction.Sigmoid,
        ActivationFunction.ScaledSigmoid,
        ActivationFunction.Tanh,
        ActivationFunction.ReLU,
        ActivationFunction.LeakyReLU,
        ActivationFunction.Softplus,
        ActivationFunction.Softsign,
        ActivationFunction.Identity,
        ActivationFunction.Sign
    ];
    fn;
    name;
    constructor(fn, name) {
        this.fn = fn;
        this.name = name;
    }
    static FromSerial(name) {
        for (const activationFunction of this.Arr) {
            if (activationFunction.name == name)
                return activationFunction;
        }
    }
}
class DActivationFunction {
    static DSigmoid = new DActivationFunction(x => {
        const value = ActivationFunction.Sigmoid.fn(x);
        return value * (1 - value);
    }, ActivationFunction.Sigmoid, 'D Sigmoid');
    static DScaledSigmoid = new DActivationFunction(x => {
        const value = ActivationFunction.Sigmoid.fn(x);
        return 2 * value * (1 - value);
    }, ActivationFunction.ScaledSigmoid, 'D Scaled Sigmoid');
    static DTanh = new DActivationFunction(x => {
        return 1 - Math.tanh(x) ** 2;
    }, ActivationFunction.Tanh, 'D Tanh');
    static DReLU = new DActivationFunction(x => {
        return x >= 0 ? 1 : 0;
    }, ActivationFunction.ReLU, 'D ReLU');
    static DLeakyReLU = new DActivationFunction(x => {
        return x >= 0 ? 1 : 0.1;
    }, ActivationFunction.LeakyReLU, 'D Leaky ReLU');
    static DSoftplus = new DActivationFunction(x => {
        const value = Math.exp(x);
        return value / (1 + value);
    }, ActivationFunction.Softplus, 'D Softplus');
    static DSoftsign = new DActivationFunction(x => {
        return 1 / (1 + Math.abs(x)) ** 2;
    }, ActivationFunction.Softsign, 'D Softsign');
    static DIdentity = new DActivationFunction(x => {
        return 1;
    }, ActivationFunction.Identity, 'D Identity');
    static DSign = new DActivationFunction(x => {
        return 0;
    }, ActivationFunction.Sign, 'D Sign');
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
    ];
    fn;
    original;
    name;
    constructor(fn, original, name) {
        this.fn = fn;
        this.original = original;
        this.name = name;
    }
}
//# sourceMappingURL=math.js.map