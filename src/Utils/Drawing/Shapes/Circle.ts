class Circle implements HasPoint, Drawable {
  pos: Vec2
  graphics: Graphics
  radius: number
  fill: boolean
  color: string
  stroke: boolean
  lineWidth: number

  constructor(graphics: Graphics, x: number, y: number, radius: number = 10,
    options: CircleGraphicsOptions = {}) {
    this.graphics = graphics
    this.pos = vec2.fromValues(x, y)
    this.radius = radius
    this.fill = options.fill == undefined ? true : options.fill
    this.color = options.color || '#fff'
    this.stroke = options.stroke == undefined ? false : options.stroke
    this.lineWidth = options.lineWidth || 1
  }

  get x(): number {
    return this.pos[0]
  }

  get y(): number {
    return this.pos[1]
  }

  draw(): void {
    if (!this.fill && !this.stroke) return
    const ctx: CanvasRenderingContext2D = this.graphics.ctx
    if (this.fill) {
      ctx.fillStyle = this.color
      graphics.fillCircle(ctx, this.pos, this.radius)
    }
    if (this.stroke) {
      ctx.lineWidth = this.lineWidth
      ctx.strokeStyle = this.color
      graphics.strokeCircle(ctx, this.pos, this.radius)
    }
  }
}