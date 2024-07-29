function stressTest(name: string, fn: Function) {
  const start = performance.now()
  fn()
  const end = performance.now()
  const diff = end - start
  console.log(name + ': ' + diff + ' ms')
  return diff
}

const stressAmount = 100000
// construct 100000 NNodes of random types
const randomTypes = new Array(stressAmount).fill(0).map(() => Math.floor(Math.random() * 3))
const resultArray: NNode[] = []
const nodeType0 = randomTypes.reduce((sum, curr) => sum + (<unknown>(curr == 0) as number), 0)
const nodeType1 = randomTypes.reduce((sum, curr) => sum + (<unknown>(curr == 1) as number), 0)
const nodeType2 = randomTypes.reduce((sum, curr) => sum + (<unknown>(curr == 2) as number), 0)

console.log(`constructions nodes with input<${nodeType0}> hidden<${nodeType1}> output<${nodeType2}>`)

stressTest('random types', () => {
  for (let i = 0; i < stressAmount; i++) {
    const node = new NNode(0, randomTypes[i], 0)
    resultArray.push(node)
  }
})

resultArray.length = 0
// construct 100000 input NNodes
stressTest('input type', () => {
  for (let i = 0; i < stressAmount; i++) {
    const node = new NNode(0, 0, 0)
    resultArray.push(node)
  }
})

resultArray.length = 0
// construct 100000 hidden NNodes
stressTest('hidden type', () => {
  for (let i = 0; i < stressAmount; i++) {
    const node = new NNode(0, 1, 0)
    resultArray.push(node)
  }
})

resultArray.length = 0
// construct 100000 output NNodes
stressTest('output type', () => {
  for (let i = 0; i < stressAmount; i++) {
    const node = new NNode(0, 2, 0)
    resultArray.push(node)
  }
})