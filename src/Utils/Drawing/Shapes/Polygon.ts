class Polygon implements Drawable {
  graphics: Graphics
  points: Vector[]
  fill: boolean
  color: string
  stroke: boolean
  lineWidth: number

  constructor(graphics: Graphics, points: Vector[], options: PolygonGraphicsOptions = {}) {
    this.graphics = graphics
    this.points = points
    this.fill = options.fill == undefined ? true : options.fill
    this.color = options.color || '#fff'
    this.stroke = options.stroke == undefined ? false : options.stroke
    this.lineWidth = options.lineWidth || 1
  }

  draw(): void {
    if (!this.fill && !this.stroke) return
    const ctx: CanvasRenderingContext2D = this.graphics.ctx
    ctx.beginPath()
    for (let [i, p] of this.points.entries()) {
      if (i == 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    }
    this.graphics.ctx.closePath()
    if (this.fill) {
      ctx.fillStyle = this.color
      ctx.fill()
    }
    if (this.stroke) {
      ctx.lineWidth = this.lineWidth
      ctx.strokeStyle = this.color
      ctx.stroke()
    }
  }
}