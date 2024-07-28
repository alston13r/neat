// let genIndex: number = 0
// let fitPop: Bird[]

// function nextGeneration(): void {
//   console.log(`Generation ${++genIndex}`)
//   selectPop()
//   calculateFitness()
//   for (let i = 0; i < TOTAL; i++) {
//     let parents = pickTwo()
//     birds[i] = crossover(parents[0], parents[1])
//   }
//   savedBirds = []
// }

// function selectPop() {
//   fitPop = savedBirds.splice(-20, 20);
// }

// function calculateFitness(): void {
//   let sum: number = 0
//   for (let bird of fitPop) {
//     sum += Math.pow(bird.score, 2)
//   }
//   for (let bird of fitPop) {
//     bird.fitness = Math.pow(bird.score, 2) / sum
//   }
// }

// function pickOne() {
//   let index: number = 0
//   let r: number = Math.random()
//   while (r > 0) {
//     r -= fitPop[index].fitness
//     index++
//   }
//   index--
//   return fitPop[index]
// }

// function pickTwo(): [Bird, Bird] {
//   const parentOne: Bird = pickOne()
//   const parentTwo: Bird = pickOne()
//   return [parentOne, parentTwo]
// }

// function crossover(a: Bird, b: Bird): Bird {
//   const child: Bird = new Bird(a.brain).setGraphics(a.graphics)

//   for (let [weightRowI, weightRow] of child.brain.weights.entries()) {
//     Matrix.Map(weightRow, (e, i, j) => {
//       return lerp(Math.random(), 0, 1, a.brain.weights[weightRowI].mat[i][j], b.brain.weights[weightRowI].mat[i][j])
//     })
//   }
//   for (let [biasRowI, biasRow] of child.brain.biases.entries()) {
//     Matrix.Map(biasRow, (e, i, j) => {
//       return lerp(Math.random(), 0, 1, a.brain.biases[biasRowI].mat[i][j], b.brain.biases[biasRowI].mat[i][j])
//     })
//   }

//   for (let [i, row] of child.brain.dActivationFunctions.entries()) {
//     for (let j in row) {
//       child.brain.dActivationFunctions[i][j] = (Math.random() < 0.5 ? a : b).brain.dActivationFunctions[i][j]
//       child.brain.activationFunctions[i][j] = child.brain.dActivationFunctions[i][j].original
//     }
//   }

//   child.mutate()
//   return child
// }