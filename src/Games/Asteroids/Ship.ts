class Ship implements Drawable, HasPath {
  static MaxSpeed: number = 3
  static ShootDelay: number = 33

  static TopAngle: number = 0
  static SideAngle: number = 2.4
  static TopDistance: number = 20
  static SideDistance: number = 20

  static NumRays: number = 5
  static RayDeltaTheta: number = 0.3
  static RayLength: number = 300

  pos: Vec2
  game: Asteroids
  heading: number
  velocity: Vec2
  lasers: Laser[]
  alive: boolean
  top: Vec2
  left: Vec2
  right: Vec2
  rays: Ray2[]

  shootTimer: number = 0

  constructor(game: Asteroids, pos?: Vec2) {
    this.game = game
    this.pos = pos || vec2.create()
    this.heading = -Math.PI / 2
    this.velocity = vec2.create()
    this.lasers = []
    this.alive = true

    this.updateTopLeftRight()

    this.rays = new Array(Ship.NumRays).fill(0).map(
      () => new Ray2(this.pos)
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

  loadInputs(straight = 0, turn = 0, shoot = 0): void {
    this.push(straight)
    this.turn(turn)
    if (shoot > 0.9) this.shoot()
  }

  update(): void {
    this.shootTimer--
    this.shootTimer = clamp(this.shootTimer, 0, Ship.ShootDelay)
    vec2.add(this.pos, this.pos, this.velocity)
    vec2.scale(this.velocity, this.velocity, 0.999)
    this.wrap()
    this.updateTopLeftRight()
    for (let laser of [...this.lasers].reverse()) {
      laser.update()
    }
    this.updateRays()
  }

  updateTopLeftRight(): void {
    this.top = vec2.fromAngle(Ship.TopAngle + this.heading, Ship.TopDistance)
    this.left = vec2.fromAngle(Ship.SideAngle + this.heading, Ship.SideDistance)
    this.right = vec2.fromAngle(-Ship.SideAngle + this.heading, Ship.SideDistance)

    vec2.add(this.top, this.top, this.pos)
    vec2.add(this.left, this.left, this.pos)
    vec2.add(this.right, this.right, this.pos)
  }

  updateRays(): void {
    const maxHeadingOffset: number = 0.5 * (Ship.NumRays - 1) * Ship.RayDeltaTheta
    this.rays.forEach((ray, i) => ray.setAngle(lerp(
      i, 0, Ship.NumRays, this.heading - maxHeadingOffset, this.heading + maxHeadingOffset
    )))
  }

  push(direction: number): void {
    if (direction == 0) return
    const dir = vec2.fromAngle(this.heading, direction * 0.1)
    vec2.add(this.velocity, this.velocity, dir)

    if (vec2.length(this.velocity) > Ship.MaxSpeed) {
      vec2.normalize(this.velocity, this.velocity)
      vec2.scale(this.velocity, this.velocity, Ship.MaxSpeed)
    }
  }

  wrap(): void {
    const x = this.pos[0]
    const y = this.pos[1]
    const w = this.game.width
    const h = this.game.height
    if (x > w) this.pos[0] = 0
    if (x < 0) this.pos[0] = w
    if (y > h) this.pos[1] = 0
    if (y < 0) this.pos[1] = h
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

  draw(g: Graphics): void {
    g.strokeTriangle(
      this.top[0], this.top[1],
      this.left[0], this.left[1],
      this.right[0], this.right[1]
    )
    this.lasers.forEach(laser => laser.draw(g))
  }

  createPath(): Path2D {
    let path = new Triangle(
      this.top[0], this.top[1],
      this.left[0], this.left[1],
      this.right[0], this.right[1]
    ).createPath()

    this.lasers.forEach(laser => laser.appendToPath(path))

    return path
  }

  appendToPath(path: Path2D): Path2D {
    new Triangle(
      this.top[0], this.top[1],
      this.left[0], this.left[1],
      this.right[0], this.right[1]
    ).appendToPath(path)

    this.lasers.forEach(laser => laser.appendToPath(path))

    return path
  }

  getRayInfo(): RayInfo[] {
    const info: RayInfo[] = []

    const asteroidCircles = this.game.asteroids.map(asteroid => asteroid.getCollisionCircle())

    for (const ray of this.rays) {
      const point = ray.castOntoClosest(asteroidCircles)
      if (point) {
        const distance = vec2.distance(this.pos, point)
        const hitting = distance <= Ship.RayLength
        info.push({ ray, hitting, distance: lerp(distance, 0, Ship.RayLength, 0, 1) })
      } else {
        info.push({ ray, hitting: false, distance: -1 })
      }
    }
    return info
  }

  getInfo(): ShipInfo {
    return {
      game: this.game,
      ship: this,
      alive: this.alive,
      posX: this.pos[0] / this.game.width,
      posY: this.pos[1] / this.game.height,
      velX: this.velocity[0] / Ship.MaxSpeed,
      velY: this.velocity[1] / Ship.MaxSpeed,
      heading: this.heading / Math.PI / 2,
      canShoot: this.canShoot,
      rays: this.getRayInfo()
    }
  }
}