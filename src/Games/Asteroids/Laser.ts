class Laser implements Drawable {
  static Speed = 5

  graphics: Graphics
  ship: Ship
  pos: Vector
  velocity: Vector
  radius: number = 5

  constructor(ship: Ship) {
    this.ship = ship
    ship.lasers.push(this)
    this.graphics = ship.graphics
    this.graphics = ship.graphics
    this.pos = ship.top
    this.velocity = Vector.FromAngle(ship.heading).scale(Laser.Speed)
  }

  update(): void {
    this.pos = this.pos.add(this.velocity)
    this.wrap()
  }

  draw(): void {
    this.graphics.createCircle(this.pos.x, this.pos.y, this.radius, { fill: false, stroke: true }).draw()
  }

  terminate(): void {
    this.ship.lasers.splice(this.ship.lasers.indexOf(this), 1)
  }

  wrap(): void {
    const x: number = this.pos.x
    const y: number = this.pos.y
    const w: number = this.ship.game.width
    const h: number = this.ship.game.height
    if (x > w) this.terminate()
    else if (x < 0) this.terminate()
    else if (y > h) this.terminate()
    else if (y < 0) this.terminate()
  }
}