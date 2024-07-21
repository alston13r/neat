class Laser implements Drawable {
  static Speed = 5

  graphics: Graphics
  ship: Ship
  pos: Vec2
  velocity: Vec2
  radius: number = 5

  constructor(ship: Ship) {
    this.ship = ship
    ship.lasers.push(this)
    this.graphics = ship.graphics
    this.graphics = ship.graphics
    this.pos = ship.top
    this.velocity = vec2.fromAngle(ship.heading, Laser.Speed)
  }

  update(): void {
    vec2.add(this.pos, this.pos, this.velocity)
    this.wrap()
  }

  draw(): void {
    this.graphics.createCircle(this.pos[0], this.pos[1], this.radius, { fill: false, stroke: true }).draw()
  }

  terminate(): void {
    this.ship.lasers.splice(this.ship.lasers.indexOf(this), 1)
  }

  wrap(): void {
    const x = this.pos[0]
    const y = this.pos[1]
    const w = this.ship.game.width
    const h = this.ship.game.height
    if (x > w) this.terminate()
    else if (x < 0) this.terminate()
    else if (y > h) this.terminate()
    else if (y < 0) this.terminate()
  }
}