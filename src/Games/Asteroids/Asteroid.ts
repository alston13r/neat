class Asteroid implements Drawable, HasPath {
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

  constructor(game: Asteroids, pos?: Vec2, radius?: number) {
    this.game = game
    this.pos = pos || vec2.create()
    this.radius = radius || Math.random() * 25 + 25
    this.velocity = vec2.random(vec2.create(), Math.random() * 0.5 + 1)
    Asteroid.GenerateRandomPoints(this)
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
    asteroid.collisionRadius = (min + max) / 2
    asteroid.points = offsetArray.map((offset, index) => {
      return vec2.scale([], offset, radiusOffsets[index])
    })
    return asteroid
  }

  update() {
    vec2.add(this.pos, this.pos, this.velocity)
    this.wrap()
  }

  split() {
    for (let i = this.game.asteroids.length; i >= 0; i--) {
      if (this.game.asteroids[i] === this) {
        this.game.asteroids.splice(i, 1)
        break
      }
    }
    const half = this.radius / 2
    if (half < Asteroid.SizeCutoff) return
    this.game.asteroids.push(
      new Asteroid(this.game, this.pos, half),
      new Asteroid(this.game, vec2.copy([], this.pos), half)
    )
    this.game.dispatchEvent(new CustomEvent('asteroiddestroyed'))
  }

  draw(g: Graphics) {
    const points = this.points.map(point => vec2.add(vec2.create(), point, this.pos))
    g.strokePolygon(points)
  }

  createPath(): Path2D {
    const points = this.points.map(point => vec2.add(vec2.create(), point, this.pos))
    return new Polygon(points).createPath()
  }

  appendToPath(path: Path2D): Path2D {
    const points = this.points.map(point => vec2.add(vec2.create(), point, this.pos))
    return new Polygon(points).appendToPath(path)
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
    const ship = this.game.ship
    return (
      vec2.distance(this.pos, ship.top) <= this.collisionRadius
      || vec2.distance(this.pos, ship.left) <= this.collisionRadius
      || vec2.distance(this.pos, ship.right) <= this.collisionRadius
    )
  }

  collisionWithLaser(laser: Laser) {
    return vec2.distance(this.pos, laser.pos) <= this.collisionRadius
  }

  getCollisionCircle() {
    return new Circle(this.pos[0], this.pos[1], this.collisionRadius)
  }
}