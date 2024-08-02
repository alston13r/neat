var NNodeType;
(function (NNodeType) {
    NNodeType[NNodeType["Input"] = 0] = "Input";
    NNodeType[NNodeType["Hidden"] = 1] = "Hidden";
    NNodeType[NNodeType["Output"] = 2] = "Output";
})(NNodeType || (NNodeType = {}));
class NNode {
    static DefaultInputActivationFunction = ActivationFunction.Identity;
    static DefaultHiddenActivationFunction = ActivationFunction.Sigmoid;
    static DefaultOutputActivationFunction = ActivationFunction.Tanh;
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
    sumInput = 0;
    sumOutput = 0;
    bias = 0;
    connectionsIn = [];
    connectionsOut = [];
    activationFunction;
    constructor(id, type, layer, bias = NNode.GenerateRandomBias()) {
        this.id = id;
        this.type = type;
        this.layer = layer;
        if (type == NNodeType.Input)
            this.activationFunction = NNode.DefaultInputActivationFunction;
        else if (type == NNodeType.Hidden)
            this.activationFunction = NNode.DefaultHiddenActivationFunction;
        else if (type == NNodeType.Output)
            this.activationFunction = NNode.DefaultOutputActivationFunction;
        if (type != 0)
            this.bias = bias;
    }
    static GenerateRandomBias() {
        return Math.random() * (this.MaximumBiasValue - this.MinimumBiasValue) + this.MinimumBiasValue;
    }
    activate() {
        this.sumOutput = this.activationFunction.fn(this.sumInput + this.bias);
        return this.sumOutput;
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