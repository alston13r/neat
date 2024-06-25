class Ship implements Drawable {
  static MaxSpeed: number = 3
  static ShootDelay: number = 33

  static TopAngle: number = 0
  static SideAngle: number = 2.4
  static TopDistance: number = 20
  static SideDistance: number = 20

  static NumRays: number = 5
  static RayDeltaTheta: number = 0.3
  static RayLength: number = 300

  pos: Vector
  game: Asteroids
  graphics: Graphics
  heading: number
  velocity: Vector
  lasers: Laser[]
  alive: boolean
  top: Vector
  left: Vector
  right: Vector
  rays: Ray[]

  shootTimer: number = 0

  constructor(game: Asteroids, pos: Vector) {
    this.game = game
    this.graphics = game.graphics
    this.pos = pos || new Vector()
    this.heading = -Math.PI / 2
    this.velocity = new Vector()
    this.lasers = []
    this.alive = true
    this.top = Vector.FromAngle(Ship.TopAngle + this.heading).scale(Ship.TopDistance).add(pos)
    this.left = Vector.FromAngle(Ship.SideAngle + this.heading).scale(Ship.SideDistance).add(pos)
    this.right = Vector.FromAngle(-Ship.SideAngle + this.heading).scale(Ship.SideDistance).add(pos)

    this.rays = new Array(Ship.NumRays).fill(0).map(
      () => this.pos.createRay()
        .setGraphics(this.graphics)
        .setLength(Ship.RayLength)
    )
    this.updateRays()
  }

  get canShoot(): boolean {
    return this.shootTimer <= 0
  }

  kill(): void {
    this.alive = false
    this.game.dispatchEvent(new CustomEvent<ShipInfo>('shipdestroyed', { detail: this.getInfo() }))
    this.game.dispatchEvent(new CustomEvent<GameInfo>('end', { detail: this.game.getInfo() }))
  }

  loadInputs(straight: number = 0, turn: number = 0, shoot: number = 0): void {
    this.push(straight)
    this.turn(turn)
    if (shoot > 0.9) this.shoot()
  }

  update(): void {
    this.shootTimer--
    this.shootTimer = clamp(this.shootTimer, 0, Ship.ShootDelay)
    Vector.Add(this.pos, this.velocity)
    this.velocity = this.velocity.scale(0.999)
    this.wrap()
    this.top = Vector.FromAngle(Ship.TopAngle + this.heading).scale(Ship.TopDistance).add(this.pos)
    this.left = Vector.FromAngle(Ship.SideAngle + this.heading).scale(Ship.SideDistance).add(this.pos)
    this.right = Vector.FromAngle(-Ship.SideAngle + this.heading).scale(Ship.SideDistance).add(this.pos)
    for (let laser of [...this.lasers].reverse()) {
      laser.update()
    }
    this.updateRays()
  }

  updateRays(): void {
    const maxHeadingOffset: number = 0.5 * (Ship.NumRays - 1) * Ship.RayDeltaTheta
    this.rays.forEach((ray, i) => ray.setAngle(lerp(
      i, 0, Ship.NumRays, this.heading - maxHeadingOffset, this.heading + maxHeadingOffset
    )))
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
      this.shootTimer = Ship.ShootDelay
    }
  }

  draw(): void {
    this.graphics.createTriangle(...this.top.toXY(), ...this.left.toXY(), ...this.right.toXY(),
      { fill: false, stroke: true }).draw()
    this.lasers.forEach(laser => laser.draw())
  }

  getRayInfo(debug: boolean = false): RayInfo[] {
    const info: RayInfo[] = []

    const asteroidCircles: Circle[] = this.game.asteroids.map(asteroid => asteroid.getCollisionCircle())

    for (const ray of this.rays) {
      const point: Vector = ray.castOntoClosest(asteroidCircles)
      if (point) {
        const distance: number = this.pos.distanceTo(point)
        const hitting: boolean = distance <= Ship.RayLength
        info.push({ ray, hitting, distance: lerp(distance, 0, Ship.RayLength, 0, 1) })

        if (debug) {
          ray.draw(hitting ? '#0f0' : '#00f')
          this.graphics.createCircle(point.x, point.y, 5, { color: '#f00' }).draw()
        }
      } else {
        info.push({ ray, hitting: false, distance: -1 })

        if (debug) ray.draw()
      }
    }
    return info
  }

  getInfo(): ShipInfo {
    return {
      game: this.game,
      ship: this,
      alive: this.alive,
      posX: this.pos.x / this.game.width,
      posY: this.pos.y / this.game.height,
      velX: this.velocity.x / Ship.MaxSpeed,
      velY: this.velocity.y / Ship.MaxSpeed,
      heading: this.heading / Math.PI / 2,
      canShoot: this.canShoot,
      rays: this.getRayInfo()
    }
  }
}