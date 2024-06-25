const asteroidsGraphics: Graphics = new Graphics().setSize(800, 600).appendToBody()
const asteroidsGame: Asteroids = new Asteroids()

asteroidsGame.setGraphics(asteroidsGraphics)

let lastDeltaTimeTimestamp: number = 0

function deltaTimeLoop(timestamp?: number): void {
  const deltaTime: number = timestamp - lastDeltaTimeTimestamp
  lastDeltaTimeTimestamp = timestamp

  asteroidsGame.draw()
  asteroidsGraphics.createText(deltaTime.toString(), 5, 5, '#fff', 20, 'left', 'top')
}