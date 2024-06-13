/**
 * A connection serves as the pathway between a brain's nodes within the brain's topology.
 * Each connection has a unique innovation id that allows brain's with differing topologies
 * to be compared. Connections also have weights that tell nodes how important the data is
 * from the incoming node. Connections can be enabled or disabled, where disabled connections
 * do not pass on their data while enabled ones do. Connections can also be recurrent,
 * where their incoming node's layer is greater than the outgoing node's, this can be
 * interpreted as a Brain's "memory" since inputs from one propagation can influence the output
 * of the next propagation.
 */
class Connection {
    /** The minimum value that a weight can be */
    static MinimumWeightValue = -10;
    /** The maximum value that a weight can be */
    static MaximumWeightValue = 10;
    /** The chance for the weight to get mutated */
    static MutateWeightChance = 0.8;
    /** The chance for the weight to be nudged rather than randomized when mutated */
    static NudgeWeightChance = 0.9;
    /**
     * Helper method to generate a random weight value between the minimum and maximum values.
     */
    static GenerateRandomWeight() {
        return lerp(Math.random(), 0, 1, this.MinimumWeightValue, this.MaximumWeightValue);
    }
    /** This connection's incoming node */
    inNode;
    /** This connection's outgoing node */
    outNode;
    /** This connection's weight */
    weight;
    /** Whether or not this Connection is enabled */
    enabled;
    /** Whether or not this Connection is recurrent */
    recurrent;
    /** This Connection's innovation id */
    innovationID;
    /**
     * Constructs a connection with the specified incoming node, outgoing node, weight, enabled value,
     * and recurrent value. A connection will take the incoming node's sum output value, multiply it
     * by the connection's weight, and pass it on to the outgoing node's sum input value. This transfer
     * of data only happens if the Connection is enabled.
     * @param inNode the connection's incoming node
     * @param outNode the connection's outgoing node
     * @param weight the Connection's weight
     * @param enabled whether or not the connection is enabled
     * @param recurrent whether or not the connection is recurrent
     */
    constructor(inNode, outNode, weight, enabled, recurrent) {
        this.inNode = inNode;
        this.outNode = outNode;
        this.weight = weight;
        this.enabled = enabled;
        this.recurrent = recurrent;
        this.innovationID = Innovations.GetInnovationID(inNode, outNode);
        this.inNode.connectionsOut.push(this);
        this.outNode.connectionsIn.push(this);
    }
    /**
     * Mutates this connection's weight. Mutations occur by chance, only if a call to Math.random()
     * yields a value less than the predefined static values. A connection's weight, when mutated,
     * can either be nudged or completely randomized.
     */
    mutate() {
        if (Math.random() < Connection.MutateWeightChance) {
            // connection weight will be mutated
            if (Math.random() < Connection.NudgeWeightChance) {
                // weight will only be nudged by 20%
                this.weight += 0.2 * this.weight * (Math.random() > 0.5 ? 1 : -1);
            }
            else {
                // weight will be randomized
                this.weight = Connection.GenerateRandomWeight();
            }
            this.clamp();
        }
    }
    /**
     * Clamps this connection's weight to be within predefined bounds.
     */
    clamp() {
        this.weight = clamp(this.weight, Connection.MinimumWeightValue, Connection.MaximumWeightValue);
    }
}
//# sourceMappingURL=Connection.js.map