class LaserPool {
  private static pool: Laser[] = []

  static acquire(ship: Ship): Laser {
    if (LaserPool.pool.length > 0) {
      const laser = LaserPool.pool.pop()
      laser.reset(ship)
      return laser
    }
    return new Laser(ship)
  }

  static release(laser: Laser) {
    LaserPool.pool.push(laser)
  }

  static clearPool() {
    LaserPool.pool.length = 0
  }
}

class Laser {
  static Speed = 5
  static Radius = 5

  ship: Ship
  pos = vec2.create()
  velocity = vec2.create()
  active: boolean

  constructor(ship: Ship) {
    this.ship = ship
    ship.lasers.push(this)
    vec2.copy(this.pos, ship.top)
    vec2.scale(this.velocity, FastVec2FromRadian(ship.heading), Laser.Speed)
    this.active = true
  }

  reset(ship: Ship) {
    this.ship = ship
    ship.lasers.push(this)
    vec2.copy(this.pos, ship.top)
    vec2.scale(this.velocity, FastVec2FromRadian(ship.heading), Laser.Speed)
    this.active = true
  }

  update() {
    if (!this.active) return

    vec2.add(this.pos, this.pos, this.velocity)
    if (
      this.pos[0] < 0
      || this.pos[1] < 0
      || this.pos[0] > this.ship.game.width
      || this.pos[1] > this.ship.game.height
    ) this.active = false
  }

  deactivate() {
    this.active = false
  }
}