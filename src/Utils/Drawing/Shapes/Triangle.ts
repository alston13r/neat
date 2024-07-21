class TriangleGraphics implements HasThreePoints, Drawable {
  point1: Vec2
  point2: Vec2
  point3: Vec2
  graphics: Graphics
  fill: boolean
  color: string
  stroke: boolean
  lineWidth: number

  constructor(graphics: Graphics, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
    options: TriangleGraphicsOptions = {}) {
    this.graphics = graphics
    this.point1 = vec2.fromValues(x1, y1)
    this.point2 = vec2.fromValues(x2, y2)
    this.point3 = vec2.fromValues(x3, y3)
    this.fill = options.fill == undefined ? true : options.fill
    this.color = options.color || '#fff'
    this.stroke = options.stroke == undefined ? false : options.stroke
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

  get x3(): number {
    return this.point3[0]
  }

  get y3(): number {
    return this.point3[1]
  }

  draw(): void {
    if (!this.fill && !this.stroke) return
    const ctx: CanvasRenderingContext2D = this.graphics.ctx
    if (this.fill) {
      ctx.fillStyle = this.color
      graphics.fillTriangle(ctx, this.point1, this.point2, this.point3)
    }
    if (this.stroke) {
      ctx.lineWidth = this.lineWidth
      ctx.strokeStyle = this.color
      graphics.strokeTriangle(ctx, this.point1, this.point2, this.point3)
    }
  }
}