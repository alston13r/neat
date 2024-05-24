class HasPoint {
  constructor(x, y) {
    this.point = new Vector(x, y)
  }
}

class GraphicsCircle extends HasPoint {
  /**
   * @param {Graphics} graphics
   * @param {number} x 
   * @param {number} y 
   * @param {number} r 
   */
  constructor(graphics, x, y, r = 10, color = '#fff', stroke = false, lineWidth = 1) {
    super(x, y)
    this.graphics = graphics
    this.r = r
    this.color = color
    this.stroke = stroke
    this.lineWidth = lineWidth
  }

  draw() {
    this.graphics.circle(...this.point, this.r, this.color, this.stroke, this.lineWidth)
  }
}

class GraphicsText extends HasPoint {
  /**
   * @param {Graphics} graphics
   * @param {string} text 
   * @param {number} x 
   * @param {number} y 
   */
  constructor(graphics, text, x, y, color = '#fff', size = 10, align = 'center', baseline = 'middle') {
    super(x, y)
    this.graphics = graphics
    this.text = text
    this.color = color
    this.size = size
    this.align = align
    this.baseline = baseline
  }

  draw() {
    this.graphics.text(this.text, ...this.point, this.color, this.size, this.align, this.baseline)
  }
}

class Line {
  constructor(graphics, x1, y1, x2, y2, color = '#0f0', lineWidth = 1) {
    this.graphics = graphics
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
    this.color = color
    this.lineWidth = lineWidth
  }

  get p1() {
    return new Vector(this.x1, this.y1)
  }

  get p2() {
    return new Vector(this.x2, this.y2)
  }

  draw() {
    this.graphics.line(...this.p1, ...this.p2, this.color, this.lineWidth)
  }
}