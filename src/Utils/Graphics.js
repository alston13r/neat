class Graphics {
  /**
   * @param {HTMLCanvasElement} x 
   */
  constructor(x) {
    this.canvas = x || document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
  }

  /**
   * @param {number} w 
   * @param {number} h 
   * @returns {Graphics}
   */
  setSize(w, h) {
    this.canvas.width = w
    this.canvas.height = h
    return this
  }

  /**
   * @param {HTMLElement} ele 
   * @returns {Graphics}
   */
  appendTo(ele) {
    ele.appendChild(this.canvas)
    return this
  }

  /**
   * @returns {number}
   */
  get width() {
    return this.canvas.width
  }

  /**
   * @returns {number}
   */
  get height() {
    return this.canvas.height
  }

  get size() {
    return new Vector(this.width, this.height)
  }

  /**
   * @param {string} c 
   */
  bg(c = '#000') {
    this.ctx.fillStyle = c
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  /**
   * @param {number} x 
   * @param {number} y 
   * @param {number} r 
   * @param {string} c 
   */
  circle(x, y, r, c, stroke, lineWidth) {
    this.ctx.fillStyle = c
    this.ctx.strokeStyle = c
    this.ctx.lineWidth = lineWidth
    this.ctx.beginPath()
    this.ctx.arc(x, y, r, 0, 2 * Math.PI)
    if (!stroke) this.ctx.fill()
    else this.ctx.stroke()
  }

  /**
   * @param {string} text 
   * @param {number} x 
   * @param {number} y 
   * @param {string} c 
   * @param {number} s 
   */
  text(text, x, y, c, s, align, baseline) {
    this.ctx.fillStyle = c
    this.ctx.textAlign = align
    this.ctx.textBaseline = baseline
    this.ctx.font = s + 'px arial'
    this.ctx.fillText(text, x, y)
  }

  /**
   * @param {number} x 
   * @param {number} y 
   * @param {GraphicsText[]} texts 
   * @param {string} c 
   * @param {number} s 
   * @param {GraphicsText} header 
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

  /**
   * @param {number} x1 
   * @param {number} y1 
   * @param {number} x2 
   * @param {number} y2 
   * @param {string} c 
   * @param {number} w 
   */
  line(x1, y1, x2, y2, color, lineWidth) {
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = lineWidth
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.stroke()
  }

  /**
   * @param {number} x 
   * @param {number} y 
   * @param {number} w 
   * @param {number} h 
   * @param {string} c 
   */
  rect(x, y, w, h, c = '#fff') {
    this.ctx.fillStyle = c
    this.ctx.fillRect(x, y, w, h)
  }

  /**
   * @param {number} x 
   * @param {number} y 
   */
  debugRect(x, y, c = '#f00') {
    this.rect(x - 1.5, y - 1.5, 3, 3, c)
  }

  /**
   * @param {number} x1 
   * @param {number} y1 
   * @param {number} x2 
   * @param {number} y2 
   * @param {number} x3 
   * @param {number} y3 
   * @param {string} c 
   * @param {boolean} fill 
   * @param {boolean} stroke 
   * @param {number} w 
   * @returns 
   */
  triangle(x1, y1, x2, y2, x3, y3, c = '#fff', fill = true, stroke = false, w = 1) {
    if (!fill && !stroke) return
    if (fill) this.ctx.fillStyle = c
    if (stroke) this.ctx.strokeStyle = c
    this.ctx.lineWidth = w
    this.ctx.beginPath()
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.lineTo(x3, y3)
    this.ctx.closePath()
    if (fill) this.ctx.fill()
    if (stroke) this.ctx.stroke()
  }
}