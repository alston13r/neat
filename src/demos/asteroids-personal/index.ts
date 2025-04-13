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

  // code for individual play

  const keysPressed: Record<string, number> = {
    'ArrowUp': 0,
    'ArrowDown': 0,
    'ArrowLeft': 0,
    'ArrowRight': 0,
    ' ': 0
  }
  window.addEventListener('keydown', e => keysPressed[e.key] = 1)
  window.addEventListener('keyup', e => keysPressed[e.key] = 0)

  const game = new Asteroids(asteroidsGraphics.width, asteroidsGraphics.height)

  Asteroids.DebugDrawShipRays = true
  Asteroids.DebugDrawAsteroidCollisionCircles = true

  temp = game

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