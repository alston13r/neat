class TriangleGraphics implements HasThreePoints, Drawable {
  point1: Vector
  point2: Vector
  point3: Vector
  graphics: Graphics
  fill: boolean
  color: string
  stroke: boolean
  lineWidth: number

  constructor(graphics: Graphics, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
    options: TriangleGraphicsOptions = {}) {
    this.graphics = graphics
    this.point1 = new Vector(x1, y1)
    this.point2 = new Vector(x2, y2)
    this.point3 = new Vector(x3, y3)
    this.fill = options.fill == undefined ? true : options.fill
    this.color = options.color || '#fff'
    this.stroke = options.stroke == undefined ? false : options.stroke
    this.lineWidth = options.lineWidth || 1
  }

  get x1(): number {
    return this.point1.x
  }

  get y1(): number {
    return this.point1.y
  }

  get x2(): number {
    return this.point2.x
  }

  get y2(): number {
    return this.point2.y
  }

  get x3(): number {
    return this.point3.x
  }

  get y3(): number {
    return this.point3.y
  }

  draw(): void {
    if (!this.fill && !this.stroke) return
    const ctx: CanvasRenderingContext2D = this.graphics.ctx
    if (this.fill) ctx.fillStyle = this.color
    if (this.stroke) ctx.strokeStyle = this.color
    ctx.lineWidth = this.lineWidth
    ctx.beginPath()
    ctx.moveTo(this.x1, this.y1)
    ctx.lineTo(this.x2, this.y2)
    ctx.lineTo(this.x3, this.y3)
    ctx.closePath()
    if (this.fill) ctx.fill()
    if (this.stroke) ctx.stroke()
  }
}