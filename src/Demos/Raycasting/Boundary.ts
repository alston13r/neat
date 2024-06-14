class Boundary {
  a: Vector
  b: Vector

  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.a = new Vector(x1, y1)
    this.b = new Vector(x2, y2)
  }

  draw(): void {
    raycastingGraphics.createLine(this.a.x, this.a.y, this.b.x, this.b.y, '#fff').draw()
  }
}