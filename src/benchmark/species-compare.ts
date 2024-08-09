declare type BrainBenchmark = ConnectionBenchmark[]

class ConnectionBenchmark {
  innovationID: number
  weight: number

  constructor(innovationID: number, weight = Math.random() * 2 - 1) {
    this.weight = weight
    this.innovationID = innovationID
  }

  static FromValues(arr: number[]): BrainBenchmark {
    return arr.map(x => new ConnectionBenchmark(x))
  }
}

function assertEqualsArray(expected: number[], actual: number[]) {
  const N = expected.length
  if (N != actual.length) return false
  for (let i = 0; i < N; i++) {
    if (expected[i] != actual[i]) return false
  }
  return true
}

const expectedValues = [6, 2, 4]

function ConstructTest(fn: Function, args: Object[], name: string, amount = 1) {
  return () => {
    console.log(`Conducting test <${name}>`)
    let results = []
    const start = performance.now()
    let index = 0
    while (index < amount) {
      if (index == 0) results = fn(...args)
      else void fn(...args)
      index++
    }
    const end = performance.now()
    const diff = end - start
    return [diff, diff / amount, assertEqualsArray(expectedValues, results)]
  }
}

const brainALike = ConnectionBenchmark.FromValues([0, 1, 2, 4, 6, 7, 9])
const brainBLike = ConnectionBenchmark.FromValues([0, 1, 3, 4, 5, 7, 8, 10, 12])

const testAmount = 10000000

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
]

tests.forEach(test => {
  const results = test()
  const timeTotal = results[0]
  const timeAvg = results[1]
  const success = results[2]
  console.log(
    (success ? 'Success' : 'Failure')
    + `: Total<${timeTotal} ms> Average<${timeAvg} ms>`
  )
})

function CompareMethod1(brainA: BrainBenchmark, brainB: BrainBenchmark) {
  const enabledA = brainA
  const enabledB = brainB

  let disjoint = 0
  let excess = 0
  let overlap = 0

  let i = 0
  let j = 0
  const maxI = enabledA.length - 1
  const maxJ = enabledB.length - 1

  while (i <= maxI && j <= maxJ) {
    const currLeft = enabledA[i]
    const currRight = enabledB[j]
    const leftID = currLeft.innovationID
    const rightID = currRight.innovationID
    let di = 1
    let dj = 1
    if (leftID == rightID) {
      overlap++
    } else if (leftID < rightID) {
      if (i == maxI) excess++
      else {
        disjoint++
        dj = 0
      }
    } else {
      if (j == maxJ) excess++
      else {
        disjoint++
        di = 0
      }
    }
    if (i == maxI) di = 0
    if (j == maxJ) dj = 0
    if (i == maxI && j == maxJ) break
    i += di
    j += dj
  }

  return [disjoint, excess, overlap]
}

/**
 * through the power of binary and truth tables,
 * this is the better algorithm (probably)
 */
