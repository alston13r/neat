function stressTest(name, fn) {
    const start = performance.now();
    fn();
    const end = performance.now();
    const diff = end - start;
    console.log(name + ': ' + diff + ' ms');
    return diff;
}
const stressAmount = 100000;
// construct 100000 NNodes of random types
const randomTypes = new Array(stressAmount).fill(0).map(() => Math.floor(Math.random() * 3));
const resultArray = [];
const nodeType0 = randomTypes.reduce((sum, curr) => sum + (curr == 0), 0);
const nodeType1 = randomTypes.reduce((sum, curr) => sum + (curr == 1), 0);
const nodeType2 = randomTypes.reduce((sum, curr) => sum + (curr == 2), 0);
console.log(`constructions nodes with input<${nodeType0}> hidden<${nodeType1}> output<${nodeType2}>`);
stressTest('random types', () => {
    for (let i = 0; i < stressAmount; i++) {
        const node = new NNode(0, randomTypes[i], 0);
        resultArray.push(node);
    }
});
// construct 100000 input NNodes
stressTest('input type', () => {
    for (let i = 0; i < stressAmount; i++) {
        const node = new NNode(0, 0, 0);
        resultArray.push(node);
    }
});
// construct 100000 hidden NNodes
stressTest('hidden type', () => {
    for (let i = 0; i < stressAmount; i++) {
        const node = new NNode(0, 1, 0);
        resultArray.push(node);
    }
});
// construct 100000 output NNodes
stressTest('output type', () => {
    for (let i = 0; i < stressAmount; i++) {
        const node = new NNode(0, 2, 0);
        resultArray.push(node);
    }
});
//# sourceMappingURL=index.js.map