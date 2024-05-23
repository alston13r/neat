class Asteroid {
  static SizeCutoff = 10

  /**
   * @param {Game} game 
   * @param {Vector} pos 
   */
  constructor(game, pos, r) {
    this.game = game
    this.graphics = game.graphics
    this.pos = pos
    this.r = r || Math.random() * 25 + 25
    this.offsets = new Array(Math.floor(Math.random() * 5) + 10).fill(0).map(() => Math.random() * 20 - 8)
    this.velocity = Vector.FromAngle(Math.random() * 2 * Math.PI).scale(Math.random() * 0.5 + 1)
    this.maxR = this.offsets.reduce((max, curr) => curr > max ? curr : max, 0) + this.r
    this.minR = this.offsets.reduce((min, curr) => curr < min ? curr : min) + this.r
    this.collisionRadius = (this.maxR + this.minR) / 2
    this.points = this.offsets.map((x, i) => {
      let angle = i / this.offsets.length * 2 * Math.PI
      let r = this.r + x
      return Vector.FromAngle(angle).scale(r)
    })
  }

  update() {
    this.pos = this.pos.add(this.velocity)
    this.wrap()
  }

  split() {
    let index = this.game.asteroids.indexOf(this)
    this.game.asteroids.splice(index, 1)
    let half = this.r / 2
    if (half < Asteroid.SizeCutoff) return
    this.game.asteroids.push(new Asteroid(this.game, this.pos, half))
    this.game.asteroids.push(new Asteroid(this.game, this.pos, half))
    this.game.emitEvent(GameEvent.AsteroidDestroyed)
  }

  draw() {
    this.graphics.ctx.strokeStyle = '#fff'
    this.graphics.ctx.lineWidth = 1
    this.graphics.ctx.beginPath()
    for (let [i, p] of this.points.entries()) {
      if (i == 0) this.graphics.ctx.moveTo(...p.add(this.pos))
      else this.graphics.ctx.lineTo(...p.add(this.pos))
    }
    this.graphics.ctx.closePath()
    this.graphics.ctx.stroke()
  }

  wrap() {
    let x = this.pos.x
    let y = this.pos.y
    let w = this.game.width
    let h = this.game.height
    if (x > w + this.r) this.pos.x = -this.r
    if (x < -this.r) this.pos.x = w + this.r
    if (y > h + this.r) this.pos.y = -this.r
    if (y < -this.r) this.pos.y = h + this.r
  }

  /**
   * @returns {boolean}
   */
  collisionWithShip() {
    let top = this.game.ship.top
    let left = this.game.ship.left
    let right = this.game.ship.right
    if (top.sub(this.pos).mag() <= this.collisionRadius) return true
    if (left.sub(this.pos).mag() <= this.collisionRadius) return true
    if (right.sub(this.pos).mag() <= this.collisionRadius) return true
    return false
  }

  /**
   * @param {Laser} laser
   * @returns {boolean}
   */
  collisionWithLaser(laser) {
    return laser.pos.sub(this.pos).mag() <= this.collisionRadius
  }

  getInfo() {
    let d = this.pos.sub(this.game.ship.pos)
    return {
      velX: this.velocity.x / 1.5,
      velY: this.velocity.y / 1.5,
      angleFromShip: Math.atan2(d.y, d.x) / 2 / Math.PI,
      distanceFromShip: d.mag() / this.graphics.size.mag(),
      size: this.r
    }
  }
}