function CompareMethod2(brainA: ConnectionBenchmark[], brainB: ConnectionBenchmark[]) {
  let A = false // incremented i
  let B = false // incremented j
  let C = false // i is at max
  let D = false // j is at max
  let E = false // right innovation > left innovation
  let F = false // left innovation > right innovation
  let G = false // flag added after-the-fact because i can't think of anything else

  let disjoint = 0
  let excess = 0
  let overlap = 0

  const iMax = brainA.length - 1
  const jMax = brainB.length - 1
  let i = 0
  let j = 0

  // console.log(`Comparing brains with lengths <${brainA.length}, ${brainB.length}>`)

  const maxIters = brainA.length + brainB.length
  for (let iter = 0; iter < maxIters; iter++) {
    const left = brainA[i]
    const right = brainB[j]
    const leftInnovation = left.innovationID
    const rightInnovation = right.innovationID
    // console.log(`iter<${iter}> left<${leftInnovation}> right<${rightInnovation}>`)
    C = i == iMax
    D = j == jMax
    E = rightInnovation > leftInnovation
    F = leftInnovation > rightInnovation
    // console.log(`right (${rightInnovation}) > left (${leftInnovation}) -> ${E}`)
    // console.log(`left (${leftInnovation}) > right (${rightInnovation}) -> ${F}`)
    // console.log([A, B, C, D, E, F].map(x => x ? 1 : 0))
    A = (!C && (D && !E || !F)) // increment i
    if (A) {
      // console.log('increment i')
      i++
    }
    B = !D && (!E || !F && C && E)
    if (B) { // increment j
      // console.log('increment j')
      j++
    }
    if (E && (A || B || D || !C) || F && (A || B || C || !D)) { // disjoint connection
      if (!G) disjoint++
      // if (bootleg) {
      //   // console.log('left could not increase, ignoring disjoint')
      // } else {
      //   // console.log('connection is disjoint')
      //   disjoint++
      // }
    }
    if (D && F || C && E) { // excess connection
      // console.log('connection is excess')
      excess++
    }
    if (!E && !F) { // overlapping connections
      // console.log('connections are overlapping')
      overlap++
    }
    if (!G && (!A && B && !C && D && !E && F
      || !A && B && C && !D && E && !F)) {
      // console.log('one side is at limit, disabling disjoint counter')
      G = true
    }

    // console.log(`i is${C ? '' : ' not'} at max`)
    // console.log(`j is${D ? '' : ' not'} at max`)
    // if (C && D) console.log(`both i and j are at max, exiting loop`)
    if (C && D) break
  }
  return [disjoint, excess, overlap]
}

function CompareMethod3(brainA: ConnectionBenchmark[], brainB: ConnectionBenchmark[]) {
  {
    let A = false // incremented i
    let B = false // incremented j
    let C = false // i is at max
    let D = false // j is at max
    let E = false // right innovation > left innovation
    let F = false // left innovation > right innovation
    let G = false // counting excess connections

    let disjoint = 0
    let excess = 0
    let overlap = 0

    const iMax = brainA.length - 1
    const jMax = brainB.length - 1
    let i = 0
    let j = 0

    const maxIters = brainA.length + brainB.length
    for (let iter = 0; iter < maxIters; iter++) {
      const left = brainA[i]
      const right = brainB[j]
      const leftInnovation = left.innovationID
      const rightInnovation = right.innovationID
      C = i == iMax
      D = j == jMax
      E = rightInnovation > leftInnovation
      F = leftInnovation > rightInnovation
      A = (!C && (D && !E || !F)) // increment i
      if (A) {
        i++
      }
      B = !D && (!E || !F && C && E)
      if (B) { // increment j
        j++
      }
      if (E && (A || B || D || !C) || F && (A || B || C || !D)) { // disjoint connection
        if (!G) disjoint++
      }
      if (D && F || C && E) { // excess connection
        excess++
      }
      if (!E && !F) { // overlapping connections
        overlap++
      }
      if (!G && (!A && B && !C && D && !E && F
        || !A && B && C && !D && E && !F)) {
        G = true
      }
      if (C && D) break
    }
    return [disjoint, excess, overlap]
  }
}

function CompareMethod4(brainA: ConnectionBenchmark[], brainB: ConnectionBenchmark[]) {
  let A = false // incremented i
  let B = false // incremented j
  let C = false // i is at max
  let D = false // j is at max
  let E = false // right innovation > left innovation
  let F = false // left innovation > right innovation
  let G = false // counting excess connections

  let disjoint = 0
  let excess = 0
  let overlap = 0

  const iMax = brainA.length - 1
  const jMax = brainB.length - 1
  let i = 0
  let j = 0

  const maxIters = brainA.length + brainB.length
  for (let iter = 0; iter < maxIters; iter++) {
    const left = brainA[i]
    const right = brainB[j]
    const leftInnovation = left.innovationID
    const rightInnovation = right.innovationID
    C = i == iMax
    D = j == jMax
    E = rightInnovation > leftInnovation
    F = leftInnovation > rightInnovation
    A = !C && (!F || D && !E) // increment i
    if (A) i++
    B = !D && (!E || !F && C && E) // increment j
    if (B) j++
    if (E && (A || B || D || !C) || F && (A || B || C || !D)) { // disjoint connection
      if (!G) disjoint++
    }
    if (C && E || D && F) { // excess connection
      excess++
    }
    if (!E && !F) { // overlapping connections
      overlap++
    }
    if (!G && !A && B && (D && F && !C && !E || C && E && !D && !F)) {
      G = true
    }
    if (C && D) break
  }
  return [disjoint, excess, overlap]
}

