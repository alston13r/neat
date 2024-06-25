class Circle implements HasPoint, Drawable {
  point: Vector
  graphics: Graphics
  radius: number
  fill: boolean
  color: string
  stroke: boolean
  lineWidth: number

  constructor(graphics: Graphics, x: number, y: number, radius: number = 10,
    options: CircleGraphicsOptions = {}) {
    this.graphics = graphics
    this.point = new Vector(x, y)
    this.radius = radius
    this.fill = options.fill == undefined ? true : options.fill
    this.color = options.color || '#fff'
    this.stroke = options.stroke == undefined ? false : options.stroke
    this.lineWidth = options.lineWidth || 1
  }

  get x(): number {
    return this.point.x
  }

  get y(): number {
    return this.point.y
  }

  draw(): void {
    if (!this.fill && !this.stroke) return
    const ctx: CanvasRenderingContext2D = this.graphics.ctx
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
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