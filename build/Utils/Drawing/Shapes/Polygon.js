class Polygon {
    constructor(graphics, points, fill = true, color = '#fff', stroke = false, lineWidth = 1) {
        this.graphics = graphics;
        this.points = points;
        this.fill = fill;
        this.color = color;
        this.stroke = stroke;
        this.lineWidth = lineWidth;
    }
    draw() {
        if (!this.fill && !this.stroke)
            return;
        const ctx = this.graphics.ctx;
        ctx.beginPath();
        for (let [i, p] of this.points.entries()) {
            if (i == 0)
                ctx.moveTo(p.x, p.y);
            else
                ctx.lineTo(p.x, p.y);
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