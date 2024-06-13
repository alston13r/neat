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
    static DefaultInputActivationFunction = ActivationFunction.Identity;
    /** The default activation function for hidden nodes */
    static DefaultHiddenActivationFunction = ActivationFunction.Sigmoid;
    /** The default activation function for output nodes */
    static DefaultOutputActivationFunction = ActivationFunction.Tanh;
    /** Toggle for hidden node activation function mutations */
    static AllowHiddenActivationMutations = true;
    /** Toggle for output node activation function mutations */
    static AllowOutputActivationMutations = false;
    /** The chance for an activation function to get mutated */
    static MutateActivationFunctionChance = 0.03;
    /** The chance for the bias weight to get mutated */
    static MutateBiasChance = 0.03;
    /** The chance for the bias to be nudged rather than randomized when mutated */
    static NudgeBiasChance = 0.9;
    /** The minimum value that a bias can be */
    static MinimumBiasValue = -10;
    /** The maximum value that a bias can be */
    static MaximumBiasValue = 10;
    /** The node's unique numerical identifier within the Brain */
    id;
    /** The node's type, can be Input, Hidden, or Output */
    type;
    /** The node's layer within the Brain's topology */
    layer;
    /** The weighted sum of the node's incoming connection values */
    sumInput = 0;
    /** The activated sum input */
    sumOutput = 0;
    /** The node's bias weight, this gets added in before activation but is not represented in the sum input value */
    bias = NNode.GenerateRandomBias();
    /** An array of incoming connections */
    connectionsIn = [];
    /** An array of outgoing connections */
    connectionsOut = [];
    /** The activation function for this node */
    activationFunction;
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
    constructor(id, type, layer) {
        this.id = id;
        this.type = type;
        this.layer = layer;
        switch (type) {
            case NNodeType.Input:
                this.activationFunction = NNode.DefaultInputActivationFunction;
                break;
            case NNodeType.Hidden:
                this.activationFunction = NNode.DefaultHiddenActivationFunction;
                break;
            case NNodeType.Output:
                this.activationFunction = NNode.DefaultOutputActivationFunction;
                break;
        }
    }
    /**
     * Helper method to generate a random bias value between the minimum and maximum values.
     */
    static GenerateRandomBias() {
        return lerp(Math.random(), 0, 1, this.MinimumBiasValue, this.MaximumBiasValue);
    }
    /**
     * Activates the weighted sum of input values for this node. This adds the bias node before activation and
     * sets the sum output value to whatever the activation function returns.
     */
    activate() {
        this.sumOutput = this.activationFunction.fn(this.sumInput + this.bias);
    }
    /**
     * Clones this node and returns said clone with the same id, type, layer, bias weight, and activation function.
     * @returns the clone
     */
    clone() {
        const copy = new NNode(this.id, this.type, this.layer);
        copy.bias = this.bias;
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
        // bias mutation
        if (Math.random() < NNode.MutateBiasChance) {
            // bias weight will be mutated
            if (Math.random() < NNode.NudgeBiasChance) {
                // bias weight will only be nudged by 20%
                this.bias += 0.2 * this.bias * (Math.random() > 0.5 ? 1 : -1);
            }
            else {
                // bias weight will be randomized
                this.bias = NNode.GenerateRandomBias();
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
        this.bias = clamp(this.bias, NNode.MinimumBiasValue, NNode.MaximumBiasValue);
    }
}
//# sourceMappingURL=NeatNode.js.map