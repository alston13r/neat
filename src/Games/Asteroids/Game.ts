class AsteroidsGame implements Drawable {
  static MinAsteroids = 5

  asteroids: Asteroid[] = []
  spawningAsteroids: boolean = true
  asteroidCounter: number = 0
  frameCounter: number = 0
  events: Map<GameEvent, ((game?: AsteroidsGame) => void)[]> = new Map()
  graphics: Graphics
  width: number
  height: number
  ship: Ship

  constructor(graphics?: Graphics) {
    this.graphics = graphics
    this.width = graphics.width
    this.height = graphics.height
    this.ship = this.createShip()
    for (let i = 0; i < AsteroidsGame.MinAsteroids; i++) {
      this.createAsteroid()
    }
    this.addEventListener(AsteroidEvent.AsteroidDestroyed, (game: AsteroidsGame) => game.asteroidCounter++)
    this.addEventListener(GameEvent.FrameUpdate, (game: AsteroidsGame) => game.frameCounter++)
    this.dispatch(GameEvent.Start)
  }

  addEventListener(event: GameEvent, callback: (game?: AsteroidsGame) => void): AsteroidsGame {
    let arr: ((game?: AsteroidsGame) => void)[]
    if (this.events.has(event)) {
      arr = this.events.get(event)
    } else {
      arr = []
      this.events.set(event, arr)
    }
    arr.push(callback)
    return this
  }

  dispatch(event: GameEvent) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(callback => callback(this))
    }
  }

  createShip(): Ship {
    const ship: Ship = new Ship(this, new Vector(this.width / 2, this.height / 2))
    this.dispatch(ShipEvent.ShipCreated)
    return ship
  }

  createAsteroid(emit?: boolean): void {
    this.asteroids.push(new Asteroid(this, new Vector(0, 0)))
    if (emit) this.dispatch(AsteroidEvent.AsteroidCreated)
  }

  loadInputs(keys: { 'ArrowUp'?: boolean, 'ArrowDown'?: boolean, 'ArrowLeft'?: boolean, 'ArrowRight'?: boolean, ' '?: boolean }) {
    const straight: number = (keys['ArrowUp'] ? 1 : 0) + (keys['ArrowDown'] ? -1 : 0)
    const turn: number = (keys['ArrowLeft'] ? -1 : 0) + (keys['ArrowRight'] ? 1 : 0)
    const shoot: number = (keys[' '] ? 1 : 0)
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
    if (this.spawningAsteroids && this.asteroids.length < AsteroidsGame.MinAsteroids) {
      for (let i = 0; i < AsteroidsGame.MinAsteroids - this.asteroids.length; i++) {
        this.createAsteroid(true)
      }
    }
  }

  update(keysPressed?: { 'ArrowUp'?: boolean, 'ArrowDown'?: boolean, 'ArrowLeft'?: boolean, 'ArrowRight'?: boolean, ' '?: boolean }): void {
    this.dispatch(GameEvent.FrameUpdate)
    if (keysPressed) this.loadInputs(keysPressed)
    this.ship.update()
    for (let asteroid of this.asteroids) {
      asteroid.update()
    }
    this.collisions()
  }

  draw(debug: boolean = false): void {
    this.ship.draw()
    this.asteroids.forEach(asteroid => asteroid.draw())

    if (debug) {
      const asteroidInfo: AsteroidInfo[] = this.asteroidsInfo()
      for (let [i, asteroid] of [...asteroidInfo].sort((a, b) => a.distanceFromShip - b.distanceFromShip).entries()) {
        const angle: number = asteroid.angleFromShip * 2 * Math.PI
        const distance: number = asteroid.distanceFromShip * this.graphics.size.mag()
        const v: Vector = Vector.FromAngle(angle).scale(distance)
        const pos: Vector = this.ship.pos
        const added: Vector = pos.add(v)
        new Line(this.graphics, pos.x, pos.y, added.x, added.y, i == 0 ? '#0f0' : '#f00', 1).draw()
      }
    }
  }

  getAsteroidsByDistance(): Asteroid[] {
    return [...this.asteroids].sort((a: Asteroid, b: Asteroid) => {
      const da: number = this.ship.pos.distanceTo(a.pos)
      const db: number = this.ship.pos.distanceTo(b.pos)
      return da - db
    })
  }

  asteroidsInfo(): AsteroidInfo[] {
    return this.getAsteroidsByDistance().map(asteroid => asteroid.getInfo())
  }
}