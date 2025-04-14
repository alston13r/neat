/**
 * Type definition for the control input for a ship in Asteroids.
 * @prop {number} [ArrowUp] a value of 0 or 1 indicating the ArrowUp key is pressed
 * @prop {number} [ArrowDown] a value of 0 or 1 indicating the ArrowUp key is pressed
 * @prop {number} [ArrowLeft] a value of 0 or 1 indicating the ArrowUp key is pressed
 * @prop {number} [ArrowRight] a value of 0 or 1 indicating the ArrowUp key is pressed
 */
type AsteroidsShipControls = {
  'ArrowUp'?: number,
  'ArrowDown'?: number,
  'ArrowLeft'?: number,
  'ArrowRight'?: number,
  ' '?: number
}

/**
 * A Ship is the player's character in the game of Asteroids. The Ship
 * has forwards and backwards propulsion as well as steering. This class
 * provides a method, {@link Ship.loadInputs}, which can take 3 number
 * inputs for controlling the Ship. This allows for the NEAT algorithm to
 * take control of a Ship using the outputs directly from the AI.
 */
class Ship {
  /** The maximum speed of a Ship */
  static MaxSpeed = 3
  /** The delay between shots that a Ship can take */
  static ShootDelay = 33

  /** The angle of the top point of a Ship */
  static TopAngle = 0
  /** The angle of the two side points of a Ship */
  static SideAngle = 2.4
  /** The distance of the top point of a Ship to its center */
  static TopDistance = 20
  /** The distance of the side points of a Ship to its center */
  static SideDistance = 20

  /** The number of rays that a Ship casts out */
  static NumRays = 5
  /** The angle between each ray */
  static RayDeltaTheta = 0.3
  /** The length of each ray */
  static RayLength = 300

  /** The position vector of this Ship */
  pos = vec2.create()
  /** A reference to the Asteroids game that this Ship is a part of */
  game: Asteroids
  /** The current heading of this Ship */
  heading = -Math.PI / 2
  /** The velocity vector of this Ship */
  velocity = vec2.create()
  /** An array of all Lasers currently in existence from this Ship */
  lasers: Laser[] = []
  /** Boolean flag indicating whether or not this Ship is alive */
  alive = true
  /** The vector for the Ship's top point */
  top = vec2.fromValues(0, -20)
  /** The vector for the Ship's left point */
  left = vec2.fromValues(13.511804342269897, 14.745546579360962)
  /** The vector for the Ship's right point */
  right = vec2.fromValues(-13.486047983169556, 14.769107103347778)
  /** An array of the rays that the Ship casts out */
  rays: Ray2[]

  /** The current remaining time until the Ship can shoot again */
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
    this.freeLasers()
    this.alive = true
    vec2.set(this.top, 0, -20)
    vec2.set(this.left, 13.511804342269897, 14.745546579360962)
    vec2.set(this.right, -13.486047983169556, 14.769107103347778)
    this.updateRays()
  }

  freeLasers() {
    while (this.lasers.length > 0) {
      LaserPool.release(this.lasers.pop())
    }
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
    for (const laser of this.lasers) laser.update()
    swapPopRemove(this.lasers, l => l.active, l => LaserPool.release(l))
    this.updateRays()
  }

  updateTopLeftRight(): void {
    setVec2FromRadian(this.top, this.heading + Ship.TopAngle)
    setVec2FromRadian(this.left, this.heading + Ship.SideAngle)
    setVec2FromRadian(this.right, this.heading - Ship.SideAngle)

    vec2.scaleAndAdd(this.top, this.pos, this.top, Ship.TopDistance)
    vec2.scaleAndAdd(this.left, this.pos, this.left, Ship.SideDistance)
    vec2.scaleAndAdd(this.right, this.pos, this.right, Ship.SideDistance)
  }

  updateRays(): void {
    for (let i = 0; i < Ship.NumRays; i++) {
      const angle = lerp(i, 0, Ship.NumRays - 1, 1 - Ship.NumRays, Ship.NumRays - 1) * Ship.RayDeltaTheta / 2
      this.rays[i].setAngle(this.heading + angle)
    }
  }

  push(direction: number): void {
    if (direction == 0) return
    const dir = vec2.fromValues(Math.cos(this.heading), Math.sin(this.heading))
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
      LaserPool.acquire(this)
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