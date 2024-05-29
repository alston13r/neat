/**
 * TODO
 */
class Circle implements HasPoint, Drawable {
  point: Vector
  graphics: Graphics
  radius: number
  fill: boolean
  color: string
  stroke: boolean
  lineWidth: number

  /**
   * TODO
   * @param graphics 
   * @param x 
   * @param y 
   * @param radius 
   * @param color 
   * @param stroke 
   * @param lineWidth 
   */
  constructor(graphics: Graphics, x: number, y: number, radius: number = 10, fill: boolean = true,
    color: string = '#fff', stroke: boolean = false, lineWidth: number = 1) {
    this.graphics = graphics
    this.point = new Vector(x, y)
    this.radius = radius
    this.fill = fill
    this.color = color
    this.stroke = stroke
    this.lineWidth = lineWidth
  }

  /**
   * TODO
   */
  get x(): number {
    return this.point.x
  }

  /**
   * TODO
   */
  get y(): number {
    return this.point.y
  }

  /**
   * TODO
   */
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