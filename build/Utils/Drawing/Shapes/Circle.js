class Circle {
    pos;
    graphics;
    radius;
    fill;
    color;
    stroke;
    lineWidth;
    constructor(graphics, x, y, radius = 10, options = {}) {
        this.graphics = graphics;
        this.pos = vec2.fromValues(x, y);
        this.radius = radius;
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
    draw() {
        if (!this.fill && !this.stroke)
            return;
        const ctx = this.graphics.ctx;
        if (this.fill) {
            ctx.fillStyle = this.color;
            graphics.fillCircle(ctx, this.pos, this.radius);
        }
        if (this.stroke) {
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.color;
            graphics.strokeCircle(ctx, this.pos, this.radius);
        }
    }
}
//# sourceMappingURL=Circle.js.map