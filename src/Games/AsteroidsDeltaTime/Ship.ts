type ShipInput = {
  straight?: number | null
  turn?: number | null
  shoot?: number | null
}

class DeltaTimeShip implements Drawable {
  static TopAngle: number = 0
  static SideAngle: number = 2.4
  static TopDistance: number = 20
  static SideDistance: number = 20

  static MaxSpeed: number = 500
  static Friction: number = 0.99

  graphics: Graphics

  draw(): void {
    this.graphics.createTriangle(
      ...this.top.toXY(), ...this.left.toXY(), ...this.right.toXY(),
      false, '#fff', true
    ).draw()
  }

  game: DeltaTimeAsteroids
  pos: Vector
  heading: number
  velocity: Vector
  acceleration: Vector
  angularVelocity: number = 0
  points: Vector[]

  constructor(game: DeltaTimeAsteroids, pos?: Vector) {
    this.game = game
    this.graphics = game.graphics
    this.pos = pos || new Vector(this.graphics.width / 2, this.graphics.height / 2)
    this.heading = -Math.PI / 2
    this.velocity = new Vector()
    this.acceleration = new Vector()
    this.points = [
      Vector.FromAngle(Ship.TopAngle + this.heading).scale(Ship.TopDistance).add(this.pos),
      Vector.FromAngle(Ship.SideAngle + this.heading).scale(Ship.SideDistance).add(this.pos),
      Vector.FromAngle(-Ship.SideAngle + this.heading).scale(Ship.SideDistance).add(this.pos)
    ]

    // this.lasers = []
    // this.canShoot = true
    // this.alive = true

    // this.rays = new Array(Ship.NumRays).fill(0).map(
    //   () => this.pos.createRay()
    //     .setGraphics(this.graphics)
    //     .setLength(Ship.RayLength)
    // )
    // this.updateRays()
  }

  get top(): Vector {
    return this.points[0]
  }

  get left(): Vector {
    return this.points[1]
  }

  get right(): Vector {
    return this.points[2]
  }

  loadInputs(inputs: ShipInput): void {
    inputs.straight ||= 0
    inputs.turn ||= 0
    inputs.shoot ||= 0

    if (inputs.turn != 0) {
      this.angularVelocity
      this.heading += inputs.turn * 0.05
      this.heading
    }

    turn(direction: number): void {
      if(direction == 0) return
    this.heading += direction * 0.05
    this.heading %= 2 * Math.PI
  }

  if(inputs.straight != 0) {

}

if (direction == 0) return
const dir: Vector = Vector.FromAngle(this.heading).scale(0.1).scale(direction)
this.velocity = this.velocity.add(dir)
const speed: number = this.velocity.mag()
if (speed > Ship.MaxSpeed) this.velocity = this.velocity.normal().scale(Ship.MaxSpeed)
  }

loadInputs(straight: number = 0, turn: number = 0, shoot: number = 0): void {
  this.push(straight)
    this.turn(turn)
    if(shoot > 0.9) this.shoot()
  }

update(delta: number): void {
  const seconds: number = delta / 1000
    Vector.Add(this.pos, this.velocity.scale(seconds))
    this.velocity = this.velocity.scale(DeltaTimeShip.Friction ** seconds)
    // this.wrap()
    this.points[0] = Vector.FromAngle(Ship.TopAngle + this.heading).scale(Ship.TopDistance).add(this.pos)
    this.points[1] = Vector.FromAngle(Ship.SideAngle + this.heading).scale(Ship.SideDistance).add(this.pos)
    this.points[2] = Vector.FromAngle(-Ship.SideAngle + this.heading).scale(Ship.SideDistance).add(this.pos)

  // for (let laser of [...this.lasers].reverse()) {
  //   laser.update()
  // }
  // this.updateRays()
}


getInfo(): DeltaTimeShipInfo {
  return {
    game: this.game,
    ship: this,
    posX: lerp(this.pos.x, 0, this.graphics.width, -1, 1),
    posY: lerp(this.pos.y, 0, this.graphics.height, -1, 1),
    velX: lerp(this.velocity.x, -Ship.MaxSpeed, Ship.MaxSpeed, -1, 1),
    velY: lerp(this.velocity.y, -Ship.MaxSpeed, Ship.MaxSpeed, -1, 1),
    heading: lerp(this.heading, 0, 2 * Math.PI, -1, 1)
  }
}
}