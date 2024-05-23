class GameEvent {
  static #Start = new GameEvent('start')
  static #End = new GameEvent('end')
  static #FrameUpdate = new GameEvent('frame update')
  static #AsteroidDestroyed = new GameEvent('asteroid destroyed')
  static #AsteroidCreated = new GameEvent('asteroid created')
  static #ShipDied = new GameEvent('ship died')

  constructor(type) {
    this.symbol = Symbol(type)
  }

  static get Start() { return GameEvent.#Start }
  static get End() { return GameEvent.#End }
  static get FrameUpdate() { return GameEvent.#FrameUpdate }
  static get AsteroidDestroyed() { return GameEvent.#AsteroidDestroyed }
  static get AsteroidCreated() { return GameEvent.#AsteroidCreated }
  static get ShipDied() { return GameEvent.#ShipDied }
}

class Game {
  static MinAsteroids = 5

  asteroids = []
  spawningAsteroids = true
  asteroidCounter = 0
  frameCounter = 0
  events = new Map()

  constructor(graphics) {
    this.graphics = graphics
    this.width = graphics.width
    this.height = graphics.height
    this.ship = this.createShip()
    for (let i = 0; i < Game.MinAsteroids; i++) {
      this.createAsteroid()
    }
    this.addEventListener(GameEvent.AsteroidDestroyed, game => game.asteroidCounter++)
    this.addEventListener(GameEvent.FrameUpdate, game => game.frameCounter++)
    this.emitEvent(GameEvent.Start)
  }

  /**
   * @param {GameEvent} event 
   * @param {function(Game): void} callback 
   */
  addEventListener(event, callback) {
    let arr
    if (this.events.has(event)) {
      arr = this.events.get(event)
    } else {
      arr = []
      this.events.set(event, arr)
    }
    arr.push(callback)
  }

  emitEvent(event) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(callback => callback(this))
    }
  }

  /**
   * @returns {Ship}
   */
  createShip() {
    return new Ship(this, new Vector(this.width / 2, this.height / 2))
  }

  /**
   * @returns {Asteroid}
   */
  createAsteroid(emit) {
    this.asteroids.push(new Asteroid(this, new Vector(0, 0)))
    if (emit) this.emitEvent(GameEvent.AsteroidCreated)
  }

  loadInputs(keys) {
    let straight = (keys['ArrowUp'] ? 1 : 0) + (keys['ArrowDown'] ? -1 : 0)
    let turn = (keys['ArrowLeft'] ? -1 : 0) + (keys['ArrowRight'] ? 1 : 0)
    let shoot = (keys[' '] ? true : false)
    this.ship.loadInputs(straight, turn, shoot)
  }

  collisions() {
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

  checkAsteroidCount() {
    if (this.spawningAsteroids && this.asteroids.length < Game.MinAsteroids) {
      let d = Game.MinAsteroids - this.asteroids.length
      for (let i = 0; i < d; i++) {
        this.createAsteroid(true)
      }
    }
  }

  update(keysPressed) {
    this.emitEvent(GameEvent.FrameUpdate)
    if (keysPressed) this.updateKeys(keysPressed)
    this.ship.update()
    for (let asteroid of this.asteroids) {
      asteroid.update()
    }
    this.collisions()
  }

  draw(debug = false) {
    this.ship.draw()
    this.asteroids.forEach(asteroid => asteroid.draw())

    if (debug) {
      let asteroidInfo = this.asteroidsInfo()
      for (let asteroid of asteroidInfo) {
        let angle = asteroid.angleFromShip * 2 * Math.PI
        let distance = asteroid.distanceFromShip * this.graphics.size.mag()
        let v = Vector.FromAngle(angle).scale(distance)
        new Line(this.graphics, ...this.ship.pos, ...this.ship.pos.add(v), '#f00', 1).draw()
      }
    }
  }

  getAsteroidsByDistance() {
    return [...this.asteroids].sort((a, b) => {
      let da = this.ship.pos.distanceTo(a.pos)
      let db = this.ship.pos.distanceTo(b.pos)
      return da - db
    })
  }

  asteroidsInfo() {
    return this.getAsteroidsByDistance().map(asteroid => asteroid.getInfo())
  }
}