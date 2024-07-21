class Asteroids extends EventTarget implements Drawable {
  static MinAsteroids = 5

  asteroids: Asteroid[] = []
  spawningAsteroids: boolean = true
  asteroidCounter: number = 0
  frameCounter: number = 0
  graphics: Graphics
  width: number
  height: number
  ship: Ship

  constructor(graphics?: Graphics) {
    super()

    this.graphics = graphics
    this.width = graphics.width
    this.height = graphics.height
    this.ship = this.createShip()
    for (let i = 0; i < Asteroids.MinAsteroids; i++) {
      this.createAsteroid()
    }

    this.addEventListener('asteroiddestroyed', (ev) => ev.detail.game.asteroidCounter++)
    this.addEventListener('update', (ev) => ev.detail.game.frameCounter++)
  }

  createShip(): Ship {
    const ship = new Ship(this, vec2.fromValues(this.width / 2, this.height / 2))
    this.dispatchEvent(new CustomEvent<ShipInfo>('shipcreated', { detail: ship.getInfo() }))
    return ship
  }

  createAsteroid(emit?: boolean): void {
    const asteroid = new Asteroid(this, vec2.create())
    this.asteroids.push(asteroid)
    if (emit) this.dispatchEvent(new CustomEvent<AsteroidInfo>('asteroidcreated', { detail: asteroid.getInfo() }))
  }

  loadInputs(keys: { 'ArrowUp'?: boolean, 'ArrowDown'?: boolean, 'ArrowLeft'?: boolean, 'ArrowRight'?: boolean, ' '?: boolean }) {
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
      }
    }
  }

  checkAsteroidCount(): void {
    if (this.spawningAsteroids && this.asteroids.length < Asteroids.MinAsteroids) {
      for (let i = 0; i < Asteroids.MinAsteroids - this.asteroids.length; i++) {
        this.createAsteroid(true)
      }
    }
  }

  update(keysPressed?: { 'ArrowUp'?: boolean, 'ArrowDown'?: boolean, 'ArrowLeft'?: boolean, 'ArrowRight'?: boolean, ' '?: boolean }): void {
    this.dispatchEvent(new CustomEvent<GameInfo>('update', { detail: this.getInfo() }))
    if (keysPressed) this.loadInputs(keysPressed)
    this.ship.update()
    for (let asteroid of this.asteroids) {
      asteroid.update()
    }
    this.collisions()
  }

  draw(debug = false): void {
    this.ship.draw()
    this.asteroids.forEach(asteroid => asteroid.draw())

    if (debug) {
      for (const ray of this.ship.rays) {
        ray.draw()
      }
    }
  }

  getAsteroidsByDistance(): Asteroid[] {
    return [...this.asteroids].sort((a, b) => {
      const da = vec2.distance(this.ship.pos, a.pos)
      const db = vec2.distance(this.ship.pos, b.pos)
      return da - db
    })
  }

  asteroidsInfo(): AsteroidInfo[] {
    return this.getAsteroidsByDistance().map(asteroid => asteroid.getInfo())
  }

  getInfo(): GameInfo {
    return {
      game: this,
      graphics: this.graphics,
      frameCounter: this.frameCounter,
      width: this.width,
      height: this.height
    }
  }
}