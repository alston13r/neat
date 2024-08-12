type AsteroidsShipControls = {
  'ArrowUp'?: number,
  'ArrowDown'?: number,
  'ArrowLeft'?: number,
  'ArrowRight'?: number,
  ' '?: number
}

class Ship {
  static MaxSpeed = 3
  static ShootDelay = 33

  static TopAngle = 0
  static SideAngle = 2.4
  static TopDistance = 20
  static SideDistance = 20

  static NumRays = 5
  static RayDeltaTheta = 0.3
  static RayLength = 300
  static UpdateRaysConstantA = 0.5 * (Ship.NumRays - 1) * Ship.RayDeltaTheta
  static UpdateRaysConstantB = (Ship.NumRays - 1) * Ship.RayDeltaTheta / Ship.NumRays

  pos = vec2.create()
  game: Asteroids
  heading = -Math.PI / 2
  velocity = vec2.create()
  lasers: Laser[] = []
  alive = true
  top = vec2.fromValues(0, -20)
  left = vec2.fromValues(13.511804342269897, 14.745546579360962)
  right = vec2.fromValues(-13.486047983169556, 14.769107103347778)
  rays: Ray2[]

  shootTimer = 0

  constructor(game: Asteroids) {
    this.game = game
    vec2.set(this.pos, game.width / 2, game.height / 2)

    vec2.add(this.top, this.top, this.pos)
    vec2.add(this.left, this.left, this.pos)
    vec2.add(this.right, this.right, this.pos)

    this.rays = []
    for (let i = 0; i < Ship.NumRays; i++) {
      this.rays.push(new Ray2(this.pos).setLength(Ship.RayLength))
    }
    this.updateRays()
  }

  reset() {
    vec2.set(this.pos, this.game.width / 2, this.game.height / 2)
    this.heading = -Math.PI / 2
    vec2.zero(this.velocity)
    this.lasers.length = 0
    this.alive = true
    vec2.set(this.top, 0, -20)
    vec2.set(this.left, 13.511804342269897, 14.745546579360962)
    vec2.set(this.right, -13.486047983169556, 14.769107103347778)
    this.updateRays()
  }

  loadInputs(straight = 0, turn = 0, shoot = 0): void {
    this.push(straight)
    this.turn(turn)
    if (shoot > 0.9) this.shoot()
  }

  update(): void {
    if (this.shootTimer > 0) this.shootTimer--
    if (this.shootTimer < 0) this.shootTimer = 0
    vec2.add(this.pos, this.pos, this.velocity)
    vec2.scale(this.velocity, this.velocity, 0.999)
    this.wrap()
    this.updateTopLeftRight()
    for (const laser of this.lasers) {
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
    for (let i = 0; i < Ship.NumRays; i++) {
      const angle = i * Ship.UpdateRaysConstantB + (this.heading - Ship.UpdateRaysConstantA)
      const ray = this.rays[i]
      vec2.copy(ray.dir, FastVec2FromRadian(angle))
    }
  }

  push(direction: number): void {
    if (direction == 0) return
    const dir = FastVec2FromRadian(this.heading)
    vec2.scaleAndAdd(this.velocity, this.velocity, dir, direction * 0.1)
    if (vec2.length(this.velocity) > Ship.MaxSpeed) {
      vec2.normalize(this.velocity, this.velocity)
      vec2.scale(this.velocity, this.velocity, Ship.MaxSpeed)
    }
  }

  wrap(): void {
    if (this.pos[0] > this.game.width) this.pos[0] = 0
    else if (this.pos[0] < 0) this.pos[0] = this.game.width
    if (this.pos[1] > this.game.height) this.pos[1] = 0
    else if (this.pos[1] < 0) this.pos[1] = this.game.height
  }

  turn(direction: number): void {
    if (direction == 0) return
    this.heading += direction * 0.05
    this.heading %= 2 * Math.PI
  }

  shoot(): void {
    if (this.shootTimer <= 0) {
      new Laser(this)
      this.shootTimer = Ship.ShootDelay
    }
  }

  getRayInfo() {
    const asteroidCircles = this.game.asteroids.map(asteroid => asteroid.getCollisionCircle())
    return this.rays.map(ray => {
      const point = ray.castOntoCircles(asteroidCircles)
      if (point) return vec2.distance(this.pos, point) / (Ship.RayLength)
      return -1
    })
  }

  getInfo() {
    return [
      this.pos[0] / this.game.width,
      this.pos[1] / this.game.height,
      this.velocity[0] / Ship.MaxSpeed,
      this.velocity[1] / Ship.MaxSpeed,
      this.heading / TwoPi,
      this.shootTimer == 0 ? 1 : 0,
      ...this.getRayInfo()
    ]
  }

  loadIntoBrain(b: Brain) {
    return b.think([
      this.pos[0] / this.game.width,
      this.pos[1] / this.game.height,
      this.velocity[0] / Ship.MaxSpeed,
      this.velocity[1] / Ship.MaxSpeed,
      this.heading / TwoPi,
      this.shootTimer <= 0 ? 1 : 0,
      ...this.getRayInfo()
    ])
  }
}