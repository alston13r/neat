class Rectangle {
    point;
    size;
    graphics;
    fill;
    color;
    stroke;
    lineWidth;
    constructor(graphics, x, y, width, height, options = {}) {
        this.graphics = graphics;
        this.point = vec2.fromValues(x, y);
        this.size = vec2.fromValues(width, height);
        this.fill = options.fill == undefined ? true : options.fill;
        this.color = options.color || '#fff';
        this.stroke = options.stroke == undefined ? false : options.stroke;
        this.lineWidth = options.lineWidth || 1;
    }
    get x() {
        return this.point[0];
    }
    get y() {
        return this.point[1];
    }
    get width() {
        return this.size[0];
    }
    get height() {
        return this.size[1];
    }
    draw() {
        if (!this.fill && !this.stroke)
            return;
        const ctx = this.graphics.ctx;
        if (this.fill) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        if (this.stroke) {
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.color;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}
//# sourceMappingURL=Rectangle.js.map