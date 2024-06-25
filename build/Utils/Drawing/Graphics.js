//TODO
class Graphics {
    canvas;
    ctx;
    //TODO
    constructor(canvas) {
        this.canvas = canvas || document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }
    //TODO
    setSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        return this;
    }
    //TODO
    appendTo(ele) {
        ele.appendChild(this.canvas);
        return this;
    }
    //TODO
    appendToBody() {
        return this.appendTo(document.body);
    }
    //TODO
    get width() {
        return this.canvas.width;
    }
    //TODO
    get height() {
        return this.canvas.height;
    }
    //TODO
    get size() {
        return new Vector(this.width, this.height);
    }
    //TODO
    createCircle(x, y, radius = 10, fill = true, color = '#fff', stroke = false, lineWidth = 1) {
        return new Circle(this, x, y, radius, fill, color, stroke, lineWidth);
    }
    //TODO
    createLine(x1, y1, x2, y2, color = '#0f0', lineWidth = 1) {
        return new Line(this, x1, y1, x2, y2, color, lineWidth);
    }
    //TODO
    createRectangle(x, y, width, height, fill = true, color = '#fff', stroke = false, lineWidth = 1) {
        return new Rectangle(this, x, y, width, height, fill, color, stroke, lineWidth);
    }
    //TODO
    createTriangle(x1, y1, x2, y2, x3, y3, fill = true, color = '#fff', stroke = false, lineWidth = 1) {
        return new Triangle(this, x1, y1, x2, y2, x3, y3, fill, color, stroke, lineWidth);
    }
    //TODO
    createPolygon(points, fill = true, color = '#fff', stroke = false, lineWidth = 1) {
        return new Polygon(this, points, fill, color, stroke, lineWidth);
    }
    //TODO
    createText(text, x, y, color = '#fff', size = 10, align = 'center', baseline = 'middle') {
        return new TextGraphics(this, text, x, y, color, size, align, baseline);
    }
    //TODO
    bg(color = '#000') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    //TODO
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
//# sourceMappingURL=Graphics.js.map