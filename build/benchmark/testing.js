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
function assertEqualsArray(expected, actual) {
    const N = expected.length;
    if (N != actual.length)
        return false;
    for (let i = 0; i < N; i++) {
        if (expected[i] != actual[i])
            return false;
    }
    return true;
}
const expectedValues = [6, 2, 4];
function ConstructTest(fn, args, name, amount = 1) {
    return () => {
        console.log(`Conducting test <${name}>`);
        let results = [];
        const start = performance.now();
        let index = 0;
        while (index < amount) {
            if (index == 0)
                results = fn(...args);
            else
                void fn(...args);
            index++;
        }
        const end = performance.now();
        const diff = end - start;
        return [diff, diff / amount, assertEqualsArray(expectedValues, results)];
    };
}
const brainALike = ConnectionLike.FromValues([0, 1, 2, 4, 6, 7, 9]);
const brainBLike = ConnectionLike.FromValues([0, 1, 3, 4, 5, 7, 8, 10, 12]);
const testAmount = 10000000;
const tests = [
    ConstructTest(CompareMethod1, [brainALike, brainBLike], 'Method 1: original', testAmount),
    ConstructTest(CompareMethod2, [brainALike, brainBLike], 'Method 2: first attempt at binary hell', testAmount),
    ConstructTest(CompareMethod3, [brainALike, brainBLike], 'Method 3: added brackets around inside, this is useless', testAmount),
    ConstructTest(CompareMethod4, [brainALike, brainBLike], 'Method 4: rearranged boolean comparisons', testAmount),
    ConstructTest(CompareMethod5, [brainALike, brainBLike], 'Method 5: larger if blocks, ordered for quickest exit or smthn', testAmount),
    ConstructTest(CompareMethod6, [brainALike, brainBLike], 'Method 6: check H flag at beginning of loop, excess quickly calculated, removed unnecessary boolean checks', testAmount),
    ConstructTest(CompareMethod7, [brainALike, brainBLike], 'Method 7: removed intermediate dp and ep', testAmount),
    ConstructTest(CompareMethod8, [brainALike, brainBLike], 'Method 8: streamlined conditionals', testAmount),
    ConstructTest(CompareMethod9, [brainALike, brainBLike], 'Method 9: more streamlined conditionals', testAmount)
];
tests.forEach(test => {
    const results = test();
    const timeTotal = results[0];
    const timeAvg = results[1];
    const success = results[2];
    console.log((success ? 'Success' : 'Failure')
        + `: Total<${timeTotal} ms> Average<${timeAvg} ms>`);
});
function CompareMethod1(brainA, brainB) {
    const enabledA = brainA;
    const enabledB = brainB;
    let disjoint = 0;
    let excess = 0;
    let overlap = 0;
    let i = 0;
    let j = 0;
    const maxI = enabledA.length - 1;
    const maxJ = enabledB.length - 1;
    while (i <= maxI && j <= maxJ) {
        const currLeft = enabledA[i];
        const currRight = enabledB[j];
        const leftID = currLeft.innovationID;
        const rightID = currRight.innovationID;
        let di = 1;
        let dj = 1;
        if (leftID == rightID) {
            overlap++;
        }
        else if (leftID < rightID) {
            if (i == maxI)
                excess++;
            else {
                disjoint++;
                dj = 0;
            }
        }
        else {
            if (j == maxJ)
                excess++;
            else {
                disjoint++;
                di = 0;
            }
        }
        if (i == maxI)
            di = 0;
        if (j == maxJ)
            dj = 0;
        if (i == maxI && j == maxJ)
            break;
        i += di;
        j += dj;
    }
    return [disjoint, excess, overlap];
}
function CompareMethod2(brainA, brainB) {
    let A = false;
    let B = false;
    let C = false;
    let D = false;
    let E = false;
    let F = false;
    let G = false;
    let disjoint = 0;
    let excess = 0;
    let overlap = 0;
    const iMax = brainA.length - 1;
    const jMax = brainB.length - 1;
    let i = 0;
    let j = 0;
    const maxIters = brainA.length + brainB.length;
    for (let iter = 0; iter < maxIters; iter++) {
        const left = brainA[i];
        const right = brainB[j];
        const leftInnovation = left.innovationID;
        const rightInnovation = right.innovationID;
        C = i == iMax;
        D = j == jMax;
        E = rightInnovation > leftInnovation;
        F = leftInnovation > rightInnovation;
        A = (!C && (D && !E || !F));
        if (A) {
            i++;
        }
        B = !D && (!E || !F && C && E);
        if (B) {
            j++;
        }
        if (E && (A || B || D || !C) || F && (A || B || C || !D)) {
            if (!G)
                disjoint++;
        }
        if (D && F || C && E) {
            excess++;
        }
        if (!E && !F) {
            overlap++;
        }
        if (!G && (!A && B && !C && D && !E && F
            || !A && B && C && !D && E && !F)) {
            G = true;
        }
        if (C && D)
            break;
    }
    return [disjoint, excess, overlap];
}
function CompareMethod3(brainA, brainB) {
    {
        let A = false;
        let B = false;
        let C = false;
        let D = false;
        let E = false;
        let F = false;
        let G = false;
        let disjoint = 0;
        let excess = 0;
        let overlap = 0;
        const iMax = brainA.length - 1;
        const jMax = brainB.length - 1;
        let i = 0;
        let j = 0;
        const maxIters = brainA.length + brainB.length;
        for (let iter = 0; iter < maxIters; iter++) {
            const left = brainA[i];
            const right = brainB[j];
            const leftInnovation = left.innovationID;
            const rightInnovation = right.innovationID;
            C = i == iMax;
            D = j == jMax;
            E = rightInnovation > leftInnovation;
            F = leftInnovation > rightInnovation;
            A = (!C && (D && !E || !F));
            if (A) {
                i++;
            }
            B = !D && (!E || !F && C && E);
            if (B) {
                j++;
            }
            if (E && (A || B || D || !C) || F && (A || B || C || !D)) {
                if (!G)
                    disjoint++;
            }
            if (D && F || C && E) {
                excess++;
            }
            if (!E && !F) {
                overlap++;
            }
            if (!G && (!A && B && !C && D && !E && F
                || !A && B && C && !D && E && !F)) {
                G = true;
            }
            if (C && D)
                break;
        }
        return [disjoint, excess, overlap];
    }
}
function CompareMethod4(brainA, brainB) {
    let A = false;
    let B = false;
    let C = false;
    let D = false;
    let E = false;
    let F = false;
    let G = false;
    let disjoint = 0;
    let excess = 0;
    let overlap = 0;
    const iMax = brainA.length - 1;
    const jMax = brainB.length - 1;
    let i = 0;
    let j = 0;
    const maxIters = brainA.length + brainB.length;
    for (let iter = 0; iter < maxIters; iter++) {
        const left = brainA[i];
        const right = brainB[j];
        const leftInnovation = left.innovationID;
        const rightInnovation = right.innovationID;
        C = i == iMax;
        D = j == jMax;
        E = rightInnovation > leftInnovation;
        F = leftInnovation > rightInnovation;
        A = !C && (!F || D && !E);
        if (A)
            i++;
        B = !D && (!E || !F && C && E);
        if (B)
            j++;
        if (E && (A || B || D || !C) || F && (A || B || C || !D)) {
            if (!G)
                disjoint++;
        }
        if (C && E || D && F) {
            excess++;
        }
        if (!E && !F) {
            overlap++;
        }
        if (!G && !A && B && (D && F && !C && !E || C && E && !D && !F)) {
            G = true;
        }
        if (C && D)
            break;
    }
    return [disjoint, excess, overlap];
}
function CompareMethod5(brainA, brainB) {
    let disjoint = 0;
    let excess = 0;
    let overlap = 0;
    let A = false;
    let B = false;
    let C = false;
    let D = false;
    let E = false;
    let F = false;
    let G = false;
    let H = false;
    let i = 0;
    let j = 0;
    const iMax = brainA.length - 1;
    const jMax = brainB.length - 1;
    const iterMax = brainA.length + brainB.length;
    for (let iter = 0; iter < iterMax; iter++) {
        const left = brainA[i];
        const right = brainB[j];
        const leftID = left.innovationID;
        const rightID = right.innovationID;
        C = i == iMax;
        D = j == jMax;
        E = leftID < rightID;
        F = leftID > rightID;
        G = leftID == rightID;
        if (G) {
            overlap++;
        }
        else {
            const dp = !H && (E || F);
            if (dp) {
                disjoint++;
            }
            const ep = !E && F && D || E && !F && C;
            if (ep) {
                excess++;
            }
            if (!H && dp && ep) {
                H = true;
            }
        }
        A = !C && (G || E || H);
        B = !D && (G || F || H);
        if (A)
            i++;
        if (B)
            j++;
        if (!A && !B)
            break;
    }
    return [disjoint, excess, overlap];
}
function CompareMethod6(brainA, brainB) {
    let disjoint = 0;
    let excess = 0;
    let overlap = 0;
    let A = false;
    let B = false;
    let C = false;
    let D = false;
    let E = false;
    let F = false;
    let G = false;
    let H = false;
    let i = 0;
    let j = 0;
    const iMax = brainA.length - 1;
    const jMax = brainB.length - 1;
    const iterMax = brainA.length + brainB.length;
    for (let iter = 0; iter < iterMax; iter++) {
        if (H) {
            excess += iMax - i + jMax - j + 1;
            break;
        }
        const left = brainA[i];
        const right = brainB[j];
        const leftID = left.innovationID;
        const rightID = right.innovationID;
        C = i == iMax;
        D = j == jMax;
        E = leftID < rightID;
        F = leftID > rightID;
        G = leftID == rightID;
        if (G)
            overlap++;
        else {
            const dp = E || F;
            if (dp)
                disjoint++;
            const ep = D && F && !E || C && E && !F;
            if (ep)
                excess++;
            H = dp && ep;
        }
        A = !C && (G || E || H);
        B = !D && (G || F || H);
        if (A)
            i++;
        if (B)
            j++;
        if (!A && !B)
            break;
    }
    return [disjoint, excess, overlap];
}
function CompareMethod7(brainA, brainB) {
    let disjoint = 0;
    let excess = 0;
    let overlap = 0;
    let A = false;
    let B = false;
    let C = false;
    let D = false;
    let E = false;
    let F = false;
    let G = false;
    let H = false;
    let i = 0;
    let j = 0;
    const iMax = brainA.length - 1;
    const jMax = brainB.length - 1;
    const iterMax = brainA.length + brainB.length;
    for (let iter = 0; iter < iterMax; iter++) {
        if (H) {
            excess += iMax - i + jMax - j + 1;
            break;
        }
        const left = brainA[i];
        const right = brainB[j];
        const leftID = left.innovationID;
        const rightID = right.innovationID;
        C = i == iMax;
        D = j == jMax;
        E = leftID < rightID;
        F = leftID > rightID;
        G = leftID == rightID;
        if (G)
            overlap++;
        else {
            disjoint++;
            H = D && F && !E || C && E && !F;
            if (H)
                excess++;
        }
        A = !C && (G || E || H);
        B = !D && (G || F || H);
        if (A)
            i++;
        if (B)
            j++;
        if (!A && !B)
            break;
    }
    return [disjoint, excess, overlap];
}
function CompareMethod8(brainA, brainB) {
    let disjoint = 0;
    let excess = 0;
    let overlap = 0;
    let A = false;
    let B = false;
    let C = false;
    let D = false;
    let E = false;
    let F = false;
    let G = false;
    let H = false;
    let i = 0;
    let j = 0;
    const iMax = brainA.length - 1;
    const jMax = brainB.length - 1;
    const iterMax = brainA.length + brainB.length;
    for (let iter = 0; iter < iterMax; iter++) {
        if (H) {
            excess += iMax - i + jMax - j + 1;
            break;
        }
        const left = brainA[i];
        const right = brainB[j];
        const leftID = left.innovationID;
        const rightID = right.innovationID;
        C = i == iMax;
        D = j == jMax;
        E = leftID < rightID;
        F = leftID > rightID;
        G = leftID == rightID;
        if (G) {
            overlap++;
            A = !C;
            B = !D;
        }
        else {
            disjoint++;
            H = D && F && !E || C && E && !F;
            A = !C;
            B = !D;
            if (H)
                excess++;
            else {
                A &&= E;
                B &&= F;
            }
        }
        if (A)
            i++;
        if (B)
            j++;
        if (!A && !B)
            break;
    }
    return [disjoint, excess, overlap];
}
function CompareMethod9(brainA, brainB) {
    let disjoint = 0;
    let excess = 0;
    let overlap = 0;
    let A = false;
    let B = false;
    let C = false;
    let D = false;
    let E = false;
    let F = false;
    let G = false;
    let H = false;
    let i = 0;
    let j = 0;
    const iMax = brainA.length - 1;
    const jMax = brainB.length - 1;
    const iterMax = brainA.length + brainB.length;
    for (let iter = 0; iter < iterMax; iter++) {
        if (H) {
            excess += iMax - i + jMax - j + 1;
            break;
        }
        const left = brainA[i];
        const right = brainB[j];
        const leftID = left.innovationID;
        const rightID = right.innovationID;
        C = i == iMax;
        D = j == jMax;
        E = leftID < rightID;
        F = leftID > rightID;
        G = leftID == rightID;
        A = !C;
        B = !D;
        if (G)
            overlap++;
        else {
            disjoint++;
            H = D && F && !E || C && E && !F;
            if (H)
                excess++;
            else {
                A &&= E;
                B &&= F;
            }
        }
        if (!A && !B)
            break;
        if (A)
            i++;
        if (B)
            j++;
    }
    return [disjoint, excess, overlap];
}
//# sourceMappingURL=testing.js.map