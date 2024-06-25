class Graphics {
    canvas;
    ctx;
    constructor(canvas) {
        this.canvas = canvas || document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }
    setSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        return this;
    }
    appendTo(ele) {
        ele.appendChild(this.canvas);
        return this;
    }
    appendToBody() {
        return this.appendTo(document.body);
    }
    get width() {
        return this.canvas.width;
    }
    get height() {
        return this.canvas.height;
    }
    get size() {
        return new Vector(this.width, this.height);
    }
    createCircle(x, y, radius = 10, options) {
        return new Circle(this, x, y, radius, options);
    }
    createLine(x1, y1, x2, y2, options) {
        return new Line(this, x1, y1, x2, y2, options);
    }
    createRectangle(x, y, width, height, options) {
        return new Rectangle(this, x, y, width, height, options);
    }
    createTriangle(x1, y1, x2, y2, x3, y3, options) {
        return new TriangleGraphics(this, x1, y1, x2, y2, x3, y3, options);
    }
    createPolygon(points, options) {
        return new Polygon(this, points, options);
    }
    createText(text, x, y, options) {
        return new TextGraphics(this, text, x, y, options);
    }
    bg(color = '#000') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
//# sourceMappingURL=Graphics.js.map