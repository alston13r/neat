const asteroidsGraphics = new Graphics()
asteroidsGraphics.setSize(800, 600)
asteroidsGraphics.appendToBody()
asteroidsGraphics.canvas.style.display = 'block'
asteroidsGraphics.textBaseline = 'bottom'
asteroidsGraphics.textAlign = 'left'
asteroidsGraphics.fillStyle = '#fff'
asteroidsGraphics.context.font = 'arial 10px'
const asteroidsDrawQueue = asteroidsGraphics.initDrawQueue('#fff', false, true, 1)

const asteroidsPopulation = new Population(500, 11, 0, 3, 0.5)

const asteroidsSlider = document.createElement('input')
asteroidsSlider.type = 'range'
asteroidsSlider.min = '1'
asteroidsSlider.max = '20'
asteroidsSlider.value = '1'
asteroidsSlider.style.display = 'block'

document.body.appendChild(asteroidsSlider)

let gameScale = 1
asteroidsSlider.oninput = () => gameScale = parseInt(asteroidsSlider.value)

// code for individual play

// const keysPressed = {}
// window.addEventListener('keydown', e => keysPressed[e.key] = true)
// window.addEventListener('keyup', e => keysPressed[e.key] = false)

// const game: AsteroidsGame = new AsteroidsGame(gameGraphics)
// const brain: Brain = new Brain().initialize(11, 0, 3, 0.5)

// let lastTimestamp: number = 0
// function asteroidsLoop(timestamp: number = 0): void {
//   gameGraphics.bg()
//   const diff: number = timestamp - lastTimestamp
//   lastTimestamp = timestamp
//   game.update(keysPressed)
//   game.draw()
//   window.requestAnimationFrame(asteroidsLoop)
// }
// window.requestAnimationFrame(asteroidsLoop)

const maxTimeAlive = 30
let currentGenerationTimeAlive = 0

type GameBrainPair = {
  game: Asteroids
  brain: Brain
}

function thinkBrain(brain: Brain, game: Asteroids): number[] {
  const inputs: number[] = []
  const shipInfo = game.ship.getInfo()
  inputs[0] = shipInfo.posX
  inputs[1] = shipInfo.posY
  inputs[2] = shipInfo.heading
  inputs[3] = shipInfo.velX
  inputs[4] = shipInfo.velY
  inputs[5] = shipInfo.canShoot ? 1 : 0
  inputs[6] = shipInfo.rays[0].distance
  inputs[7] = shipInfo.rays[1].distance
  inputs[8] = shipInfo.rays[2].distance
  inputs[9] = shipInfo.rays[3].distance
  inputs[10] = shipInfo.rays[4].distance
  return brain.think(inputs)
}

function updateFitness(pair: GameBrainPair) {
  pair.brain.fitness = pair.game.asteroidCounter * 5 + pair.game.frameCounter / 120
}

function addListeners(arr: GameBrainPair[]) {
  arr.forEach(pair => {
    pair.game.addEventListener('asteroiddestroyed', () => updateFitness(pair))
    pair.game.addEventListener('end', () => updateFitness(pair))
  })
}

const fittestRecords: Brain[] = []

let pairings: GameBrainPair[] = []

let lastTimestamp = 0
function loop(timestamp: number) {
  const delta = clamp(timestamp - lastTimestamp, 0, 1000)
  lastTimestamp = timestamp

  for (let i = 0; i < gameScale; i++) {
    currentGenerationTimeAlive += delta / 1000

    const stillAlive = pairings.filter(pair => pair.game.ship.alive)

    if (currentGenerationTimeAlive > maxTimeAlive) {
      stillAlive.forEach(pair => pair.game.ship.kill())
    }

    if (stillAlive.length > 0) {
      const fittest = stillAlive.reduce((best, curr) => curr.brain.fitness > best.brain.fitness ? curr : best)
      asteroidsGraphics.bg()

      stillAlive.forEach(pair => {
        const brainThoughts = thinkBrain(pair.brain, pair.game)
        pair.game.ship.loadInputs(...brainThoughts)
        pair.game.update()
      })

      fittest.game.draw(asteroidsGraphics)

      asteroidsGraphics.fillStyle = '#fff'
      asteroidsGraphics.fillText(`Generation: ${asteroidsPopulation.generationCounter}`, 5, asteroidsGraphics.height - 5)
      asteroidsGraphics.fillText(`Alive: ${stillAlive.length} / ${asteroidsPopulation.popSize}`, 5, asteroidsGraphics.height - 15)
      asteroidsGraphics.fillText(`Asteroids destroyed: ${fittest.game.asteroidCounter}`, 5, asteroidsGraphics.height - 25)
      asteroidsGraphics.fillText(`Alive for: ${Math.round(currentGenerationTimeAlive)} / ${maxTimeAlive} seconds`, 5, asteroidsGraphics.height - 35)
      asteroidsGraphics.fillText(`Updates per frame: ${gameScale}`, 5, asteroidsGraphics.height - 45)
    } else {
      currentGenerationTimeAlive = 0
      asteroidsPopulation.nextGeneration()
      if (asteroidsPopulation.generationCounter > 0) {
        asteroidsPopulation.speciate()
        fittestRecords.push(asteroidsPopulation.getFittest())
      }
      pairings = asteroidsPopulation.members.map(member => {
        return {
          brain: member,
          game: new Asteroids(asteroidsGraphics.width, asteroidsGraphics.height)
        }
      })
      addListeners(pairings)
    }
  }

  window.requestAnimationFrame(loop)
}

window.requestAnimationFrame(loop)