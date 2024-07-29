class Asteroids extends EventTarget implements Drawable {
  static MinAsteroids = 5

  asteroids: Asteroid[]
  spawningAsteroids = true
  asteroidCounter = 0
  frameCounter = 0
  width: number
  height: number
  ship: Ship

  constructor(width: number, height: number) {
    super()

    this.width = width
    this.height = height
    this.createShip()
    this.asteroids = new Array(Asteroids.MinAsteroids).fill(0).map(() => new Asteroid(this))

    this.addEventListener('asteroiddestroyed', () => this.asteroidCounter++)
  }

  createShip() {
    this.ship = new Ship(this, this.width / 2, this.height / 2)
  }

  loadInputs(keys: AsteroidsShipControls) {
    const straight = (keys['ArrowUp'] ? 1 : 0) + (keys['ArrowDown'] ? -1 : 0)
    const turn = (keys['ArrowLeft'] ? -1 : 0) + (keys['ArrowRight'] ? 1 : 0)
    const shoot = (keys[' '] ? 1 : 0)
    this.ship.loadInputs(straight, turn, shoot)
  }

  collisions(): void {
    if (this.ship.lasers.length > 0) {
      laserLoop: for (let laser of [...this.ship.lasers].reverse()) {
        for (let asteroid of [...this.asteroids].reverse()) {
          if (asteroid.collisionWithLaser(laser)) {
            asteroid.split()
            laser.terminate()
            this.checkAsteroidCount()
            continue laserLoop
          }
        }
      }
    }

    for (let asteroid of this.asteroids) {
      if (asteroid.collisionWithShip()) {
        this.ship.kill()
        break
      }
    }
  }

  checkAsteroidCount(): void {
    if (this.spawningAsteroids && this.asteroids.length < Asteroids.MinAsteroids) {
      for (let i = 0; i < Asteroids.MinAsteroids - this.asteroids.length; i++) {
        this.asteroids.push(new Asteroid(this))
      }
    }
  }

  update(keysPressed?: AsteroidsShipControls) {
    this.frameCounter++
    if (keysPressed) this.loadInputs(keysPressed)
    this.ship.update()
    for (let asteroid of this.asteroids) {
      asteroid.update()
    }
    this.collisions()
  }

  draw(g: Graphics) {
    const drawQueue = g.drawQueues[0]
    const path = drawQueue.path
    this.ship.appendToPath(path)
    this.asteroids.forEach(asteroid => asteroid.appendToPath(path))
    drawQueue.dispatch()
  }
}