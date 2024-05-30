const gameGraphics = new Graphics().setSize(800, 600).appendTo(document.body)
const populationGraphics = new Graphics().setSize(600, 1600).appendTo(document.body)

const maxTimeAlive: number = 30
let generationTimeAlive: number = 0

const removeQueue: GameBrainPair[] = []

class GameBrainPair {
  brain: Brain
  game: AsteroidsGame
  lastFrame: number
  drawing: boolean = false

  constructor(brain: Brain) {
    this.brain = brain
    this.game = new AsteroidsGame(gameGraphics).addEventListener(ShipEvent.ShipDied, () => this.kill())
  }

  kill() {
    this.updateFitness()
    removeQueue.push(this)
  }

  updateFitness() {
    this.brain.fitness = this.game.asteroidCounter * 40 + this.game.frameCounter / 600
  }

  loop(): void {
    if (this.drawing) gameGraphics.bg()

    loadBrainInputs(this)
    this.brain.runTheNetwork()
    const brainOutputs: number[] = this.brain.getOutput()
    this.game.ship.loadInputs(...brainOutputs)

    this.game.update()
    if (this.drawing) {
      this.game.draw()
      this.game.graphics.createText(`Generation: ${population.generationCounter}`, 5, this.game.graphics.height - 5, '#fff', 10, 'left', 'bottom').draw()
      this.game.graphics.createText(`Alive: ${alive.length} / ${population.popSize}`, 5, this.game.graphics.height - 15, '#fff', 10, 'left', 'bottom').draw()
      this.game.graphics.createText(`Alive for: ${Math.round(generationTimeAlive)} / ${maxTimeAlive} seconds`, 5, 15, '#fff', 10, 'left', 'top').draw()
    }

    if (this.game.ship.alive) this.lastFrame = window.requestAnimationFrame(() => this.loop())
  }
}

function loadBrainInputs(pair: GameBrainPair) {
  const inputs: number[] = []
  const shipInfo: ShipInfo = pair.game.ship.getInfo()
  inputs[0] = shipInfo.posX
  inputs[1] = shipInfo.posY
  inputs[2] = shipInfo.heading
  inputs[3] = shipInfo.velX
  inputs[4] = shipInfo.velY
  inputs[5] = shipInfo.canShoot ? 1 : 0
  const nearestAsteroidInfo: AsteroidInfo = pair.game.getAsteroidsByDistance()[0].getInfo()
  inputs[6] = nearestAsteroidInfo.angleFromShip
  inputs[7] = nearestAsteroidInfo.distanceFromShip
  inputs[8] = nearestAsteroidInfo.velX
  inputs[9] = nearestAsteroidInfo.velY
  inputs[10] = nearestAsteroidInfo.size
  pair.brain.loadInputs(inputs)
}

const population: Population = new Population(200, 11, 0, 3)
const alive: GameBrainPair[] = population.members.map(brain => new GameBrainPair(brain))
alive[0].drawing = true
alive.forEach(pair => pair.loop())

const fittestRecords: Brain[] = []

let lastTimestamp: number = 0

function mainLoop(timestamp: number) {
  while (removeQueue.length > 0) {
    const toRemove: GameBrainPair = removeQueue.shift()
    const index: number = alive.indexOf(toRemove)
    if (index != -1) alive.splice(index, 1)
    if (toRemove.drawing && alive.length > 0) alive[0].drawing = true
    toRemove.drawing = false
  }

  const diff: number = timestamp - lastTimestamp
  lastTimestamp = timestamp
  generationTimeAlive += diff / 1000

  if (alive.length == 0) {
    generationTimeAlive = 0
    fittestRecords.push(population.getFittest())
    if (Population.Speciation) population.speciate()
    population.nextGeneration()
    population.members.forEach(brain => alive.push(new GameBrainPair(brain)))
    alive[0].drawing = true
    alive.forEach(pair => pair.loop())
  }

  populationGraphics.bg()
  population.setGraphics(populationGraphics).draw()
  window.requestAnimationFrame(mainLoop)
}

window.requestAnimationFrame(mainLoop)