class Ray implements Drawable {
  pos: Vector
  dir: Vector
  graphics: Graphics

  constructor(pos: Vector, angle: number) {
    this.pos = pos
    this.dir = Vector.FromAngle(angle)
  }

  setGraphics(graphics: Graphics): Ray {
    this.graphics = graphics
    return this
  }

  lookAt(x: number, y: number): void {
    this.dir.x = x - this.pos.x
    this.dir.y = y - this.pos.y
    this.dir = this.dir.normal()
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
    circle.draw()

    return
  }

  draw(): void {
    const d: Vector = this.pos.add(this.dir.scale(10))
    this.graphics.createLine(this.pos.x, this.pos.y, d.x, d.y, '#fff').draw()
  }
}