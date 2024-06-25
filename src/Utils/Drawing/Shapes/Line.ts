class Line implements HasTwoPoints, Drawable {
  point1: Vector
  point2: Vector
  graphics: Graphics
  color: string
  lineWidth: number

  constructor(graphics: Graphics, x1: number, y1: number, x2: number, y2: number,
    options: LineGraphicsOptions = {}) {
    this.graphics = graphics
    this.point1 = new Vector(x1, y1)
    this.point2 = new Vector(x2, y2)
    this.color = options.color || '#0f0'
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

  draw(): void {
    const ctx: CanvasRenderingContext2D = this.graphics.ctx
    ctx.strokeStyle = this.color
    ctx.lineWidth = this.lineWidth
    ctx.beginPath()
    ctx.moveTo(this.x1, this.y1)
    ctx.lineTo(this.x2, this.y2)
    ctx.stroke()
  }
}