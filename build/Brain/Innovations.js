/**
 * Utility class to manage global innovation IDs and their retrieval during
 * the connection construction process.
 */
class Innovations {
    /**
     * Helper method to retrieve innovation ids and generate them if they are new.
     * @param inNode the connection's incoming node
     * @param outNode the connection's outgoing node
     * @returns the connection's innovation id
     */
    static GetInnovationID(inNode, outNode) {
        // concatenate ids
        const innovationString = inNode.id + ':' + outNode.id;
        if (!this.InnovationMap.has(innovationString)) {
            // increment innovation counter and set value accordingly
            this.InnovationMap.set(innovationString, ++this.InnovationIndex);
        }
        // return the innovation id
        return this.InnovationMap.get(innovationString);
    }
}
/** The current global innovation index, this increments when an innovation is made */
Innovations.InnovationIndex = 0;
/**
 * A Map containing all currently known innovations. The keys are a concatenation of
 * the input node id, a colon, and the output node id. The values are the innovation ids
 * which are made whenever a new innovation is found.
 */
Innovations.InnovationMap = new Map();
//# sourceMappingURL=Innovations.js.map