/**
 * TODO
 */
class Graphics implements HasSize {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  /**
   * TODO
   * @param canvas 
   */
  constructor(canvas?: HTMLCanvasElement) {
    this.canvas = canvas || document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
  }

  /**
   * TODO
   * @param width 
   * @param height 
   * @returns 
   */
  setSize(width: number, height: number): Graphics {
    this.canvas.width = width
    this.canvas.height = height
    return this
  }

  /**
   * TODO
   * @param ele 
   * @returns 
   */
  appendTo(ele: HTMLElement): Graphics {
    ele.appendChild(this.canvas)
    return this
  }

  /**
   * TODO
   */
  get width(): number {
    return this.canvas.width
  }

  /**
   * TODO
   */
  get height(): number {
    return this.canvas.height
  }

  /**
   * TODO
   */
  get size(): Vector {
    return new Vector(this.width, this.height)
  }

  /**
   * TODO
   * @param x 
   * @param y 
   * @param radius 
   * @param fill 
   * @param color 
   * @param stroke 
   * @param lineWidth 
   * @returns 
   */
  createCircle(x: number, y: number, radius: number = 10, fill: boolean = true,
    color: string = '#fff', stroke: boolean = false, lineWidth: number = 1): Circle {
    return new Circle(this, x, y, radius, fill, color, stroke, lineWidth)
  }

  /**
   * TODO
   * @param x1 
   * @param y1 
   * @param x2 
   * @param y2 
   * @param color 
   * @param lineWidth 
   * @returns 
   */
  createLine(x1: number, y1: number, x2: number, y2: number, color = '#0f0', lineWidth = 1): Line {
    return new Line(this, x1, y1, x2, y2, color, lineWidth)
  }

  /**
   * TODO
   * @param x 
   * @param y 
   * @param width 
   * @param height 
   * @param fill 
   * @param color 
   * @param stroke 
   * @param lineWidth 
   * @returns 
   */
  createRectangle(x: number, y: number, width: number, height: number, fill: boolean = true,
    color: string = '#fff', stroke: boolean = false, lineWidth: number = 1): Rectangle {
    return new Rectangle(this, x, y, width, height, fill, color, stroke, lineWidth)
  }

  /**
   * TODO
   * @param x1 
   * @param y1 
   * @param x2 
   * @param y2 
   * @param x3 
   * @param y3 
   * @param fill 
   * @param color 
   * @param stroke 
   * @param lineWidth 
   * @returns 
   */
  createTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
    fill: boolean = true, color: string = '#fff', stroke: boolean = false, lineWidth: number = 1): Triangle {
    return new Triangle(this, x1, y1, x2, y2, x3, y3, fill, color, stroke, lineWidth)
  }

  /**
   * TODO
   * @param text 
   * @param x 
   * @param y 
   * @param color 
   * @param size 
   * @param align 
   * @param baseline 
   * @returns 
   */
  createText(text: string, x: number, y: number, color = '#fff', size = 10,
    align: CanvasTextDrawingStyles['textAlign'] = 'center',
    baseline: CanvasTextDrawingStyles['textBaseline'] = 'middle'): TextGraphics {
    return new TextGraphics(this, text, x, y, color, size, align, baseline)
  }

  /**
   * TODO
   * @param color
   */
  bg(color = '#000'): void {
    this.ctx.fillStyle = color
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  /**
   * TODO
   */
  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  /**
   * @param {number} x 
   * @param {number} y 
   * @param {TextGraphics[]} texts 
   * @param {string} c 
   * @param {number} s 
   * @param {TextGraphics} header 
   * @param {string} hc 
   * @param {number} hs 
   */
  listText(x, y, texts, c, s, header, hc, hs) {
    this.ctx.textAlign = 'left'
    this.ctx.textBaseline = 'top'
    if (header) {
      this.ctx.fillStyle = hc
      this.ctx.font = hs + 'px arial'
      this.ctx.fillText(header.text, header.x + x, header.y + y)
      y += hs
    }
    this.ctx.fillStyle = c
    this.ctx.font = s + 'px arial'
    for (let text of texts) {
      this.ctx.fillText(text.text, text.x + x, text.y + y)
    }
  }
}