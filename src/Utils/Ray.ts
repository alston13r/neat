type CastableObject = Line | Circle

class Ray2 implements Drawable {
  pos: Vec2
  dir: Vec2
  length: number

  constructor(pos: Vec2, angle = 0, length = 1) {
    this.pos = pos
    this.dir = vec2.fromAngle(angle)
    this.length = length
  }

  lookAt(x: number, y: number): void {
    vec2.subtract(this.dir, vec2.fromValues(x, y), this.pos)
    vec2.normalize(this.dir, this.dir)
  }

  setAngle(angle: number): Ray2 {
    vec2.set(this.dir, Math.cos(angle), Math.sin(angle))
    return this
  }

  setLength(length: number): Ray2 {
    this.length = length
    return this
  }

  castOntoClosest(objects: CastableObject[]): Vec2 {
    let closest: Vec2
    let record = Infinity
    for (const object of objects) {
      let point: Vec2
      if (object instanceof Line) {
        point = this.castOntoLine(object)
      }
      else if (object instanceof Circle) {
        point = this.castOntoCircle(object)
      }
      if (point) {
        const distance = vec2.distance(this.pos, point)
        if (distance < record) {
          record = distance
          closest = point
        }
      }
    }
    return closest
  }

  castOntoLine(line: Line): Vec2 {
    const x1: number = line.x1
    const y1: number = line.y1
    const x2: number = line.x2
    const y2: number = line.y2

    const x3: number = this.pos[0]
    const y3: number = this.pos[1]
    const x4: number = x3 + this.dir[0]
    const y4: number = y3 + this.dir[1]

    const den: number = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if (den == 0) return

    const t: number = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den
    const u: number = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den

    if (t > 0 && t < 1 && u > 0) {
      const point: Vec2 = vec2.create()
      point[0] = x1 + t * (x2 - x1)
      point[1] = y1 + t * (y2 - y1)
      return point
    }
  }

  castOntoCircle(circle: Circle): Vec2 {
    const px = this.pos[0]
    const py = this.pos[1]
    const dx = this.dir[0]
    const dy = this.dir[1]

    const x1 = px - circle.x
    const y1 = py - circle.y
    const x2 = px + dx - circle.x
    const y2 = py + dy - circle.y

    const dr = Math.sqrt(dx ** 2 + dy ** 2)

    const det = x1 * y2 - x2 * y1
    const disc = circle.radius ** 2 * dr ** 2 - det ** 2

    if (disc < 0) return
    const discSqrt = Math.sqrt(disc)

    const sgn = dy < 0 ? -1 : 1

    const P = (det * dy + sgn * dx * discSqrt) / dr ** 2
    const Q = (-det * dx + Math.abs(dy) * discSqrt) / dr ** 2
    const R = (det * dy - sgn * dx * discSqrt) / dr ** 2
    const S = (-det * dx - Math.abs(dy) * discSqrt) / dr ** 2

    const p1 = vec2.fromValues(P, Q)
    const p2 = vec2.fromValues(R, S)
    vec2.add(p1, p1, circle.pos)
    vec2.add(p2, p2, circle.pos)

    const posAddDir = vec2.add(vec2.create(), this.pos, this.dir)

    const d1 = vec2.distance(this.pos, p1)
    const d2 = vec2.distance(posAddDir, p1)
    const d3 = vec2.distance(this.pos, p2)
    const d4 = vec2.distance(posAddDir, p2)

    const p1Forward = d2 < d1
    const p2Forward = d4 < d3

    if (!p1Forward && !p2Forward) return
    if (p1Forward && !p2Forward) return p1
    if (!p1Forward && p2Forward) return p2
    return d1 < d3 ? p1 : p2
  }

  draw(g: Graphics): void {
    const d = vec2.copy(vec2.create(), this.dir)
    vec2.scale(d, d, this.length)
    vec2.add(d, d, this.pos)

    g.line(this.pos[0], this.pos[1], d[0], d[1])
  }
}