type ShipInfo = {
  posX: number
  posY: number
  velX: number
  velY: number
  heading: number
  canShoot: boolean
}

class Ship implements Drawable {
  static MaxSpeed: number = 3
  static ShootDelay: number = 200

  static TopAngle: number = 0
  static SideAngle: number = 2.4
  static TopDistance: number = 20
  static SideDistance: number = 20

  pos: Vector
  game: AsteroidsGame
  graphics: Graphics
  heading: number
  velocity: Vector
  lasers: Laser[]
  canShoot: boolean
  alive: boolean
  top: Vector
  left: Vector
  right: Vector

  constructor(game: AsteroidsGame, pos: Vector) {
    this.game = game
    this.graphics = game.graphics
    this.pos = pos || new Vector()
    this.heading = -Math.PI / 2
    this.velocity = new Vector()
    this.lasers = []
    this.canShoot = true
    this.alive = true
    this.top = Vector.FromAngle(Ship.TopAngle + this.heading).scale(Ship.TopDistance).add(pos)
    this.left = Vector.FromAngle(Ship.SideAngle + this.heading).scale(Ship.SideDistance).add(pos)
    this.right = Vector.FromAngle(-Ship.SideAngle + this.heading).scale(Ship.SideDistance).add(pos)
  }

  kill(): void {
    this.alive = false
    this.game.dispatch(ShipEvent.ShipDied)
    this.game.dispatch(GameEvent.End)
  }

  loadInputs(straight: number = 0, turn: number = 0, shoot: number = 0): void {
    this.push(straight)
    this.turn(turn)
    if (shoot > 0.9) this.shoot()
  }

  update(): void {
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

  push(direction: number): void {
    if (direction == 0) return
    const dir: Vector = Vector.FromAngle(this.heading).scale(0.1).scale(direction)
    this.velocity = this.velocity.add(dir)
    const speed: number = this.velocity.mag()
    if (speed > Ship.MaxSpeed) this.velocity = this.velocity.normal().scale(Ship.MaxSpeed)
  }

  wrap(): void {
    const x: number = this.pos.x
    const y: number = this.pos.y
    const w: number = this.game.width
    const h: number = this.game.height
    if (x > w) this.pos.x = 0
    if (x < 0) this.pos.x = w
    if (y > h) this.pos.y = 0
    if (y < 0) this.pos.y = h
  }

  turn(direction: number): void {
    if (direction == 0) return
    this.heading += direction * 0.05
    this.heading %= 2 * Math.PI
  }

  shoot(): void {
    if (this.canShoot) {
      new Laser(this)
      this.canShoot = false
      setTimeout(() => {
        this.canShoot = true
      }, Ship.ShootDelay)
    }
  }

  draw(): void {
    this.graphics.createTriangle(this.top.x, this.top.y, this.left.x, this.left.y, this.right.x, this.right.y, false, '#fff', true).draw()
    this.lasers.forEach(laser => laser.draw())
  }

  getInfo(): ShipInfo {
    return {
      posX: this.pos.x / this.game.width,
      posY: this.pos.y / this.game.height,
      velX: this.velocity.x / Ship.MaxSpeed,
      velY: this.velocity.y / Ship.MaxSpeed,
      heading: this.heading / Math.PI / 2,
      canShoot: this.canShoot
    }
  }
}