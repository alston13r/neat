class Graphics implements HasSize {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  constructor(canvas?: HTMLCanvasElement) {
    this.canvas = canvas || document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
  }

  setSize(width: number, height: number): Graphics {
    this.canvas.width = width
    this.canvas.height = height
    return this
  }

  appendTo(ele: HTMLElement): Graphics {
    ele.appendChild(this.canvas)
    return this
  }

  appendToBody(): Graphics {
    return this.appendTo(document.body)
  }

  get width(): number {
    return this.canvas.width
  }

  get height(): number {
    return this.canvas.height
  }

  get size(): Vec2 {
    return vec2.fromValues(this.width, this.height)
  }

  createCircle(x: number, y: number, radius: number = 10, options?: CircleGraphicsOptions): Circle {
    return new Circle(this, x, y, radius, options)
  }

  createLine(x1: number, y1: number, x2: number, y2: number, options?: LineGraphicsOptions): Line {
    return new Line(this, x1, y1, x2, y2, options)
  }

  createRectangle(x: number, y: number, width: number, height: number,
    options?: RectangleGraphicsOptions): Rectangle {
    return new Rectangle(this, x, y, width, height, options)
  }

  createTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number,
    options?: TriangleGraphicsOptions): TriangleGraphics {
    return new TriangleGraphics(this, x1, y1, x2, y2, x3, y3, options)
  }

  createPolygon(points: Vec2[], options?: PolygonGraphicsOptions): Polygon {
    return new Polygon(this, points, options)
  }

  createText(text: string, x: number, y: number, options?: TextGraphicsOptions): TextGraphics {
    return new TextGraphics(this, text, x, y, options)
  }

  bg(color = '#000'): void {
    this.ctx.fillStyle = color
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}