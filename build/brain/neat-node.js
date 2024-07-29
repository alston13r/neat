/**
 * An enumerator of the types of node's a Brain can have. An input node serves as the data input points
 * in a Brain, they don't have activation functions (identity function) since they are meant to just
 * pass inputs into the Brain's topology. An output node is the brain's physical output, this is what
 * we access to interpret what the Brain thinks is the output. Hidden nodes are everything in between
 * input and output nodes, they provide the majority of the complexity of the Brain.
 */
var NNodeType;
(function (NNodeType) {
    NNodeType[NNodeType["Input"] = 0] = "Input";
    NNodeType[NNodeType["Hidden"] = 1] = "Hidden";
    NNodeType[NNodeType["Output"] = 2] = "Output";
})(NNodeType || (NNodeType = {}));
/**
 * The brain's node class. Nodes serve as connection points within a brain where data passes through them,
 * being activated, before continuing on to the next layer in the brain. This is named NNode since Node
 * was already taken.
 */
class NNode {
    /** The default activation function for input nodes */
    static get DefaultInputActivationFunction() { return this.DefaultActivationFunctions[NNodeType.Input]; }
    static set DefaultInputActivationFunction(fn) { this.DefaultActivationFunctions[NNodeType.Input] = fn; }
    /** The default activation function for hidden nodes */
    static get DefaultHiddenActivationFunction() { return this.DefaultActivationFunctions[NNodeType.Hidden]; }
    static set DefaultHiddenActivationFunction(fn) { this.DefaultActivationFunctions[NNodeType.Hidden] = fn; }
    /** The default activation function for output nodes */
    static get DefaultOutputActivationFunction() { return this.DefaultActivationFunctions[NNodeType.Output]; }
    static set DefaultOutputActivationFunction(fn) { this.DefaultActivationFunctions[NNodeType.Output] = fn; }
    /**
     * Constructs a brain node with the specified id, node type, and layer. The id
     * is used as an identifier for connection innovation ids. Node ids are generated
     * automatically within the Brain's constructor. The type specifies the type of node,
     * options are Input, Hidden, and Output. The layer specifies the layer within the
     * Brain's topology, this indicates how input data propagates throughout the Brain.
     * @param id the node's numerical identifier
     * @param type the node's type
     * @param layer the node's layer
     */
    constructor(id, type, layer, bias = NNode.GenerateRandomBias()) {
        /** The weighted sum of the node's incoming connection values */
        this.sumInput = 0;
        /** The activated sum input */
        this.sumOutput = 0;
        /** The node's bias weight, this gets added in before activation but is not represented in the sum input value */
        this.bias = 0;
        /** An array of incoming connections */
        this.connectionsIn = [];
        /** An array of outgoing connections */
        this.connectionsOut = [];
        this.id = id;
        this.type = type;
        this.layer = layer;
        this.activationFunction = NNode.DefaultActivationFunctions[type];
        if (type != 0)
            this.bias = bias;
    }
    /**
     * Helper method to generate a random bias value between the minimum and maximum values.
     */
    static GenerateRandomBias() {
        return Math.random() * (this.MaximumBiasValue - this.MinimumBiasValue) + this.MinimumBiasValue;
    }
    /**
     * Activates the weighted sum of input values for this node. This adds the bias node before activation and
     * sets the sum output value to whatever the activation function returns.
     *
     * @returns the sum output
     */
    activate() {
        this.sumOutput = this.activationFunction.fn(this.sumInput + this.bias);
        return this.sumOutput;
    }
    /**
     * Clones this node and returns said clone with the same id, type, layer, bias weight, and activation function.
     * @returns the clone
     */
    clone() {
        const copy = new NNode(this.id, this.type, this.layer, this.bias);
        copy.activationFunction = this.activationFunction;
        return copy;
    }
    /**
     * Mutates the bias weight and, if allowed for the node's type, the activation function.
     * Mutations occur by chance, only if a call to Math.random() yields a value less than
     * the predefined static values. A node's bias, when mutated, can either be nudged or
     * completely randomized.
     */
    mutate() {
        if (this.type == NNodeType.Input && NNode.AllowInputBiasMutations
            || this.type == NNodeType.Hidden && NNode.AllowHiddenBiasMutations
            || this.type == NNodeType.Output && NNode.AllowOutputBiasMutations) { // bias mutation
            if (Math.random() < NNode.MutateBiasChance) { // bias weight will be mutated
                if (Math.random() < NNode.NudgeBiasChance) { // bias weight will only be nudged by 20%
                    this.bias += 0.2 * this.bias * (Math.random() > 0.5 ? 1 : -1);
                }
                else { // bias weight will be randomized
                    this.bias = NNode.GenerateRandomBias();
                } // ensure weight is within acceptable bounds
                this.clamp();
            }
        }
        if (this.type == NNodeType.Input && NNode.AllowInputActivationMutations
            || this.type == NNodeType.Hidden && NNode.AllowHiddenActivationMutations
            || this.type == NNodeType.Output && NNode.AllowOutputActivationMutations) {
            if (Math.random() < NNode.MutateActivationFunctionChance) { // activation function mutation
                this.activationFunction = ActivationFunction.Arr[Math.floor(Math.random() * ActivationFunction.Arr.length)];
            }
        }
    }
    /**
     * Clamps the bias weight to be within predefined bounds.
     */
    clamp() {
        this.bias = clamp(this.bias, NNode.MinimumBiasValue, NNode.MaximumBiasValue);
    }
    static GetPresets() {
        return {
            'DefaultInputActivationFunction': NNode.DefaultInputActivationFunction.name,
            'DefaultHiddenActivationFunction': NNode.DefaultHiddenActivationFunction.name,
            'DefaultOutputActivationFunction': NNode.DefaultOutputActivationFunction.name,
            'AllowInputActivationMutations': NNode.AllowInputActivationMutations,
            'AllowHiddenActivationMutations': NNode.AllowHiddenActivationMutations,
            'AllowOutputActivationMutations': NNode.AllowOutputActivationMutations,
            'AllowInputBiasMutations': NNode.AllowInputBiasMutations,
            'AllowHiddenBiasMutations': NNode.AllowHiddenBiasMutations,
            'AllowOutputBiasMutations': NNode.AllowOutputBiasMutations,
            'MutateActivationFunctionChance': NNode.MutateActivationFunctionChance,
            'MutateBiasChance': NNode.MutateBiasChance,
            'NudgeBiasChance': NNode.NudgeBiasChance,
            'MinimumBiasValue': NNode.MinimumBiasValue,
            'MaximumBiasValue': NNode.MaximumBiasValue
        };
    }
    serialize() {
        return {
            'id': this.id,
            'type': this.type,
            'layer': this.layer,
            'bias': this.bias,
            'connectionsIn': this.connectionsIn,
            'connectionsOut': this.connectionsOut,
            'activationFunction': this.activationFunction.name
        };
    }
    static FromSerial(serial) {
        const node = new NNode(serial.id, serial.type, serial.layer);
        node.bias = serial.bias;
        node.connectionsIn = serial.connectionsIn;
        node.connectionsOut = serial.connectionsOut;
        node.activationFunction = ActivationFunction.FromSerial(serial.activationFunction);
        return node;
    }
}
/** Array containing default activation functions indexed by node type */
NNode.DefaultActivationFunctions = [
    ActivationFunction.Identity,
    ActivationFunction.Sigmoid,
    ActivationFunction.Tanh
];
/** Toggle for input node activation function mutations */
NNode.AllowInputActivationMutations = false;
/** Toggle for hidden node activation function mutations */
NNode.AllowHiddenActivationMutations = true;
/** Toggle for output node activation function mutations */
NNode.AllowOutputActivationMutations = false;
/** Toggle for input node bias mutations */
NNode.AllowInputBiasMutations = false;
/** Toggle for hidden node bias mutations */
NNode.AllowHiddenBiasMutations = true;
/** Toggle for output node bias mutations */
NNode.AllowOutputBiasMutations = true;
/** The chance for an activation function to get mutated */
NNode.MutateActivationFunctionChance = 0.03;
/** The chance for the bias weight to get mutated */
NNode.MutateBiasChance = 0.03;
/** The chance for the bias to be nudged rather than randomized when mutated */
NNode.NudgeBiasChance = 0.9;
/** The minimum value that a bias can be */
NNode.MinimumBiasValue = -10;
/** The maximum value that a bias can be */
NNode.MaximumBiasValue = 10;
//# sourceMappingURL=neat-node.js.map