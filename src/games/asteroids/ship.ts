type AsteroidsShipControls = {
  'ArrowUp'?: boolean,
  'ArrowDown'?: boolean,
  'ArrowLeft'?: boolean,
  'ArrowRight'?: boolean,
  ' '?: boolean
}

interface RayInfo {
  ray: Ray2
  hitting: boolean
  distance: number
}

interface ShipInfo {
  game: Asteroids
  ship: Ship
  alive: boolean
  posX: number
  posY: number
  velX: number
  velY: number
  heading: number
  canShoot: boolean
  rays: RayInfo[]
}

class Ship implements Drawable, HasPath {
  static MaxSpeed = 3
  static ShootDelay = 33

  static TopAngle = 0
  static SideAngle = 2.4
  static TopDistance = 20
  static SideDistance = 20

  static NumRays = 5
  static RayDeltaTheta = 0.3
  static RayLength = 300

  pos: Vec2
  game: Asteroids
  heading: number
  velocity: Vec2
  lasers: Laser[]
  alive: boolean
  top = vec2.create()
  left = vec2.create()
  right = vec2.create()
  rays: Ray2[]

  shootTimer = 0

  constructor(game: Asteroids, x: number, y: number) {
    this.game = game
    this.pos = vec2.fromValues(x, y)
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
    this.game.dispatchEvent(new CustomEvent('end'))
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
    vec2.scale(this.top, FastVec2FromRadian(this.heading + Ship.TopAngle), Ship.TopDistance)
    vec2.scale(this.left, FastVec2FromRadian(this.heading + Ship.SideAngle), Ship.SideDistance)
    vec2.scale(this.right, FastVec2FromRadian(this.heading - Ship.SideAngle), Ship.SideDistance)

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
    const c = Math.cos(this.heading) * direction * 0.1
    const s = Math.sin(this.heading) * direction * 0.1
    const dir = vec2.fromValues(c, s)
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