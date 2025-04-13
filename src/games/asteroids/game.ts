class Asteroids implements Drawable {
  static MinAsteroids = 5

  static asteroidPool: AsteroidPool = new AsteroidPool()

  asteroids: Asteroid[] = []
  asteroidCounter = 0
  frameCounter = 0
  width: number
  height: number
  ship: Ship

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
    this.createShip()
    for (let i = 0; i < Asteroids.MinAsteroids; i++)
      this.asteroids.push(Asteroids.asteroidPool.acquire(this))
  }

  createShip() {
    this.ship = new Ship(this)
  }

  reset() {
    this.asteroidCounter = 0
    this.frameCounter = 0

    // release all asteroids
    while (this.asteroids.length > 0) {
      Asteroids.asteroidPool.release(this.asteroids.pop())
    }

    // fill asteroids
    for (let i = 0; i < Asteroids.MinAsteroids; i++) {
      this.asteroids.push(Asteroids.asteroidPool.acquire(this))
    }

    this.ship.reset()
  }

  loadInputs(keys: AsteroidsShipControls) {
    this.ship.loadInputs(
      keys['ArrowUp'] - keys['ArrowDown'],
      keys['ArrowRight'] - keys['ArrowLeft'],
      keys[' ']
    )
  }

  collisions(): void {
    if (this.ship.lasers.length > 0) {
      laserLoop: for (let i = this.ship.lasers.length - 1; i >= 0; i--) {
        // continue if laser already collided with an asteroid
        if (!this.ship.lasers[i].active) continue

        for (let j = this.asteroids.length - 1; j >= 0; j--) {
          // continue if asteroid was already marked as deactivated
          if (!this.asteroids[j].active) continue

          if (this.asteroids[j].collisionWithLaser(this.ship.lasers[i])) {
            this.asteroids[j].split()
            this.ship.lasers[i].deactivate()
            continue laserLoop
          }
        }
      }

      // update list of asteroids
      this.checkAsteroidCount()

      // update list of lasers
      for (let i = this.ship.lasers.length - 1; i >= 0; i--) {
        if (!this.ship.lasers[i].active)
          this.ship.lasers.splice(i, 1)
      }
    }

    // check for asteroid collisions with ship
    for (let asteroid of this.asteroids) {
      if (asteroid.collisionWithShip()) {
        this.ship.alive = false
        break
      }
    }
  }

  checkAsteroidCount() {
    // remove any deactivated asteroids
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroid = this.asteroids[i]
      if (!asteroid.active) {
        // swap with end
        this.asteroids[i] = this.asteroids[this.asteroids.length - 1]
        // pop
        this.asteroids.pop()
        // release
        Asteroids.asteroidPool.release(asteroid)
      }
    }

    if (this.asteroids.length < Asteroids.MinAsteroids) {
      for (let i = Asteroids.MinAsteroids - this.asteroids.length; i > 0; i--) {
        this.asteroids.push(Asteroids.asteroidPool.acquire(this))
      }
    }
  }

  update() {
    this.frameCounter++
    this.ship.update()
    for (let asteroid of this.asteroids) {
      asteroid.update()
    }
    this.collisions()
  }

  draw(g: Graphics) {
    g.strokeStyle = '#fff'
    g.lineWidth = 1

    // ship
    g.strokeTriangle(
      this.ship.top[0], this.ship.top[1],
      this.ship.left[0], this.ship.left[1],
      this.ship.right[0], this.ship.right[1]
    )

    // lasers
    for (const laser of this.ship.lasers) {
      g.strokeCircle(laser.pos[0], laser.pos[1], Laser.Radius)
    }

    // asteroids
    for (const asteroid of this.asteroids) {
      g.strokePolygon(asteroid.points.map(point => vec2.add([], point, asteroid.pos)))

      // collision circles
      // const circle = asteroid.getCollisionCircle()
      // let temp = g.strokeStyle
      // g.strokeStyle = '#f00'
      // g.strokeCircle(circle.x, circle.y, circle.radius)
      // g.strokeStyle = temp
    }
  }
}