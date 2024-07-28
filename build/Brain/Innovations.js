class Innovations {
    static #InnovationArray = [];
    static GetInnovationID(inNode, outNode) {
        const identifier = (inNode.id << 16) + outNode.id;
        const N = this.#InnovationArray.length;
        for (let i = 0; i < N; i++) {
            const val = Innovations.#InnovationArray[i];
            if (identifier === val)
                return i;
        }
        Innovations.#InnovationArray[N] = identifier;
        return N;
    }
    static Serialize() {
        return {
            'innovations': this.#InnovationArray.slice()
        };
    }
}
//# sourceMappingURL=Innovations.js.map