/**
 * Wrapper class containing references to an assortment of activation functions.
 * An activation function normalizes a Node's output value before proceeding to
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
 * with the mutation of a Node's activation function
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
 * An enumerator of the types of Node's a Brain can have. An input Node serves as the data input points
 * in a Brain, they don't have activation functions (identity function) since they are meant to just
 * pass inputs into the Brain's topology. An output Node is the Brain's physical output, this is what
 * we access to interpret what the Brain thinks is the output. Hidden Nodes are everything in between
 * input and output nodes, they provide the majority of the complexity of the Brain.
 */
var NNodeType;
(function (NNodeType) {
    NNodeType[NNodeType["Input"] = 0] = "Input";
    NNodeType[NNodeType["Hidden"] = 1] = "Hidden";
    NNodeType[NNodeType["Output"] = 2] = "Output";
})(NNodeType || (NNodeType = {}));
/**
 * The Brain Node class. Node's serve as connection points within a Brain where data passes through them,
 * being activated, before continuing on to the next layer in the Brain. This is named NNode since Node
 * was already taken.
 */
class NNode {
    /**
     * Constructs a Brain Node with the specified id, Node type, and layer. The id
     * is used as an identifier for connection innovation ids. Node ids are generated
     * automatically within the Brain's constructor. The type specifies the type of Node,
     * options are Input, Hidden, and Output. The layer specifies the layer within the
     * Brain's topology, this indicates how input data propagates throughout the Brain.
     * @param id the Node's numerical identifier
     * @param type the Node's type
     * @param layer the Node's layer
     */
    constructor(id, type, layer) {
        /** The weighted sum of the Node's incoming connection values */
        this.sumInput = 0;
        /** The activated sum input */
        this.sumOutput = 0;
        /** The Node's bias weight, this gets added in before activation but is not represented in the sum input value */
        this.bias = Connection.GenerateRandomWeight();
        /** An array of incoming connections */
        this.connectionsIn = [];
        /** An array of outgoing connections */
        this.connectionsOut = [];
        this.id = id;
        this.type = type;
        this.layer = layer;
        this.activationFunction = type == NNodeType.Input ? ActivationFunction.Identity : ActivationFunction.Sigmoid;
    }
    /**
     * Activates the weighted sum of input values for this Node. This adds the bias node before activation and
     * sets the sum output value to whatever the activation function returns.
     */
    activate() {
        this.sumOutput = this.activationFunction.fn(this.sumInput + this.bias);
    }
    /**
     * Clones this Node and returns said clone with the same id, type, layer, bias weight, and activation function.
     * @returns the clone
     */
    clone() {
        const copy = new NNode(this.id, this.type, this.layer);
        copy.bias = this.bias;
        copy.activationFunction = this.activationFunction;
        return copy;
    }
    /**
     * Mutates the bias weight and, if allowed for the Node's type, the activation function.
     * Mutations occur by chance, only if a call to Math.random() yields a value less than
     * the predefined static values. A Node's bias, when mutated, can either be nudged or
     * completely randomized.
     */
    mutate() {
        // bias mutation
        if (Math.random() < NNode.MutateBiasChance) {
            // bias weight will be mutated
            if (Math.random() < NNode.NudgeBiasChance) {
                // bias weight will only be nudged by 20%
                this.bias += 0.2 * this.bias * (Math.random() > 0.5 ? 1 : -1);
            }
            else {
                // bias weight will be randomized
                this.bias = Connection.GenerateRandomWeight();
            }
            this.clamp();
        }
        // activation function mutation
        // checks for if this node type can even mutate its activation function
        if (this.type == NNodeType.Input)
            return;
        if (this.type == NNodeType.Output && !NNode.AllowOutputActivationMutations)
            return;
        if (this.type == NNodeType.Hidden && !NNode.AllowHiddenActivationMutations)
            return;
        if (Math.random() < NNode.MutateActivationFunctionChance) {
            // the activation function will be randomized
            this.activationFunction = ActivationFunction.Arr[Math.floor(Math.random() * ActivationFunction.Arr.length)];
        }
    }
    /**
     * Clamps the bias weight to be within predefined bounds.
     */
    clamp() {
        this.bias = Math.min(Connection.MaximumWeightValue, Math.max(Connection.MinimumWeightValue, this.bias));
    }
}
/** Toggle for hidden node activation function mutations */
NNode.AllowHiddenActivationMutations = true;
/** Toggle for output node activation function mutations */
NNode.AllowOutputActivationMutations = false;
/** The chance for an activation function to get mutated */
NNode.MutateActivationFunctionChance = 0.03;
/** The chance for the bias weight to get mutated */
NNode.MutateBiasChance = 0.03;
/** The chance for the bias to be nudged rather than randomized when mutated */
NNode.NudgeBiasChance = 0.9;
//# sourceMappingURL=NeatNode.js.map