class Circle {
    point;
    graphics;
    radius;
    fill;
    color;
    stroke;
    lineWidth;
    constructor(graphics, x, y, radius = 10, options = {}) {
        this.graphics = graphics;
        this.point = vec2.fromValues(x, y);
        this.radius = radius;
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
    draw() {
        if (!this.fill && !this.stroke)
            return;
        const ctx = this.graphics.ctx;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        if (this.fill) {
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        if (this.stroke) {
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.color;
            ctx.stroke();
        }
    }
}
//# sourceMappingURL=Circle.js.map