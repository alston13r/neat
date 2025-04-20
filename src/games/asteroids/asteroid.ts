class AsteroidPool {
  private static pool: Asteroid[] = []

  static acquire(game: Asteroids, pos?: Vec2, radius?: number): Asteroid {
    if (AsteroidPool.pool.length > 0) {
      const asteroid = AsteroidPool.pool.pop()
      asteroid.reset(game, pos, radius)
      return asteroid
    }
    return new Asteroid(game, pos, radius)
  }

  static release(asteroid: Asteroid) {
    AsteroidPool.pool.push(asteroid)
  }

  static clearPool() {
    AsteroidPool.pool.length = 0
  }
}

class Asteroid {
  static AsteroidMinPoints = 10
  static AsteroidMaxPoints = 14

  static SizeCutoff = 10

  static MinInitialRadius = 25
  static MaxInitialRadius = 50

  static MinInitialVelocity = 1
  static MaxInitialVelocity = 1.5

  game: Asteroids
  pos: Vec2
  radius: number
  velocity: Vec2
  collisionRadius: number
  points: Vec2[] = []
  collisionCircle: Circle
  active: boolean

  static GenerateInitialRadius(): number {
    return Math.random() * (Asteroid.MaxInitialRadius - Asteroid.MinInitialRadius) + Asteroid.MinInitialRadius
  }

  static GenerateInitialVelocity(): number {
    return Math.random() * (Asteroid.MaxInitialVelocity - Asteroid.MinInitialVelocity) + Asteroid.MinInitialVelocity
  }

  constructor(game: Asteroids, pos?: Vec2, radius?: number) {
    this.game = game
    this.pos = pos || vec2.create()
    this.radius = radius || Asteroid.GenerateInitialRadius()
    this.velocity = vec2.random(vec2.create(), Asteroid.GenerateInitialVelocity())
    Asteroid.GenerateRandomPoints(this)
    this.active = true
  }

  reset(game: Asteroids, pos?: Vec2, radius?: number) {
    this.game = game
    if (pos) vec2.copy(this.pos, pos)
    else vec2.zero(this.pos)
    this.radius = radius || Asteroid.GenerateInitialRadius()
    vec2.random(this.velocity, Asteroid.GenerateInitialVelocity())
    Asteroid.GenerateRandomPoints(this)
    this.active = true
  }

  static GenerateRandomPoints(asteroid: Asteroid) {
    const numberOfPoints = Math.floor(Math.random() * (Asteroid.AsteroidMaxPoints - this.AsteroidMinPoints + 1) + Asteroid.AsteroidMinPoints)
    asteroid.points = new Array(numberOfPoints)

    let max = -Infinity
    let min = Infinity
    for (let i = 0; i < numberOfPoints; i++) {
      const offset = Math.random() * 20 - 8 + asteroid.radius
      if (offset < min) min = offset
      if (offset > max) max = offset

      asteroid.points[i] = vec2.create()
      setVec2FromRadian(asteroid.points[i], lerp(i, 0, numberOfPoints, 0, Math.PI * 2))
      vec2.scale(asteroid.points[i], asteroid.points[i], offset)
    }

    asteroid.collisionRadius = (min + max) ** 2 / 4
    asteroid.collisionCircle = Circle.FromPointAndRadius(asteroid.pos, Math.sqrt(asteroid.collisionRadius))
  }

  update() {
    vec2.add(this.pos, this.pos, this.velocity)
    this.wrap()
  }

  deactive() {
    this.active = false
  }

  split() {
    // increment the number of asteroids destroyed
    this.game.asteroidCounter++

    // get the split radius
    const half = this.radius / 2

    // free this asteroid if needed
    if (half < Asteroid.SizeCutoff) {
      this.deactive()
      return
    }

    // otherwise, split this asteroid and create 2 new ones
    this.game.asteroids.push(AsteroidPool.acquire(this.game, vec2.clone(this.pos), half))
    this.reset(this.game, this.pos, half)
  }

  wrap() {
    const x = this.pos[0]
    const y = this.pos[1]
    const w = this.game.width
    const h = this.game.height
    if (x > w + this.radius) this.pos[0] = -this.radius
    if (x < -this.radius) this.pos[0] = w + this.radius
    if (y > h + this.radius) this.pos[1] = -this.radius
    if (y < -this.radius) this.pos[1] = h + this.radius
  }

  collisionWithShip() {
    return (
      vec2.squaredDistance(this.pos, this.game.ship.top) <= this.collisionRadius
      || vec2.squaredDistance(this.pos, this.game.ship.left) <= this.collisionRadius
      || vec2.squaredDistance(this.pos, this.game.ship.right) <= this.collisionRadius
    )
  }

  collisionWithLaser(laser: Laser) {
    return vec2.squaredDistance(this.pos, laser.pos) <= this.collisionRadius
  }

  getCollisionCircle() {
    return this.collisionCircle
  }
}