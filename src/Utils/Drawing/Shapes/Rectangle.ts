class Rectangle implements HasPoint, HasSize, Drawable {
  point: Vec2
  size: Vec2
  graphics: Graphics
  fill: boolean
  color: string
  stroke: boolean
  lineWidth: number

  constructor(graphics: Graphics, x: number, y: number, width: number, height: number,
    options: RectangleGraphicsOptions = {}) {
    this.graphics = graphics
    this.point = vec2.fromValues(x, y)
    this.size = vec2.fromValues(width, height)
    this.fill = options.fill == undefined ? true : options.fill
    this.color = options.color || '#fff'
    this.stroke = options.stroke == undefined ? false : options.stroke
    this.lineWidth = options.lineWidth || 1
  }

  get x(): number {
    return this.point[0]
  }

  get y(): number {
    return this.point[1]
  }

  get width(): number {
    return this.size[0]
  }

  get height(): number {
    return this.size[1]
  }

  draw(): void {
    if (!this.fill && !this.stroke) return
    const ctx: CanvasRenderingContext2D = this.graphics.ctx
    if (this.fill) {
      ctx.fillStyle = this.color
      ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    if (this.stroke) {
      ctx.lineWidth = this.lineWidth
      ctx.strokeStyle = this.color
      ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
  }
}