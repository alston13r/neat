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
        ctx.beginPath();
        for (let [i, p] of this.points.entries()) {
            if (i == 0)
                ctx.moveTo(p[0], p[1]);
            else
                ctx.lineTo(p[0], p[1]);
        }
        this.graphics.ctx.closePath();
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
//# sourceMappingURL=Polygon.js.map