class Polygon {
    graphics;
    points;
    fill;
    color;
    stroke;
    lineWidth;
    constructor(graphics, points, options = {}) {
        this.graphics = graphics;
        this.points = points;
        this.fill = options.fill == undefined ? true : options.fill;
        this.color = options.color || '#fff';
        this.stroke = options.stroke == undefined ? false : options.stroke;
        this.lineWidth = options.lineWidth || 1;
    }
    draw() {
        if (!this.fill && !this.stroke)
            return;
        const ctx = this.graphics.ctx;
        if (this.fill) {
            ctx.fillStyle = this.color;
            graphics.fillPolygon(ctx, this.points, this.points.length);
            ctx.fill();
        }
        if (this.stroke) {
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.color;
            graphics.strokePolygon(ctx, this.points, this.points.length);
        }
    }
}
//# sourceMappingURL=Polygon.js.map