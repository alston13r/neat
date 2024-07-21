class Line implements HasTwoPoints, Drawable {
  point1: Vec2
  point2: Vec2
  graphics: Graphics
  color: string
  lineWidth: number

  constructor(graphics: Graphics, x1: number, y1: number, x2: number, y2: number,
    options: LineGraphicsOptions = {}) {
    this.graphics = graphics
    this.point1 = vec2.fromValues(x1, y1)
    this.point2 = vec2.fromValues(x2, y2)
    this.color = options.color || '#0f0'
    this.lineWidth = options.lineWidth || 1
  }

  get x1(): number {
    return this.point1[0]
  }

  get y1(): number {
    return this.point1[1]
  }

  get x2(): number {
    return this.point2[0]
  }

  get y2(): number {
    return this.point2[1]
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