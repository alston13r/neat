/**
 * TODO
 */
class Line implements HasTwoPoints, Drawable {
  point1: Vector
  point2: Vector
  graphics: Graphics
  color: string
  lineWidth: number

  /**
   * TODO
   * @param graphics 
   * @param x1 
   * @param y1 
   * @param x2 
   * @param y2 
   * @param color 
   * @param lineWidth 
   */
  constructor(graphics: Graphics, x1: number, y1: number, x2: number, y2: number, color = '#0f0', lineWidth = 1) {
    this.graphics = graphics
    this.point1 = new Vector(x1, y1)
    this.point2 = new Vector(x2, y2)
    this.color = color
    this.lineWidth = lineWidth
  }

  /**
   * TODO
   */
  get x1(): number {
    return this.point1.x
  }

  /**
   * TODO
   */
  get y1(): number {
    return this.point1.y
  }

  /**
   * TODO
   */
  get x2(): number {
    return this.point2.x
  }

  /**
   * TODO
   */
  get y2(): number {
    return this.point2.y
  }

  /**
   * TODO
   */
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