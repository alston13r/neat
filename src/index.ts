const graphics = new Graphics().setSize(800, 600).appendTo(document.body)
const desired = TrainingValues.XOR
const neat = new Neat().setGraphics(graphics)
neat.findSolution(desired, desired.maxLinearFitnessValue() - 0.05).then(solution => {
  graphics.bg()
  solution.setGraphics(graphics).draw()
})



// const game = new Game()
// game.addEventListener(GameEvent.ShipDied, () => {
//   console.log('You died')
//   wantsToStop = true
//   console.log(game.asteroidCounter, game.frameCounter)
// })



// let keysPressed = {}
// window.addEventListener('keydown', e => {
//   keysPressed[e.key] = true
// })
// window.addEventListener('keyup', e => {
//   keysPressed[e.key] = false
// })

// let wantsToStop = false

// function gameLoop() {
//   graphics.bg()

//   game.loadInputs(keysPressed)

//   game.update()
//   game.draw()

//   if (!wantsToStop) lastFrame = window.requestAnimationFrame(gameLoop)
// }

// let lastFrame = window.requestAnimationFrame(gameLoop)

// function stopGameLoop() {
//   wantsToStop = true
// }