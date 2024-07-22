class Rectangle implements HasPoint, HasSize, Drawable, HasPath {
  pos: Vec2
  size: Vec2

  constructor(x: number, y: number, width: number, height: number) {
    this.pos = vec2.fromValues(x, y)
    this.size = vec2.fromValues(width, height)
  }

  get x() {
    return this.pos[0]
  }

  get y() {
    return this.pos[1]
  }

  get width() {
    return this.size[0]
  }

  get height() {
    return this.size[1]
  }

  fill(g: Graphics): void {
    g.fillRect(this.x, this.y, this.width, this.height)
  }

  stroke(g: Graphics): void {
    g.strokeRect(this.x, this.y, this.width, this.height)
  }

  createPath(): Path2D {
    let path = new Path2D()
    path.rect(this.x, this.y, this.width, this.height)
    return path
  }

  appendToPath(path: Path2D): Path2D {
    path.rect(this.x, this.y, this.width, this.height)
    return path
  }
}