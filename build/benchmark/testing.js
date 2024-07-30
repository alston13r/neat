class ConnectionLike {
    innovationID;
    weight;
    constructor(innovationID, weight = Math.random() * 2 - 1) {
        this.weight = weight;
        this.innovationID = innovationID;
    }
    static FromValues(arr) {
        return arr.map(x => new ConnectionLike(x));
    }
}
// through the power of binary and truth tables, this is the better algorithm (probably)
const tests = [
    () => {
        const b1 = ConnectionLike.FromValues([0, 1, 2, 4, 6, 7, 9]);
        const b2 = ConnectionLike.FromValues([0, 1, 3, 4, 5, 7, 8, 10, 12]);
        const res = UltimateCompare(b1, b2);
        console.log(b1.map(c => c.innovationID));
        console.log(b2.map(c => c.innovationID));
        console.log(res);
    }
];
// for (const test of tests) {
// test()
// }
function UltimateCompare(brainA, brainB) {
    let A = false; // incremented i
    let B = false; // incremented j
    let C = false; // i is at max
    let D = false; // j is at max
    let E = false; // right innovation > left innovation
    let F = false; // left innovation > right innovation
    let bootleg = false; // flag added after-the-fact because i can't think of anything else
    let disjoint = 0;
    let excess = 0;
    let overlap = 0;
    const iMax = brainA.length - 1;
    const jMax = brainB.length - 1;
    let i = 0;
    let j = 0;
    console.log(`Comparing brains with lengths <${brainA.length}, ${brainB.length}>`);
    const maxIters = brainA.length + brainB.length;
    for (let iter = 0; iter < maxIters; iter++) {
        const left = brainA[i];
        const right = brainB[j];
        const leftInnovation = left.innovationID;
        const rightInnovation = right.innovationID;
        console.log(`iter<${iter}> left<${leftInnovation}> right<${rightInnovation}>`);
        C = i == iMax;
        D = j == jMax;
        E = rightInnovation > leftInnovation;
        F = leftInnovation > rightInnovation;
        console.log(`right (${rightInnovation}) > left (${leftInnovation}) -> ${E}`);
        console.log(`left (${leftInnovation}) > right (${rightInnovation}) -> ${F}`);
        console.log([A, B, C, D, E, F].map(x => x ? 1 : 0));
        A = (!C && (D && !E || !F)); // increment i
        if (A) {
            console.log('increment i');
            i++;
        }
        B = !D && (!E || !F && C && E);
        if (B) { // increment j
            console.log('increment j');
            j++;
        }
        if (E && (A || B || D || !C) || F && (A || B || C || !D)) { // disjoint connection
            if (bootleg) {
                console.log('left could not increase, ignoring disjoint');
            }
            else {
                console.log('connection is disjoint');
                disjoint++;
            }
        }
        if (D && F || C && E) { // excess connection
            console.log('connection is excess');
            excess++;
        }
        if (!E && !F) { // overlapping connections
            console.log('connections are overlapping');
            overlap++;
        }
        if (!bootleg && !A && B && !C && D && !E && F
            || !A && B && C && !D && E && !F) {
            console.log('one side is at limit, disabling disjoint counter');
            bootleg = true;
        }
        console.log(`i is${C ? '' : ' not'} at max`);
        console.log(`j is${D ? '' : ' not'} at max`);
        if (C && D)
            console.log(`both i and j are at max, exiting loop`);
        if (C && D)
            break;
    }
    return [disjoint, excess, overlap];
}
//# sourceMappingURL=testing.js.map