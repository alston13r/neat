// const desired = NeatSolutionValues.XOR
// const fitnessFunction = brain => {
//   brain.fitness = desired.maxLinearFitnessValue()
//   for (let v of desired.random()) {
//     brain.loadInputs(v.inputs)
//     brain.runTheNetwork()
//     let o = brain.getOutput()
//     let d = v.outputs.map((exp, i) => Math.abs(exp - o[i]))
//     brain.fitness -= d.reduce((sum, curr) => sum + curr, 0)
//   }
// }

const graphics = new Graphics().setSize(800, 600).appendTo(document.body)
// const population = new Population(1000, 2, 0, 1, 1)
// population.generation(fitnessFunction)
// population.step2()
// population.draw(graphics)


// // let game = new Game(graphics)
// // // // let neat = new Neat(graphics)
// // // // neat.runOnGame(Game)

// // game.addEventListener(GameEvent.ShipDied, () => {
// //   console.log('You died')
// //   wantsToStop = true
// //   console.log(game.asteroidCounter, game.frameCounter)
// // })



// // let keysPressed = {}
// // window.addEventListener('keydown', e => {
// //   keysPressed[e.key] = true
// // })
// // window.addEventListener('keyup', e => {
// //   keysPressed[e.key] = false
// // })

// // let wantsToStop = false

// // function gameLoop() {
// //   graphics.bg()

// //   game.loadInputs(keysPressed)

// //   game.update()
// //   game.draw()

// //   if (!wantsToStop) lastFrame = window.requestAnimationFrame(gameLoop)
// // }

// // let lastFrame = window.requestAnimationFrame(gameLoop)

// // function stopGameLoop() {
// //   wantsToStop = true
// // }









// // GENERATION ZERO
// // create population

// // GENERATION X
// // produce offspring
// // incremement generation counter
// // mutate population

// // OVERLAP
// // fill in any missing spots
// // calculate fitness
// // speciation
// // gens since improved
// // speciation threshold
// // adjust fitness
// // calculate allowed offspring

const desired = NeatSolutionValues.XOR
const neat = new Neat().setGraphics(graphics)
neat.findSolution(desired, desired.maxLinearFitnessValue() - 0.05).then(solution => {
  solution.draw(graphics)
})