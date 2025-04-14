/// <reference path="../../utils/drawing/graphics.ts" />

let temp

{
  const asteroidsGraphics = new Graphics(document.getElementById('mainCanvas') as HTMLCanvasElement)
  asteroidsGraphics.setSize(800, 600)
  asteroidsGraphics.canvas.style.display = 'block'
  asteroidsGraphics.textBaseline = 'bottom'
  asteroidsGraphics.textAlign = 'left'
  asteroidsGraphics.fillStyle = '#fff'
  asteroidsGraphics.context.font = 'arial 10px'

  const keysPressed: Record<string, number> = {
    'ArrowUp': 0,
    'ArrowDown': 0,
    'ArrowLeft': 0,
    'ArrowRight': 0,
    ' ': 0
  }
  window.addEventListener('keydown', e => {
    if (e.key.indexOf('Arrow') != -1) e.preventDefault()
    else if (e.key == ' ') e.preventDefault()
    keysPressed[e.key] = 1
  })
  window.addEventListener('keyup', e => keysPressed[e.key] = 0)

  const game = new Asteroids(asteroidsGraphics.width, asteroidsGraphics.height)
  temp = game

  const optionsWindow = new Options()
  optionsWindow.appendAfter(asteroidsGraphics.canvas)

  optionsWindow
    .appendButton('Refresh', () => {
      game.reset()
    })

    .appendCheckbox('Debug ship rays', v => {
      Asteroids.DebugDrawShipRays = v
    }, Asteroids.DebugDrawShipRays)

    .appendCheckbox('Debug asteroid collisions', v => {
      Asteroids.DebugDrawAsteroidCollisionCircles = v
    }, Asteroids.DebugDrawAsteroidCollisionCircles)

    .appendSlider('Number of ship rays', v => {
      Ship.NumRays = v
      game.ship.fixRays()
    }, 1, 15, Ship.NumRays)

    .appendSlider('Angle between ship rays', v => {
      Ship.RayDeltaTheta = toRadian(v)
    }, 1, 90, toDegree(Ship.RayDeltaTheta))

    .appendSlider('Ship ray length', v => {
      Ship.RayLength = v
      game.ship.fixRays()
    }, 1, 1000, Ship.RayLength)

  function asteroidsLoop(): void {
    asteroidsGraphics.bg()
    game.loadInputs(keysPressed)
    game.update()
    game.draw(asteroidsGraphics)

    asteroidsGraphics.fillStyle = '#fff'
    asteroidsGraphics.fillText(`Asteroids destroyed: ${game.asteroidCounter}`, 5, asteroidsGraphics.height - 5)

    window.requestAnimationFrame(asteroidsLoop)
  }
  window.requestAnimationFrame(asteroidsLoop)
}