class Polygon implements Drawable {
  graphics: Graphics
  points: Vec2[]
  fill: boolean
  color: string
  stroke: boolean
  lineWidth: number

  constructor(graphics: Graphics, points: Vec2[], options: PolygonGraphicsOptions = {}) {
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
    if (this.fill) {
      ctx.fillStyle = this.color
      graphics.fillPolygon(ctx, this.points, this.points.length)
      ctx.fill()
    }
    if (this.stroke) {
      ctx.lineWidth = this.lineWidth
      ctx.strokeStyle = this.color
      graphics.strokePolygon(ctx, this.points, this.points.length)
    }
  }
}