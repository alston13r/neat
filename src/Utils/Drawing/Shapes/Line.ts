class Line implements HasTwoPoints, Drawable {
  pos1: Vec2
  pos2: Vec2
  graphics: Graphics
  color: string
  lineWidth: number

  constructor(graphics: Graphics, x1: number, y1: number, x2: number, y2: number,
    options: LineGraphicsOptions = {}) {
    this.graphics = graphics
    this.pos1 = vec2.fromValues(x1, y1)
    this.pos2 = vec2.fromValues(x2, y2)
    this.color = options.color || '#0f0'
    this.lineWidth = options.lineWidth || 1
  }

  get x1(): number {
    return this.pos1[0]
  }

  get y1(): number {
    return this.pos1[1]
  }

  get x2(): number {
    return this.pos2[0]
  }

  get y2(): number {
    return this.pos2[1]
  }

  draw(): void {
    const ctx: CanvasRenderingContext2D = this.graphics.ctx
    ctx.strokeStyle = this.color
    ctx.lineWidth = this.lineWidth
    graphics.line(ctx, this.pos1, this.pos2)
  }
}