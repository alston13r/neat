class Ray {
  pos: Vector
  dir: Vector

  constructor(pos: Vector, angle: number) {
    this.pos = pos
    this.dir = Vector.FromAngle(angle)
  }

  lookAt(x: number, y: number): void {
    this.dir.x = x - this.pos.x
    this.dir.y = y - this.pos.y
    this.dir = this.dir.normal()
  }

  cast(wall: Boundary): Vector {
    const x1: number = wall.a.x
    const y1: number = wall.a.y
    const x2: number = wall.b.x
    const y2: number = wall.b.y

    const x3: number = this.pos.x
    const y3: number = this.pos.y
    const x4: number = this.pos.x + this.dir.x
    const y4: number = this.pos.y + this.dir.y

    const den: number = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    if (den == 0) return

    const t: number = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den
    const u: number = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den

    if (t > 0 && t < 1 && u > 0) {
      const pt: Vector = new Vector()
      pt.x = x1 + t * (x2 - x1)
      pt.y = y1 + t * (y2 - y1)
      return pt
    }
  }

  draw(): void {
    const d: Vector = this.pos.add(this.dir.scale(10))
    raycastingGraphics.createLine(this.pos.x, this.pos.y, d.x, d.y, '#fff').draw()
  }
}