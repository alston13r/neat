/**
 * TODO
 */
class TextGraphics implements HasPoint, Drawable {
  point: Vector
  graphics: Graphics
  text: string
  color: string
  size: number
  align: CanvasTextDrawingStyles['textAlign']
  baseline: CanvasTextDrawingStyles['textBaseline']

  /**
   * TODO
   * @param graphics 
   * @param text 
   * @param x 
   * @param y 
   * @param color 
   * @param size 
   * @param align 
   * @param baseline 
   */
  constructor(graphics: Graphics, text: string, x: number, y: number, color = '#fff', size = 10,
    align: CanvasTextDrawingStyles['textAlign'] = 'center', baseline: CanvasTextDrawingStyles['textBaseline'] = 'middle') {
    this.graphics = graphics
    this.text = text
    this.point = new Vector(x, y)
    this.text = text
    this.color = color
    this.size = size
    this.align = align
    this.baseline = baseline
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
  draw() {
    const ctx: CanvasRenderingContext2D = this.graphics.ctx
    ctx.fillStyle = this.color
    ctx.textAlign = this.align
    ctx.textBaseline = this.baseline
    ctx.font = this.size + 'px arial'
    ctx.fillText(this.text, this.x, this.y)
  }
}