/**
 * Second attempt at boolean hell, hopefully this one is better
 */
function CompareMethod5(brainA: ConnectionBenchmark[], brainB: ConnectionBenchmark[]) {
  // console.log('Brain A: [' + brainA.map(x => x.innovationID).join(', ') + ']')
  // console.log('Brain B: [' + brainB.map(x => x.innovationID).join(', ') + ']')

  let disjoint = 0
  let excess = 0
  let overlap = 0

  let A = false // incremented i
  let B = false // incremented j
  let C = false // iMax
  let D = false // jMax
  let E = false // left < right
  let F = false // left > right
  let G = false // left = right
  let H = false // counting excess

  let i = 0
  let j = 0
  const iMax = brainA.length - 1
  const jMax = brainB.length - 1

  // console.log(`iMax<${iMax}> jMax<${jMax}>`)

  const iterMax = brainA.length + brainB.length
  for (let iter = 0; iter < iterMax; iter++) {
    const left = brainA[i]
    const right = brainB[j]
    const leftID = left.innovationID
    const rightID = right.innovationID

    // console.log(`i<${i}> left<${leftID}>`)
    // console.log(`j<${j}> right<${rightID}>`)

    C = i == iMax
    D = j == jMax
    E = leftID < rightID
    F = leftID > rightID
    G = leftID == rightID

    // console.log(`iMax<${C}> jMax<${D}>`)
    // console.log(`left < right (${E})`)
    // console.log(`left > right (${F})`)
    // console.log(`left = right (${G})`)

    if (G) {
      // console.log(`Overlap (${overlap} -> ${overlap + 1})`)
      overlap++
    }
    else {
      const dp = !H && (E || F)
      if (dp) {
        // console.log(`Disjoint (${disjoint} -> ${disjoint + 1})`)
        disjoint++
      }
      const ep = !E && F && D || E && !F && C
      if (ep) {
        // console.log(`Excess (${excess} -> ${excess + 1})`)
        excess++
      }
      if (!H && dp && ep) {
        // console.log(`Excess only from here on out`)
        H = true
      }
    }

    A = !C && (G || E || H)
    B = !D && (G || F || H)
    // console.log(`i (${i} -> ${A ? i + 1 : i})`)
    // console.log(`j (${j} -> ${B ? j + 1 : j})`)
    if (A) i++
    if (B) j++
    if (!A && !B) break
  }

  return [disjoint, excess, overlap]
}

/**
 * FINALLY, the boolean hell works and it works nicely
 */
function CompareMethod6(brainA: ConnectionBenchmark[], brainB: ConnectionBenchmark[]) {
  let disjoint = 0
  let excess = 0
  let overlap = 0

  let A = false // incremented i
  let B = false // incremented j
  let C = false // iMax
  let D = false // jMax
  let E = false // left < right
  let F = false // left > right
  let G = false // left = right
  let H = false // counting excess

  let i = 0
  let j = 0
  const iMax = brainA.length - 1
  const jMax = brainB.length - 1

  const iterMax = brainA.length + brainB.length
  for (let iter = 0; iter < iterMax; iter++) {
    if (H) {
      excess += iMax - i + jMax - j + 1
      break
    }

    const left = brainA[i]
    const right = brainB[j]
    const leftID = left.innovationID
    const rightID = right.innovationID

    C = i == iMax
    D = j == jMax
    E = leftID < rightID
    F = leftID > rightID
    G = leftID == rightID

    if (G) overlap++
    else {
      const dp = E || F
      if (dp) disjoint++
      const ep = D && F && !E || C && E && !F
      if (ep) excess++
      H = dp && ep
    }

    A = !C && (G || E || H)
    B = !D && (G || F || H)
    if (A) i++
    if (B) j++
    if (!A && !B) break
  }

  return [disjoint, excess, overlap]
}

