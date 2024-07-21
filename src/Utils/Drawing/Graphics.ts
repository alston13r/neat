const graphics = {
  createCanvas(): HTMLCanvasElement {
    return document.createElement('canvas')
  },

  setSize(canvas: HTMLCanvasElement, size: ReadonlyVec2): HTMLCanvasElement {
    canvas.width = size[0]
    canvas.height = size[1]
    return canvas
  },

  getSize(canvas: HTMLCanvasElement): ReadonlyVec2 {
    return vec2.fromValues(canvas.width, canvas.height)
  },

  line(context: CanvasRenderingContext2D, pos1: ReadonlyVec2, pos2: ReadonlyVec2) {
    context.beginPath()
    context.moveTo(pos1[0], pos1[1])
    context.lineTo(pos2[0], pos2[1])
    context.stroke()
  },

  strokeCircle(context: CanvasRenderingContext2D, pos: ReadonlyVec2, radius: number) {
    context.beginPath()
    context.ellipse(pos[0], pos[1], radius, radius, 0, 0, TwoPi)
    context.stroke()
  },

  fillCircle(context: CanvasRenderingContext2D, pos: ReadonlyVec2, radius: number) {
    context.beginPath()
    context.ellipse(pos[0], pos[1], radius, radius, 0, 0, TwoPi)
    context.fill()
  },

  strokeRect(context: CanvasRenderingContext2D, pos: ReadonlyVec2, size: ReadonlyVec2) {
    context.strokeRect(pos[0], pos[1], size[0], size[1])
  },

  fillRect(context: CanvasRenderingContext2D, pos: ReadonlyVec2, size: ReadonlyVec2) {
    context.fillRect(pos[0], pos[1], size[0], size[1])
  },

  strokeTriangle(context: CanvasRenderingContext2D, pos1: ReadonlyVec2, pos2: ReadonlyVec2, pos3: ReadonlyVec2) {
    context.beginPath()
    context.moveTo(pos1[0], pos1[1])
    context.lineTo(pos2[0], pos2[1])
    context.lineTo(pos3[0], pos3[1])
    context.closePath()
    context.stroke()
  },

  fillTriangle(context: CanvasRenderingContext2D, pos1: ReadonlyVec2, pos2: ReadonlyVec2, pos3: ReadonlyVec2) {
    context.beginPath()
    context.moveTo(pos1[0], pos1[1])
    context.lineTo(pos2[0], pos2[1])
    context.lineTo(pos3[0], pos3[1])
    context.closePath()
    context.fill()
  },

  strokePolygon(context: CanvasRenderingContext2D, points: ReadonlyVec2[], nPoints: number) {
    if (nPoints <= 1) return
    if (nPoints == 2) {
      graphics.line(context, points[0], points[1])
    } else {
      context.beginPath()
      for (let i = 0; i < nPoints; i++) {
        const point = points[i]
        if (i == 0) context.moveTo(point[0], point[1])
        else context.lineTo(point[0], point[1])
      }
      context.closePath()
      context.stroke()
    }
  },

  fillPolygon(context: CanvasRenderingContext2D, points: ReadonlyVec2[], nPoints: number) {
    if (nPoints <= 1) return
    if (nPoints == 2) {
      graphics.line(context, points[0], points[1])
    } else {
      context.beginPath()
      for (let i = 0; i < nPoints; i++) {
        const point = points[i]
        if (i == 0) context.moveTo(point[0], point[1])
        else context.lineTo(point[0], point[1])
      }
      context.closePath()
      context.fill()
    }
  },

  strokeText(context: CanvasRenderingContext2D, text: string, pos: ReadonlyVec2) {
    context.strokeText(text, pos[0], pos[1])
  },

  fillText(context: CanvasRenderingContext2D, text: string, pos: ReadonlyVec2) {
    context.fillText(text, pos[0], pos[1])
  },

  clearRect(context: CanvasRenderingContext2D, pos: ReadonlyVec2, size: ReadonlyVec2): void {
    context.clearRect(pos[0], pos[1], size[0], size[1])
  }
}

class Graphics {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  constructor(canvas?: HTMLCanvasElement) {
    this.canvas = canvas || graphics.createCanvas()
    this.ctx = this.canvas.getContext('2d')
  }

  setSize(width: number, height: number): Graphics {
    graphics.setSize(this.canvas, vec2.fromValues(width, height))
    return this
  }

  appendTo(ele: HTMLElement): Graphics {
    ele.appendChild(this.canvas)
    return this
  }

  appendToBody(): Graphics {
    document.body.appendChild(this.canvas)
    return this
  }

  get width(): number {
    return this.canvas.width
  }

  get height(): number {
    return this.canvas.height
  }

  get size(): Vec2 {
    return graphics.getSize(this.canvas)
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