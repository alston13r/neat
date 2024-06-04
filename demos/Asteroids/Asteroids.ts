const gameGraphics: Graphics = new Graphics().setSize(800, 600).appendTo(document.body)
const population: Population = new Population(500, 11, 0, 3, 0.5)

const game: AsteroidsGame = new AsteroidsGame(gameGraphics)
const brain: Brain = new Brain().initialize(11, 0, 3, 0.5)

const maxTimeAlive: number = 30
let currentGenerationTimeAlive: number = 0

type GameBrainPair = {
  game: AsteroidsGame
  brain: Brain
}

function thinkBrain(brain: Brain, game: AsteroidsGame): number[] {
  const inputs: number[] = []
  const shipInfo: ShipInfo = game.ship.getInfo()
  inputs[0] = shipInfo.posX
  inputs[1] = shipInfo.posY
  inputs[2] = shipInfo.heading
  inputs[3] = shipInfo.velX
  inputs[4] = shipInfo.velY
  inputs[5] = shipInfo.canShoot ? 1 : 0
  const nearestAsteroidInfo: AsteroidInfo = game.getAsteroidsByDistance()[0].getInfo()
  inputs[6] = nearestAsteroidInfo.angleFromShip
  inputs[7] = nearestAsteroidInfo.distanceFromShip
  inputs[8] = nearestAsteroidInfo.velX
  inputs[9] = nearestAsteroidInfo.velY
  inputs[10] = nearestAsteroidInfo.size
  return brain.think(inputs)
}

function updateFitness(pair: GameBrainPair) {
  pair.brain.fitness = pair.game.asteroidCounter * 5 + pair.game.frameCounter / 120
}

function addListeners(arr: GameBrainPair[]) {
  arr.forEach(pair => {
    pair.game.addEventListener(AsteroidEvent.AsteroidDestroyed, () => updateFitness(pair))
    pair.game.addEventListener(GameEvent.End, () => updateFitness(pair))
  })
}

const fittestRecords: Brain[] = []

let pairings: GameBrainPair[] = []

let lastTimestamp: number = 0
function loop(timestamp: number) {
  const diff: number = timestamp - lastTimestamp
  lastTimestamp = timestamp
  currentGenerationTimeAlive += diff / 1000

  const stillAlive: GameBrainPair[] = pairings.filter(pair => pair.game.ship.alive)

  if (currentGenerationTimeAlive > maxTimeAlive) {
    stillAlive.forEach(pair => pair.game.ship.kill())
  }

  if (stillAlive.length > 0) {
    const fittest: GameBrainPair = stillAlive.reduce((best, curr) => curr.brain.fitness > best.brain.fitness ? curr : best)
    gameGraphics.bg()

    stillAlive.forEach(pair => {
      const brainThoughts: number[] = thinkBrain(pair.brain, pair.game)
      pair.game.ship.loadInputs(...brainThoughts)
      pair.game.update()
    })

    fittest.game.draw()

    gameGraphics.createText(`Generation: ${population.generationCounter}`, 5, gameGraphics.height - 5, '#fff', 10, 'left', 'bottom').draw()
    gameGraphics.createText(`Alive: ${stillAlive.length} / ${population.popSize}`, 5, gameGraphics.height - 15, '#fff', 10, 'left', 'bottom').draw()
    gameGraphics.createText(`Asteroids destroyed: ${fittest.game.asteroidCounter}`, 5, gameGraphics.height - 25, '#fff', 10, 'left', 'bottom').draw()
    gameGraphics.createText(`Alive for: ${Math.round(currentGenerationTimeAlive)} / ${maxTimeAlive} seconds`, 5, gameGraphics.height - 35, '#fff', 10, 'left', 'bottom').draw()
  } else {
    currentGenerationTimeAlive = 0
    population.nextGeneration()
    if (population.generationCounter > 0) {
      population.speciate()
      fittestRecords.push(population.getFittest())
    }
    pairings = population.members.map(member => {
      return {
        brain: member,
        game: new AsteroidsGame(gameGraphics)
      }
    })
    addListeners(pairings)
  }
  window.requestAnimationFrame(loop)
}

window.requestAnimationFrame(loop)