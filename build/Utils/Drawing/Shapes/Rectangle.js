/**
 * TODO
 */
class Rectangle {
    /**
     * TODO
     * @param graphics
     * @param x
     * @param y
     * @param width
     * @param height
     * @param fill
     * @param color
     * @param stroke
     * @param lineWidth
     */
    constructor(graphics, x, y, width, height, fill = true, color = '#fff', stroke = false, lineWidth = 1) {
        this.graphics = graphics;
        this.point = new Vector(x, y);
        this.size = new Vector(width, height);
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
    get width() {
        return this.size.x;
    }
    /**
     * TODO
     */
    get height() {
        return this.size.y;
    }
    /**
     * TODO
     */
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