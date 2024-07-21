class Rectangle {
    pos;
    size;
    graphics;
    fill;
    color;
    stroke;
    lineWidth;
    constructor(graphics, x, y, width, height, options = {}) {
        this.graphics = graphics;
        this.pos = vec2.fromValues(x, y);
        this.size = vec2.fromValues(width, height);
        this.fill = options.fill == undefined ? true : options.fill;
        this.color = options.color || '#fff';
        this.stroke = options.stroke == undefined ? false : options.stroke;
        this.lineWidth = options.lineWidth || 1;
    }
    get x() {
        return this.pos[0];
    }
    get y() {
        return this.pos[1];
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
            graphics.fillRect(ctx, this.pos, this.size);
        }
        if (this.stroke) {
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.color;
            graphics.strokeRect(ctx, this.pos, this.size);
        }
    }
}
//# sourceMappingURL=Rectangle.js.map