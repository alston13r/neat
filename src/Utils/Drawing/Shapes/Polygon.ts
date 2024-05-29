class Polygon implements Drawable {
  graphics: Graphics
  points: Vector[]
  fill: boolean
  color: string
  stroke: boolean
  lineWidth: number

  constructor(graphics: Graphics, points: Vector[], fill: boolean = true,
    color: string = '#fff', stroke: boolean = false, lineWidth: number = 1) {
    this.graphics = graphics
    this.points = points
    this.fill = fill
    this.color = color
    this.stroke = stroke
    this.lineWidth = lineWidth
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