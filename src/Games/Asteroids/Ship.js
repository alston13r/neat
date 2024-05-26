class Ship {
  static MaxSpeed = 3
  static ShootDelay = 200

  static TopAngle = 0
  static SideAngle = 2.4
  static TopDistance = 20
  static SideDistance = 20

  /**
   * @param {Game} game 
   * @param {Vector} pos 
   */
  constructor(game, pos) {
    this.game = game
    this.graphics = game.graphics
    this.pos = pos || new Vector()
    this.heading = -Math.PI / 2
    this.velocity = new Vector()
    this.lasers = []
    this.canShoot = true
    this.alive = true
  }

  kill() {
    this.alive = false
    this.game.emitEvent(GameEvent.ShipDied)
    this.game.emitEvent(GameEvent.End)
  }

  loadInputs(straight = 0, turn = 0, shoot = 0) {
    this.push(straight)
    this.turn(turn)
    if (shoot > 0.9) this.shoot()
  }

  update() {
    this.pos = this.pos.add(this.velocity)
    this.velocity = this.velocity.scale(0.999)
    this.wrap()
    this.top = Vector.FromAngle(Ship.TopAngle + this.heading).scale(Ship.TopDistance).add(this.pos)
    this.left = Vector.FromAngle(Ship.SideAngle + this.heading).scale(Ship.SideDistance).add(this.pos)
    this.right = Vector.FromAngle(-Ship.SideAngle + this.heading).scale(Ship.SideDistance).add(this.pos)
    for (let laser of [...this.lasers].reverse()) {
      laser.update()
    }
  }

  /**
   * @param {number} direction 
   */
  push(direction) {
    if (direction == 0) return
    let d = Vector.FromAngle(this.heading).scale(0.1).scale(direction)
    this.velocity = this.velocity.add(d)
    let m = this.velocity.mag()
    if (m > Ship.MaxSpeed) this.velocity = this.velocity.normal().scale(Ship.MaxSpeed)
  }

  wrap() {
    let x = this.pos.x
    let y = this.pos.y
    let w = this.game.width
    let h = this.game.height
    if (x > w) this.pos.x = 0
    if (x < 0) this.pos.x = w
    if (y > h) this.pos.y = 0
    if (y < 0) this.pos.y = h
  }

  /**
   * @param {number} d 
   */
  turn(d) {
    if (d == 0) return
    this.heading += d * 0.05
    this.heading %= 2 * Math.PI
  }

  shoot() {
    if (this.canShoot) {
      new Laser(this)
      this.canShoot = false
      setTimeout(() => {
        this.canShoot = true
      }, Ship.ShootDelay)
    }
  }

  draw() {
    this.graphics.triangle(...this.top, ...this.left, ...this.right, '#fff', false, true)
    this.lasers.forEach(laser => laser.draw())
  }

  getInfo() {
    return {
      posX: this.pos.x / this.game.width,
      posY: this.pos.y / this.game.height,
      velX: this.velocity.x / Ship.MaxSpeed,
      velY: this.velocity.y / Ship.MaxSpeed,
      heading: this.heading,
      canShoot: this.canShoot
    }
  }
}