/**
 * Explores possible improvements to the final compare method
 */
function CompareMethod7(brainA: ConnectionBenchmark[], brainB: ConnectionBenchmark[]) {
  let disjoint = 0
  let excess = 0
  let overlap = 0

  let A = false // incremented i
  let B = false // incremented j
  let C = false // iMax
  let D = false // jMax
  let E = false // left < right
  let F = false // left > right
  let G = false // left = right
  let H = false // counting excess

  let i = 0
  let j = 0
  const iMax = brainA.length - 1
  const jMax = brainB.length - 1

  const iterMax = brainA.length + brainB.length
  for (let iter = 0; iter < iterMax; iter++) {
    if (H) {
      excess += iMax - i + jMax - j + 1
      break
    }

    const left = brainA[i]
    const right = brainB[j]
    const leftID = left.innovationID
    const rightID = right.innovationID

    C = i == iMax
    D = j == jMax
    E = leftID < rightID
    F = leftID > rightID
    G = leftID == rightID

    if (G) overlap++
    else {
      // const dp = E || F
      // if (dp) disjoint++
      disjoint++
      // const ep = D && F && !E || C && E && !F
      H = D && F && !E || C && E && !F
      if (H) excess++
      // if (ep) excess++
      // H = ep
    }

    A = !C && (G || E || H)
    B = !D && (G || F || H)
    if (A) i++
    if (B) j++
    if (!A && !B) break
  }

  return [disjoint, excess, overlap]
}

function CompareMethod8(brainA: ConnectionBenchmark[], brainB: ConnectionBenchmark[]) {
  let disjoint = 0
  let excess = 0
  let overlap = 0

  let A = false // incremented i
  let B = false // incremented j
  let C = false // iMax
  let D = false // jMax
  let E = false // left < right
  let F = false // left > right
  let G = false // left = right
  let H = false // counting excess

  let i = 0
  let j = 0
  const iMax = brainA.length - 1
  const jMax = brainB.length - 1

  const iterMax = brainA.length + brainB.length
  for (let iter = 0; iter < iterMax; iter++) {
    if (H) {
      excess += iMax - i + jMax - j + 1
      break
    }

    const left = brainA[i]
    const right = brainB[j]
    const leftID = left.innovationID
    const rightID = right.innovationID

    C = i == iMax
    D = j == jMax
    E = leftID < rightID
    F = leftID > rightID
    G = leftID == rightID

    if (G) {
      overlap++
      A = !C
      B = !D
    }
    else {
      disjoint++
      H = D && F && !E || C && E && !F
      A = !C
      B = !D
      if (H) excess++
      else {
        A &&= E
        B &&= F
      }
    }

    if (A) i++
    if (B) j++
    if (!A && !B) break
  }

  return [disjoint, excess, overlap]
}

function CompareMethod9(brainA: ConnectionBenchmark[], brainB: ConnectionBenchmark[]) {
  let disjoint = 0
  let excess = 0
  let overlap = 0

  let A = false
  let B = false
  let C = false
  let D = false
  let E = false
  let F = false
  let G = false
  let H = false

  let i = 0
  let j = 0
  const iMax = brainA.length - 1
  const jMax = brainB.length - 1

  const iterMax = brainA.length + brainB.length
  for (let iter = 0; iter < iterMax; iter++) {
    if (H) {
      excess += iMax - i + jMax - j + 1
      break
    }

    const left = brainA[i]
    const right = brainB[j]
    const leftID = left.innovationID
    const rightID = right.innovationID

    C = i == iMax
    D = j == jMax
    E = leftID < rightID
    F = leftID > rightID
    G = leftID == rightID
    A = !C
    B = !D

    if (G) overlap++
    else {
      disjoint++
      H = D && F && !E || C && E && !F
      if (H) excess++
      else {
        A &&= E
        B &&= F
      }
    }

    if (!A && !B) break
    if (A) i++
    if (B) j++
  }

  return [disjoint, excess, overlap]
}