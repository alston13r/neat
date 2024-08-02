class Laser {
  static Speed = 5
  static Radius = 5

  ship: Ship
  pos = vec2.create()
  velocity = vec2.create()

  constructor(ship: Ship) {
    this.ship = ship
    ship.lasers.push(this)
    vec2.copy(this.pos, ship.top)
    vec2.scale(this.velocity, FastVec2FromRadian(ship.heading), Laser.Speed)
  }

  update() {
    vec2.add(this.pos, this.pos, this.velocity)
    if (
      this.pos[0] < 0
      || this.pos[1] < 0
      || this.pos[0] > this.ship.game.width
      || this.pos[1] > this.ship.game.height
    ) this.ship.lasers.splice(this.ship.lasers.indexOf(this), 1)
  }
}