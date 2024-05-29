const graphics = new Graphics().setSize(800, 600).appendTo(document.body)
// const desired = TrainingValues.XOR
// const neat = new Neat().setGraphics(graphics)
// neat.findSolution(desired, desired.maxLinearFitnessValue() - 0.05).then(solution => {
//   graphics.bg()
//   solution.setGraphics(graphics).draw()
// })


let wantsToStop: boolean = false
const game = new AsteroidsGame(graphics)
game.addEventListener(ShipEvent.ShipDied, () => {
  console.log('You died')
  wantsToStop = true
  console.log(game.asteroidCounter, game.frameCounter)
})



const keysPressed = {}
window.addEventListener('keydown', e => {
  keysPressed[e.key] = true
})
window.addEventListener('keyup', e => {
  keysPressed[e.key] = false
})

function gameLoop() {
  graphics.bg()

  game.loadInputs(keysPressed)

  game.update()
  game.draw()

  if (!wantsToStop) lastFrame = window.requestAnimationFrame(gameLoop)
}

let lastFrame: number = window.requestAnimationFrame(gameLoop)

function stopGameLoop() {
  wantsToStop = true
}