class TextGraphics implements HasPoint, Drawable {
  point: Vec2
  graphics: Graphics
  text: string
  color: string
  size: number
  align: CanvasTextDrawingStyles['textAlign']
  baseline: CanvasTextDrawingStyles['textBaseline']

  constructor(graphics: Graphics, text: string, x: number, y: number, options: TextGraphicsOptions = {}) {
    this.graphics = graphics
    this.text = text
    this.point = vec2.fromValues(x, y)
    this.text = text
    this.color = options.color || '#fff'
    this.size = options.size || 10
    this.align = options.align || 'left'
    this.baseline = options.baseline || 'top'
  }

  get x(): number {
    return this.point[0]
  }

  get y(): number {
    return this.point[1]
  }

  draw(): void {
    const ctx: CanvasRenderingContext2D = this.graphics.ctx
    ctx.fillStyle = this.color
    ctx.textAlign = this.align
    ctx.textBaseline = this.baseline
    ctx.font = this.size + 'px arial'
    ctx.fillText(this.text, this.x, this.y)
  }
}