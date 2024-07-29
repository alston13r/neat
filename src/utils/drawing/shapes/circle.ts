class Circle implements Drawable, HasPath {
  pos: Vec2
  radius: number

  constructor(x: number, y: number, radius: number) {
    this.pos = vec2.fromValues(x, y)
    this.radius = radius
  }

  get x() {
    return this.pos[0]
  }

  get y() {
    return this.pos[1]
  }

  fill(g: Graphics) {
    g.fillCircle(this.x, this.y, this.radius)
  }

  stroke(g: Graphics) {
    g.strokeCircle(this.x, this.y, this.radius)
  }

  createPath(): Path2D {
    let path = new Path2D()
    path.arc(this.x, this.y, this.radius, 0, TwoPi)
    return path
  }

  appendToPath(path: Path2D): Path2D {
    path.addPath(this.createPath())
    return path
  }
}