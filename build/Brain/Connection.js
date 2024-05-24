var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _Connection_InnovationIndex, _Connection_InnovationMap, _Connection_GetInnovationID;
/**
 * A connection serves as the pathway between Brain Nodes within the Brain's topology.
 * Each connection has a unique innovation id that allows Brain's with differing topologies
 * to be compared. Connections also have weights that tell Node's how important the data is
 * from the incoming Node. Connections can be enabled or disabled, where disabled connections
 * do not pass on their data while enabled ones do. Connections can also be recurrent,
 * where their incoming Node's layer is greater than the outgoing Node's, this can be
 * interpreted as a Brain's "memory" since inputs from one propagation can influence the output
 * of the next propagation.
 */
class Connection {
    /**
     * Public helper method to return the innovation id for the specified
     * input Node and output Node.
     * @param inNode the incoming Node
     * @param outNode the outgoing Node
     * @returns the innovation id
     */
    static GetInnovationID(inNode, outNode) {
        return __classPrivateFieldGet(this, _a, "m", _Connection_GetInnovationID).call(this, inNode, outNode);
    }
    /**
     * Helper method to generate a random weight value between the minimum and maximum
     * values. This is used since writing Math.random() in place of calling this would lead
     * to a lot of numbers needing to be changed when you can just change the static minimum
     * and maximum values.
     */
    static GenerateRandomWeight() {
        return Math.random() * (_a.MaximumWeightValue - _a.MinimumWeightValue) + _a.MinimumWeightValue;
    }
    /**
     * Constructs a Connection with the specified incoming Node, outgoing Node, weight, enabled value,
     * and recurrent value. A Connection will take the incoming Node's sum output value, multiply it
     * by the Connection's weight, and pass it on to the outgoing Node's sum input value. This transfer
     * of data only happens if the Connection is enabled.
     * @param inNode the Connection's incoming Node
     * @param outNode the Connection's outgoing Node
     * @param weight the Connection's weight
     * @param enabled whether or not the Connection is enabled
     * @param recurrent whether or not the Connection is recurrent
     */
    constructor(inNode, outNode, weight, enabled, recurrent) {
        this.inNode = inNode;
        this.outNode = outNode;
        this.weight = weight;
        this.enabled = enabled;
        this.recurrent = recurrent;
        this.innovationID = __classPrivateFieldGet(_a, _a, "m", _Connection_GetInnovationID).call(_a, inNode, outNode);
        this.inNode.connectionsOut.push(this);
        this.outNode.connectionsIn.push(this);
    }
    /**
     * Mutates this Connection's weight. Mutations occur by chance, only if a call to Math.random()
     * yields a value less than the predefined static values. A Connection's weight, when mutated,
     * can either be nudged or completely randomized.
     */
    mutate() {
        if (Math.random() < _a.MutateWeightChance) {
            // connection weight will be mutated
            if (Math.random() < _a.NudgeWeightChance) {
                // weight will only be nudged by 20%
                this.weight += 0.2 * this.weight * (Math.random() > 0.5 ? 1 : -1);
            }
            else {
                // weight will be randomized
                this.weight = _a.GenerateRandomWeight();
            }
            this.clamp();
        }
    }
    /**
     * Clamps this Connection's weight to be within predefined bounds.
     */
    clamp() {
        this.weight = Math.min(_a.MaximumWeightValue, Math.max(_a.MinimumWeightValue, this.weight));
    }
}
_a = Connection, _Connection_GetInnovationID = function _Connection_GetInnovationID(inNode, outNode) {
    var _b;
    // concatenate ids
    const innovationString = inNode.id + ':' + outNode.id;
    if (!__classPrivateFieldGet(this, _a, "f", _Connection_InnovationMap).has(innovationString)) {
        // increment innovation counter and set value accordingly
        __classPrivateFieldGet(this, _a, "f", _Connection_InnovationMap).set(innovationString, __classPrivateFieldSet(this, _a, (_b = __classPrivateFieldGet(this, _a, "f", _Connection_InnovationIndex), ++_b), "f", _Connection_InnovationIndex));
    }
    // return the innovation id
    return __classPrivateFieldGet(this, _a, "f", _Connection_InnovationMap).get(innovationString);
};
/** The minimum value that a weight can be */
Connection.MinimumWeightValue = -10;
/** The maximum value that a weight can be */
Connection.MaximumWeightValue = 10;
/** The chance for the weight to get mutated */
Connection.MutateWeightChance = 0.8;
/** The chance for the weight to be nudged rather than randomized when mutated */
Connection.NudgeWeightChance = 0.9;
/** Toggle for connection disabling mutations */
Connection.AllowDisablingConnections = false;
/** The chance for a connection to be disabled when mutated */
Connection.DisableConnectionChance = 0;
/** The current global innovation index, this increments when an innovation is made */
_Connection_InnovationIndex = { value: 0 };
/**
 * A Map containing all currently known innovations. The keys are a concatenation of
 * the input node id, a colon, and the output node id. The values are the innovation ids
 * which are made whenever a new innovation is found.
 */
_Connection_InnovationMap = { value: new Map() };
//# sourceMappingURL=Connection.js.map