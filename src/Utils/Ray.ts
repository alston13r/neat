type CastableObject = Line | Circle

class Ray implements Drawable {
  pos: Vector
  dir: Vector
  graphics: Graphics
  length: number

  constructor(pos: Vector, angle: number, length: number = 1) {
    this.pos = pos
    this.dir = Vector.FromAngle(angle)
    this.length = length
  }

  setGraphics(graphics: Graphics): Ray {
    this.graphics = graphics
    return this
  }

  lookAt(x: number, y: number): void {
    this.dir.x = x - this.pos.x
    this.dir.y = y - this.pos.y
    Vector.Normal(this.dir)
  }

  setAngle(theta: number): Ray {
    this.dir = Vector.FromAngle(theta)
    return this
  }

  setLength(length: number): Ray {
    this.length = length
    return this
  }

  castOntoClosest(objects: CastableObject[]): Vector {
    let closest: Vector
    let record: number = Infinity
    for (const object of objects) {
      let point: Vector
      if (object instanceof Line) {
        point = this.castOntoLine(object)
      }
      else if (object instanceof Circle) {
        point = this.castOntoCircle(object)
      }
      if (point) {
        const distance: number = this.pos.distanceTo(point)
        if (distance < record) {
          record = distance
          closest = point
        }
      }
    }
    return closest
  }

  castOntoLine(line: Line): Vector {
    const x1: number = line.x1
    const y1: number = line.y1
    const x2: number = line.x2
    const y2: number = line.y2

    const x3: number = this.pos.x
    const y3: number = this.pos.y
    const x4: number = this.pos.x + this.dir.x
    const y4: number = this.pos.y + this.dir.y

    const den: number = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if (den == 0) return

    const t: number = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den
    const u: number = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den

    if (t > 0 && t < 1 && u > 0) {
      const point: Vector = new Vector()
      point.x = x1 + t * (x2 - x1)
      point.y = y1 + t * (y2 - y1)
      return point
    }
  }

  castOntoCircle(circle: Circle): Vector {
    const x1: number = this.pos.x - circle.x
    const y1: number = this.pos.y - circle.y
    const x2: number = this.pos.x + this.dir.x - circle.x
    const y2: number = this.pos.y + this.dir.y - circle.y

    const dx: number = this.dir.x
    const dy: number = this.dir.y
    const dr: number = Math.sqrt(dx ** 2 + dy ** 2)

    const det: number = x1 * y2 - x2 * y1
    const disc: number = circle.radius ** 2 * dr ** 2 - det ** 2

    if (disc < 0) return
    const discSqrt: number = Math.sqrt(disc)

    const sgn: number = dy < 0 ? -1 : 1

    const P: number = (det * dy + sgn * dx * discSqrt) / dr ** 2
    const Q: number = (-det * dx + Math.abs(dy) * discSqrt) / dr ** 2
    const R: number = (det * dy - sgn * dx * discSqrt) / dr ** 2
    const S: number = (-det * dx - Math.abs(dy) * discSqrt) / dr ** 2

    const p1: Vector = new Vector(P, Q).add(circle.point)
    const p2: Vector = new Vector(R, S).add(circle.point)

    const d1: number = this.pos.distanceTo(p1)
    const d2: number = this.pos.add(this.dir).distanceTo(p1)
    const d3: number = this.pos.distanceTo(p2)
    const d4: number = this.pos.add(this.dir).distanceTo(p2)

    const p1Forward: boolean = d2 < d1
    const p2Forward: boolean = d4 < d3

    if (!p1Forward && !p2Forward) return
    if (p1Forward && !p2Forward) return p1
    if (!p1Forward && p2Forward) return p2
    return d1 < d3 ? p1 : p2
  }

  draw(color: string = '#fff'): void {
    const d: Vector = this.pos.add(this.dir.scale(this.length))
    this.graphics.createLine(this.pos.x, this.pos.y, d.x, d.y, { color }).draw()
  }
}