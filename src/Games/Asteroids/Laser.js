class Laser {
  static Speed = 5

  /**
   * @param {Ship} ship 
   */
  constructor(ship) {
    this.ship = ship
    ship.lasers.push(this)
    this.graphics = ship.graphics
    this.pos = ship.top
    this.velocity = Vector.FromAngle(ship.heading).scale(Laser.Speed)
    this.r = 5
  }

  update() {
    this.pos = this.pos.add(this.velocity)
    this.wrap()
  }

  draw() {
    this.graphics.circle(...this.pos, this.r, '#fff', true)
  }

  terminate() {
    this.ship.lasers.splice(this.ship.lasers.indexOf(this), 1)
  }

  wrap() {
    let x = this.pos.x
    let y = this.pos.y
    let w = this.ship.game.width
    let h = this.ship.game.height
    if (x > w) this.terminate()
    else if (x < 0) this.terminate()
    else if (y > h) this.terminate()
    else if (y < 0) this.terminate()
  }
}