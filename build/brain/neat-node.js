var NNodeType;
(function (NNodeType) {
    NNodeType[NNodeType["Input"] = 0] = "Input";
    NNodeType[NNodeType["Hidden"] = 1] = "Hidden";
    NNodeType[NNodeType["Output"] = 2] = "Output";
})(NNodeType || (NNodeType = {}));
class NNode {
    static DefaultActivationFunctions = [
        ActivationFunction.Identity,
        ActivationFunction.Sigmoid,
        ActivationFunction.Tanh
    ];
    static AllowInputActivationMutations = false;
    static AllowHiddenActivationMutations = true;
    static AllowOutputActivationMutations = false;
    static AllowInputBiasMutations = false;
    static AllowHiddenBiasMutations = true;
    static AllowOutputBiasMutations = true;
    static MutateActivationFunctionChance = 0.03;
    static MutateBiasChance = 0.03;
    static NudgeBiasChance = 0.9;
    static MinimumBiasValue = -10;
    static MaximumBiasValue = 10;
    id;
    type;
    layer;
    bias = 0;
    connectionsIn = [];
    connectionsOut = [];
    activationFunction;
    static get DefaultInputActivationFunction() { return this.DefaultActivationFunctions[NNodeType.Input]; }
    static set DefaultInputActivationFunction(fn) { this.DefaultActivationFunctions[NNodeType.Input] = fn; }
    static get DefaultHiddenActivationFunction() { return this.DefaultActivationFunctions[NNodeType.Hidden]; }
    static set DefaultHiddenActivationFunction(fn) { this.DefaultActivationFunctions[NNodeType.Hidden] = fn; }
    static get DefaultOutputActivationFunction() { return this.DefaultActivationFunctions[NNodeType.Output]; }
    static set DefaultOutputActivationFunction(fn) { this.DefaultActivationFunctions[NNodeType.Output] = fn; }
    constructor(id, type, layer, bias = NNode.GenerateRandomBias()) {
        this.id = id;
        this.type = type;
        this.layer = layer;
        this.activationFunction = NNode.DefaultActivationFunctions[type];
        if (type != 0)
            this.bias = bias;
    }
    static GenerateRandomBias() {
        return Math.random() * (this.MaximumBiasValue - this.MinimumBiasValue) + this.MinimumBiasValue;
    }
    activate(input) {
        return this.activationFunction.fn(input + this.bias);
    }
    clone() {
        const copy = new NNode(this.id, this.type, this.layer, this.bias);
        copy.activationFunction = this.activationFunction;
        return copy;
    }
    mutate() {
        if (this.type == NNodeType.Input && NNode.AllowInputBiasMutations
            || this.type == NNodeType.Hidden && NNode.AllowHiddenBiasMutations
            || this.type == NNodeType.Output && NNode.AllowOutputBiasMutations) {
            if (Math.random() < NNode.MutateBiasChance) {
                if (Math.random() < NNode.NudgeBiasChance) {
                    this.bias += 0.2 * this.bias * (Math.random() > 0.5 ? 1 : -1);
                }
                else {
                    this.bias = NNode.GenerateRandomBias();
                }
                this.clamp();
            }
        }
        if (this.type == NNodeType.Input && NNode.AllowInputActivationMutations
            || this.type == NNodeType.Hidden && NNode.AllowHiddenActivationMutations
            || this.type == NNodeType.Output && NNode.AllowOutputActivationMutations) {
            if (Math.random() < NNode.MutateActivationFunctionChance) {
                this.activationFunction = ActivationFunction.Arr[Math.floor(Math.random() * ActivationFunction.Arr.length)];
            }
        }
    }
    clamp() {
        this.bias = clamp(this.bias, NNode.MinimumBiasValue, NNode.MaximumBiasValue);
    }
}
//# sourceMappingURL=neat-node.js.map