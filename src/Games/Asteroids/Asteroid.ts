class Asteroid implements Drawable {
  static SizeCutoff = 10

  graphics: Graphics
  game: AsteroidsGame
  pos: Vector
  radius: number
  offsets: number[]
  velocity: Vector
  maxR: number
  minR: number
  collisionRadius: number
  points: Vector[]

  constructor(game: AsteroidsGame, pos: Vector, radius?: number) {
    this.game = game
    this.graphics = game.graphics
    this.pos = pos
    this.radius = radius || Math.random() * 25 + 25
    this.offsets = new Array(Math.floor(Math.random() * 5) + 10).fill(0).map(() => Math.random() * 20 - 8)
    this.velocity = Vector.FromAngle(Math.random() * 2 * Math.PI).scale(Math.random() * 0.5 + 1)
    this.maxR = this.offsets.reduce((max, curr) => curr > max ? curr : max, 0) + this.radius
    this.minR = this.offsets.reduce((min, curr) => curr < min ? curr : min) + this.radius
    this.collisionRadius = (this.maxR + this.minR) / 2
    this.points = this.offsets.map((x, i) => {
      let angle = i / this.offsets.length * 2 * Math.PI
      let r = this.radius + x
      return Vector.FromAngle(angle).scale(r)
    })
  }

  update(): void {
    this.pos = this.pos.add(this.velocity)
    this.wrap()
  }

  split(): void {
    const index: number = this.game.asteroids.indexOf(this)
    this.game.asteroids.splice(index, 1)
    const half: number = this.radius / 2
    if (half < Asteroid.SizeCutoff) return
    this.game.asteroids.push(new Asteroid(this.game, this.pos, half))
    this.game.asteroids.push(new Asteroid(this.game, this.pos, half))

    this.game.dispatchEvent(new CustomEvent<AsteroidInfo>('asteroiddestroyed', { detail: this.getInfo() }))
  }

  draw(): void {
    const points: Vector[] = this.points.map(point => point.add(this.pos))
    this.graphics.createPolygon(points, { fill: false, stroke: true }).draw()
  }

  wrap(): void {
    const x: number = this.pos.x
    const y: number = this.pos.y
    const w: number = this.game.width
    const h: number = this.game.height
    if (x > w + this.radius) this.pos.x = -this.radius
    if (x < -this.radius) this.pos.x = w + this.radius
    if (y > h + this.radius) this.pos.y = -this.radius
    if (y < -this.radius) this.pos.y = h + this.radius
  }

  collisionWithShip(): boolean {
    const top: Vector = this.game.ship.top
    const left: Vector = this.game.ship.left
    const right: Vector = this.game.ship.right
    if (top.sub(this.pos).mag() <= this.collisionRadius) return true
    if (left.sub(this.pos).mag() <= this.collisionRadius) return true
    if (right.sub(this.pos).mag() <= this.collisionRadius) return true
    return false
  }

  collisionWithLaser(laser: Laser): boolean {
    return laser.pos.sub(this.pos).mag() <= this.collisionRadius
  }

  getCollisionCircle(): Circle {
    return this.graphics.createCircle(this.pos.x, this.pos.y, this.collisionRadius,
      { fill: false, stroke: true, color: '#750101' })
  }

  getInfo(): AsteroidInfo {
    let d = this.pos.sub(this.game.ship.pos)
    return {
      game: this.game,
      asteroid: this,
      velX: this.velocity.x / 1.5,
      velY: this.velocity.y / 1.5,
      size: this.collisionRadius / 50
    }
  }
}