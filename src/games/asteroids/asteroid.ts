class AsteroidPool {
  private static pool: Asteroid[] = []

  static acquire(game: Asteroids, pos?: Vec2, radius?: number): Asteroid {
    if (this.pool.length > 0) {
      const asteroid = this.pool.pop()
      asteroid.reset(game, pos, radius)
      return asteroid
    }
    return new Asteroid(game, pos, radius)
  }

  static release(asteroid: Asteroid) {
    this.pool.push(asteroid)
  }

  static clearPool() {
    this.pool.length = 0
  }
}

class Asteroid {
  static SizeCutoff = 10

  static OffsetArray1 = new Array(10).fill(0).map((_, i) => {
    const index = i * 360
    return vec2.fromValues(FastCos(index), FastSin(index))
  })
  static OffsetArray2 = new Array(11).fill(0).map((_, i) => {
    const index = i * 327
    return vec2.fromValues(FastCos(index), FastSin(index))
  })
  static OffsetArray3 = new Array(12).fill(0).map((_, i) => {
    const index = i * 300
    return vec2.fromValues(FastCos(index), FastSin(index))
  })
  static OffsetArray4 = new Array(13).fill(0).map((_, i) => {
    const index = i * 276
    return vec2.fromValues(FastCos(index), FastSin(index))
  })
  static OffsetArray5 = new Array(14).fill(0).map((_, i) => {
    const index = i * 257
    return vec2.fromValues(FastCos(index), FastSin(index))
  })
  static OffsetArrays = [
    this.OffsetArray1,
    this.OffsetArray2,
    this.OffsetArray3,
    this.OffsetArray4,
    this.OffsetArray5
  ]

  game: Asteroids
  pos: Vec2
  radius: number
  velocity: Vec2
  collisionRadius: number
  points: Vec2[] = []
  collisionCircle: Circle
  active: boolean

  constructor(game: Asteroids, pos?: Vec2, radius?: number) {
    this.game = game
    this.pos = pos || vec2.create()
    this.radius = radius || Math.random() * 25 + 25
    this.velocity = vec2.random(vec2.create(), Math.random() * 0.5 + 1)
    Asteroid.GenerateRandomPoints(this)
    this.active = true
  }

  reset(game: Asteroids, pos?: Vec2, radius?: number) {
    this.game = game
    if (pos) vec2.copy(this.pos, pos)
    else vec2.zero(this.pos)
    this.radius = radius || Math.random() * 25 + 25
    vec2.random(this.velocity, Math.random() * 0.5 + 1)
    Asteroid.GenerateRandomPoints(this)
    this.active = true
  }

  static GenerateRandomPoints(asteroid: Asteroid) {
    const offsetArray = Asteroid.OffsetArrays[Math.floor(Math.random() * 5)]
    const radiusOffsets = new Array(offsetArray.length).fill(0).map(() => Math.random() * 20 - 8 + asteroid.radius)
    let max = -Infinity
    let min = Infinity
    for (const o of radiusOffsets) {
      if (o > max) max = o
      if (o < min) min = o
    }
    asteroid.collisionRadius = (min + max) ** 2 / 4
    asteroid.collisionCircle = Circle.FromPointAndRadius(asteroid.pos, Math.sqrt(asteroid.collisionRadius))
    asteroid.points = offsetArray.map((offset, index) => {
      return vec2.scale([], offset, radiusOffsets[index])
    })
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