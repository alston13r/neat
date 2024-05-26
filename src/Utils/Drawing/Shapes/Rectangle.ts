/**
 * TODO
 */
class Rectangle implements HasPoint, HasSize, Drawable {
  point: Vector
  size: Vector
  graphics: Graphics
  fill: boolean
  color: string
  stroke: boolean
  lineWidth: number

  /**
   * TODO
   * @param graphics 
   * @param x 
   * @param y 
   * @param width 
   * @param height 
   * @param fill 
   * @param color 
   * @param stroke 
   * @param lineWidth 
   */
  constructor(graphics: Graphics, x: number, y: number, width: number, height: number, fill: boolean = true,
    color: string = '#fff', stroke: boolean = false, lineWidth: number = 1) {
    this.graphics = graphics
    this.point = new Vector(x, y)
    this.size = new Vector(width, height)
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
  get width(): number {
    return this.size.x
  }

  /**
   * TODO
   */
  get height(): number {
    return this.size.y
  }

  /**
   * TODO
   */
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