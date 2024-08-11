/// <reference path="../../utils/drawing/graphics.ts" />

const asteroidsGraphics = new Graphics(document.getElementById('mainCanvas') as HTMLCanvasElement)
asteroidsGraphics.setSize(800, 600)
asteroidsGraphics.canvas.style.display = 'block'
asteroidsGraphics.textBaseline = 'bottom'
asteroidsGraphics.textAlign = 'left'
asteroidsGraphics.fillStyle = '#fff'
asteroidsGraphics.context.font = 'arial 10px'

const asteroidsPopulation = new Population(500, 11, 0, 3, 0.5)

// const asteroidsSlider = document.createElement('input')
// asteroidsSlider.type = 'range'
// asteroidsSlider.min = '1'
// asteroidsSlider.max = '20'
// asteroidsSlider.value = '1'
// asteroidsSlider.style.display = 'block'

// document.body.appendChild(asteroidsSlider)

// let gameScale = 1
// asteroidsSlider.oninput = () => gameScale = parseInt(asteroidsSlider.value)

// code for individual play

// const keysPressed: Record<string, number> = {
//   'ArrowUp': 0,
//   'ArrowDown': 0,
//   'ArrowLeft': 0,
//   'ArrowRight': 0,
//   ' ': 0
// }
// window.addEventListener('keydown', e => keysPressed[e.key] = 1)
// window.addEventListener('keyup', e => keysPressed[e.key] = 0)

// const game = new Asteroids(asteroidsGraphics.width, asteroidsGraphics.height)
// const brain = new Brain().initialize(11, 0, 3, 0.5)

// function asteroidsLoop(): void {
//   asteroidsGraphics.bg()
//   game.loadInputs(keysPressed)
//   game.update()
//   game.draw(asteroidsGraphics)
//   window.requestAnimationFrame(asteroidsLoop)
// }
// window.requestAnimationFrame(asteroidsLoop)



const maxTimeAlive = 30
let currentGenerationTimeAlive = 0

type GameBrainPair = {
  game: Asteroids
  brain: BrainOOP
}

function thinkBrain(brain: BrainOOP, game: Asteroids): number[] {
  return game.ship.loadIntoBrain(brain)
}

const fittestRecords: BrainOOP[] = []

let pairings: GameBrainPair[] = []

let lastTimestamp = 0
function loop(timestamp: number) {
  const delta = clamp(timestamp - lastTimestamp, 0, 1000)
  lastTimestamp = timestamp

  // for (let i = 0; i < gameScale; i++) {
  currentGenerationTimeAlive += delta / 1000

  const stillAlive = pairings.filter(pair => pair.game.ship.alive)

  if (currentGenerationTimeAlive > maxTimeAlive) {
    stillAlive.forEach(pair => pair.game.ship.alive = false)
  }

  if (stillAlive.length > 0) {
    const fittest = stillAlive.reduce((best, curr) => curr.brain.fitness > best.brain.fitness ? curr : best)
    asteroidsGraphics.bg()

    stillAlive.forEach(pair => {
      const brainThoughts = pair.game.ship.loadIntoBrain(pair.brain)
      pair.game.ship.loadInputs(...brainThoughts)
      pair.game.update()
      pair.brain.fitness = pair.game.asteroidCounter * 5 + pair.game.frameCounter / 120
    })

    fittest.game.draw(asteroidsGraphics)

    asteroidsGraphics.fillStyle = '#fff'
    asteroidsGraphics.fillText(`Generation: ${asteroidsPopulation.generationCounter}`, 5, asteroidsGraphics.height - 5)
    asteroidsGraphics.fillText(`Alive: ${stillAlive.length} / ${asteroidsPopulation.popSize}`, 5, asteroidsGraphics.height - 15)
    asteroidsGraphics.fillText(`Asteroids destroyed: ${fittest.game.asteroidCounter}`, 5, asteroidsGraphics.height - 25)
    asteroidsGraphics.fillText(`Alive for: ${Math.round(currentGenerationTimeAlive)} / ${maxTimeAlive} seconds`, 5, asteroidsGraphics.height - 35)
    // asteroidsGraphics.fillText(`Updates per frame: ${gameScale}`, 5, asteroidsGraphics.height - 45)
  } else {
    currentGenerationTimeAlive = 0
    asteroidsPopulation.nextGeneration()
    if (asteroidsPopulation.generationCounter > 0) {
      asteroidsPopulation.speciate()
      fittestRecords.push(asteroidsPopulation.getFittest())
      pairings.forEach((pair, index) => {
        pair.brain = asteroidsPopulation.members[index]
        pair.game.reset()
      })
    }
    pairings = asteroidsPopulation.members.map(member => {
      return {
        brain: member,
        game: new Asteroids(asteroidsGraphics.width, asteroidsGraphics.height)
      }
    })
  }
  // }

  window.requestAnimationFrame(loop)
}

window.requestAnimationFrame(loop)