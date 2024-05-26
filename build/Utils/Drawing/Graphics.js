/**
 * TODO
 */
class Graphics {
    /**
     * TODO
     * @param canvas
     */
    constructor(canvas) {
        this.canvas = canvas || document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }
    /**
     * TODO
     * @param width
     * @param height
     * @returns
     */
    setSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        return this;
    }
    /**
     * TODO
     * @param ele
     * @returns
     */
    appendTo(ele) {
        ele.appendChild(this.canvas);
        return this;
    }
    /**
     * TODO
     */
    get width() {
        return this.canvas.width;
    }
    /**
     * TODO
     */
    get height() {
        return this.canvas.height;
    }
    /**
     * TODO
     */
    get size() {
        return new Vector(this.width, this.height);
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
    createCircle(x, y, radius = 10, fill = true, color = '#fff', stroke = false, lineWidth = 1) {
        return new Circle(this, x, y, radius, fill, color, stroke, lineWidth);
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
    createLine(x1, y1, x2, y2, color = '#0f0', lineWidth = 1) {
        return new Line(this, x1, y1, x2, y2, color, lineWidth);
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
    createRectangle(x, y, width, height, fill = true, color = '#fff', stroke = false, lineWidth = 1) {
        return new Rectangle(this, x, y, width, height, fill, color, stroke, lineWidth);
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
    createTriangle(x1, y1, x2, y2, x3, y3, fill = true, color = '#fff', stroke = false, lineWidth = 1) {
        return new Triangle(this, x1, y1, x2, y2, x3, y3, fill, color, stroke, lineWidth);
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
    createText(text, x, y, color = '#fff', size = 10, align = 'center', baseline = 'middle') {
        return new TextGraphics(this, text, x, y, color, size, align, baseline);
    }
    /**
     * TODO
     * @param color
     */
    bg(color = '#000') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    /**
     * TODO
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        if (header) {
            this.ctx.fillStyle = hc;
            this.ctx.font = hs + 'px arial';
            this.ctx.fillText(header.text, header.x + x, header.y + y);
            y += hs;
        }
        this.ctx.fillStyle = c;
        this.ctx.font = s + 'px arial';
        for (let text of texts) {
            this.ctx.fillText(text.text, text.x + x, text.y + y);
        }
    }
}
//# sourceMappingURL=Graphics.js.map