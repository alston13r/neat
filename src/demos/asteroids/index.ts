/// <reference path="../../utils/drawing/graphics.ts" />

const asteroidsGraphics = new Graphics(document.getElementById('mainCanvas') as HTMLCanvasElement)
asteroidsGraphics.setSize(800, 600)
asteroidsGraphics.canvas.style.display = 'block'
asteroidsGraphics.textBaseline = 'bottom'
asteroidsGraphics.textAlign = 'left'
asteroidsGraphics.fillStyle = '#fff'
asteroidsGraphics.context.font = 'arial 10px'

const neat = new Neat(500, { inputSize: 11, outputSize: 3, enableChance: 0.5 }).initializePopulation()

const maxTimeAlive = 30
let currentGenerationTimeAlive = 0

type GameBrainPair = {
  game: Asteroids
  brain: Brain
}

function thinkBrain(brain: Brain, game: Asteroids): number[] {
  return game.ship.loadIntoBrain(brain)
}

const fittestRecords: Brain[] = []

let pairings: GameBrainPair[] = []

let lastTimestamp = 0
function loop(timestamp: number) {
  const delta = clamp(timestamp - lastTimestamp, 0, 1000)
  lastTimestamp = timestamp

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
    asteroidsGraphics.fillListText([
      `Generation: ${neat.getCurrentGeneration()}`,
      `Alive: ${stillAlive.length} / ${neat.getPopulationSize()}`,
      `Asteroids destroyed: ${fittest.game.asteroidCounter}`,
      `Alive for: ${Math.round(currentGenerationTimeAlive)} / ${maxTimeAlive} seconds`,
      /*`Updates per frame: ${gameScale}`*/
    ], 5, asteroidsGraphics.height - 5, 0, -10)
  } else {
    currentGenerationTimeAlive = 0
    if (neat.getCurrentGeneration() > 0) fittestRecords.push(neat.updateFittestEver())
    neat.nextGeneration()
    if (neat.getCurrentGeneration() > 0) {
      neat.speciateMembers() // speciation depends on member fitness, we need to wait for the first generation to have ran
      const members = neat.getMembers()
      pairings.forEach((pair, index) => {
        pair.brain = members[index]
        pair.game.reset()
      })
    }
    pairings = neat.getMembers().map(member => {
      return {
        brain: member,
        game: new Asteroids(asteroidsGraphics.width, asteroidsGraphics.height)
      }
    })
  }

  window.requestAnimationFrame(loop)
}

window.requestAnimationFrame(loop)