class ConnectionLike {
    innovationID;
    weight;
    constructor(innovationID, weight = Math.random() * 2 - 1) {
        this.weight = weight;
        this.innovationID = innovationID;
    }
}
const b1 = [
    new ConnectionLike(0),
    new ConnectionLike(1),
    new ConnectionLike(2),
    new ConnectionLike(5),
    new ConnectionLike(6)
];
const b2 = [
    new ConnectionLike(0),
    new ConnectionLike(1),
    new ConnectionLike(3),
    new ConnectionLike(4),
    new ConnectionLike(6),
    new ConnectionLike(7)
];
Compare(b1, b2);
// static Compare(brainA: Brain, brainB: Brain) {
function Compare(brainA, brainB) {
    console.log('A: ' + brainA.map(c => c.innovationID));
    console.log('B: ' + brainB.map(c => c.innovationID));
    // const enabledA = brainA.getSortedConnections()
    // const enabledB = brainB.getSortedConnections()
    const enabledA = brainA;
    const enabledB = brainB;
    // const N = Math.max(enabledA.length, enabledB.length)
    const setA = new Set(enabledA.map(c => c.innovationID));
    const setB = new Set(enabledB.map(c => c.innovationID));
    const difference = setA.symmetricDifference(setB);
    let disjoint = difference.size;
    const maxA = enabledA[enabledA.length - 1].innovationID;
    const maxB = enabledB[enabledB.length - 1].innovationID;
    let excess = 0;
    if (maxA != maxB) {
        const limit = Math.min(maxB, maxA);
        excess = [...difference].filter(id => id > limit).length;
        disjoint -= excess;
    }
    const overlap = setA.intersection(setB);
    let weights = 0;
    let i = 0;
    let j = 0;
    for (const targetID of overlap) {
        let left = enabledA[i++];
        let right = enabledB[j++];
        while (left.innovationID < targetID)
            left = enabledA[i++];
        while (right.innovationID < targetID)
            right = enabledB[j++];
        weights += Math.abs(left.weight - right.weight);
    }
    // excess *= Species.ExcessFactor / N
    // disjoint *= Species.DisjointFactor / N
    // weights *= Species.WeightFactor
    // return excess + disjoint + weights
}
//# sourceMappingURL=testing.js.map