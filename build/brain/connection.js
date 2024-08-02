class Connection {
    static AllowWeightMutations = true;
    static MinimumWeightValue = -10;
    static MaximumWeightValue = 10;
    static MutateWeightChance = 0.8;
    static NudgeWeightChance = 0.9;
    static GenerateRandomWeight() {
        return lerp(Math.random(), 0, 1, this.MinimumWeightValue, this.MaximumWeightValue);
    }
    inNode;
    outNode;
    weight;
    enabled;
    recurrent;
    innovationID;
    id;
    constructor(id, inNode, outNode, weight, enabled = true, recurrent = false) {
        this.id = id;
        this.inNode = inNode;
        this.outNode = outNode;
        this.weight = weight;
        this.enabled = enabled;
        this.recurrent = recurrent;
        this.innovationID = Innovations.GetInnovationID(inNode.id, outNode.id);
    }
    clone() {
        return new Connection(this.id, this.inNode, this.outNode, this.weight, this.enabled, this.recurrent);
    }
    mutate() {
        if (Connection.AllowWeightMutations
            && Math.random() < Connection.MutateWeightChance) {
            if (Math.random() < Connection.NudgeWeightChance) {
                this.weight += 0.2 * this.weight * (Math.random() > 0.5 ? 1 : -1);
            }
            else {
                this.weight = Connection.GenerateRandomWeight();
            }
            this.clamp();
        }
    }
    clamp() {
        this.weight = clamp(this.weight, Connection.MinimumWeightValue, Connection.MaximumWeightValue);
    }
}
//# sourceMappingURL=connection.js.map