/**
 * TODO
 */
class Circle {
    /**
     * TODO
     * @param graphics
     * @param x
     * @param y
     * @param radius
     * @param color
     * @param stroke
     * @param lineWidth
     */
    constructor(graphics, x, y, radius = 10, fill = true, color = '#fff', stroke = false, lineWidth = 1) {
        this.graphics = graphics;
        this.point = new Vector(x, y);
        this.radius = radius;
        this.fill = fill;
        this.color = color;
        this.stroke = stroke;
        this.lineWidth = lineWidth;
    }
    /**
     * TODO
     */
    get x() {
        return this.point.x;
    }
    /**
     * TODO
     */
    get y() {
        return this.point.y;
    }
    /**
     * TODO
     */
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