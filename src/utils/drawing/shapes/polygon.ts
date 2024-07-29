class Polygon implements Drawable, HasPath {
  points: Vec2[]

  constructor(points: Vec2[]) {
    this.points = points
  }

  fill(g: Graphics): void {
    g.fillPolygon(this.points)
  }

  stroke(g: Graphics) {
    g.strokePolygon(this.points)
  }

  createPath(): Path2D {
    let length = this.points.length
    if (this.points.length == 0 || this.points.length == 1) return new Path2D()
    const path = new Path2D()
    const p1 = this.points[0]
    path.moveTo(p1[0], p1[1])
    for (let i = 1; i < length; i++) {
      const p = this.points[i]
      path.lineTo(p[0], p[1])
    }
    path.closePath()
    return path
  }

  appendToPath(path: Path2D): Path2D {
    path.addPath(this.createPath())
    return path
  }
}