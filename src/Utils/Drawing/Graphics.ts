//TODO
class Graphics implements HasSize {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  //TODO
  constructor(canvas?: HTMLCanvasElement) {
    this.canvas = canvas || document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
  }

  //TODO
  setSize(width: number, height: number): Graphics {
    this.canvas.width = width
    this.canvas.height = height
    return this
  }

  //TODO
  appendTo(ele: HTMLElement): Graphics {
    ele.appendChild(this.canvas)
    return this
  }

  //TODO
  appendToBody(): Graphics {
    return this.appendTo(document.body)
  }

  //TODO
  get width(): number {
    return this.canvas.width
  }

  //TODO
  get height(): number {
    return this.canvas.height
  }

  //TODO
  get size(): Vector {
    return new Vector(this.width, this.height)
  }

  //TODO
  createCircle(x: number, y: number, radius: number = 10, fill: boolean = true,
    color: string = '#fff', stroke: boolean = false, lineWidth: number = 1): Circle {
    return new Circle(this, x, y, radius, fill, color, stroke, lineWidth)
  }

  //TODO
  createLine(x1: number, y1: number, x2: number, y2: number, color = '#0f0', lineWidth = 1): Line {
    return new Line(this, x1, y1, x2, y2, color, lineWidth)
  }

  //TODO
  createRectangle(x: number, y: number, width: number, height: number, fill: boolean = true,
    color: string = '#fff', stroke: boolean = false, lineWidth: number = 1): Rectangle {
    return new Rectangle(this, x, y, width, height, fill, color, stroke, lineWidth)
  }

  //TODO
  createTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
    fill: boolean = true, color: string = '#fff', stroke: boolean = false, lineWidth: number = 1): Triangle {
    return new Triangle(this, x1, y1, x2, y2, x3, y3, fill, color, stroke, lineWidth)
  }

  //TODO
  createPolygon(points: Vector[], fill: boolean = true, color: string = '#fff',
    stroke: boolean = false, lineWidth: number = 1): Polygon {
    return new Polygon(this, points, fill, color, stroke, lineWidth)
  }

  //TODO
  createText(text: string, x: number, y: number, options: TextGraphicsOptions = {}): TextGraphics {
    options.color ||= '#fff'
    options.size ||= 10
    options.align ||= 'left'
    options.baseline ||= 'top'
    return new TextGraphics(this, text, x, y, options.color, options.size, options.align, options.baseline)
  }

  //TODO
  bg(color = '#000'): void {
    this.ctx.fillStyle = color
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  //TODO
  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}