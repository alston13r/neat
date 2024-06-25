const asteroidsGraphics: Graphics = new Graphics().setSize(800, 600).appendToBody()
const asteroidsGame: Asteroids = new Asteroids()

asteroidsGame.setGraphics(asteroidsGraphics)
asteroidsGame.draw()