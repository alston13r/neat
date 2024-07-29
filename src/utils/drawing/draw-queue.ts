class DrawQueue {
  graphics: Graphics
  color: string | CanvasGradient | CanvasPattern
  fill: boolean
  stroke: boolean
  lineWidth: number

  path = new Path2D()

  constructor(graphics: Graphics, color: string | CanvasGradient | CanvasPattern,
    fill = true, stroke = false, lineWidth = 1) {
    this.graphics = graphics
    this.color = color
    this.fill = fill
    this.stroke = stroke
    this.lineWidth = lineWidth
  }

  dispatch(): Path2D {
    if (this.fill) {
      this.graphics.fillStyle = this.color
      this.graphics.fill(this.path)
    }
    if (this.stroke) {
      this.graphics.lineWidth = this.lineWidth
      this.graphics.strokeStyle = this.color
      this.graphics.stroke(this.path)
    }
    this.path = new Path2D()
    return this.path
  }
}