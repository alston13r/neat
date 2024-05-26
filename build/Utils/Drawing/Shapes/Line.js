/**
 * TODO
 */
class Line {
    /**
     * TODO
     * @param graphics
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @param color
     * @param lineWidth
     */
    constructor(graphics, x1, y1, x2, y2, color = '#0f0', lineWidth = 1) {
        this.graphics = graphics;
        this.point1 = new Vector(x1, y1);
        this.point2 = new Vector(x2, y2);
        this.color = color;
        this.lineWidth = lineWidth;
    }
    /**
     * TODO
     */
    get x1() {
        return this.point1.x;
    }
    /**
     * TODO
     */
    get y1() {
        return this.point1.y;
    }
    /**
     * TODO
     */
    get x2() {
        return this.point2.x;
    }
    /**
     * TODO
     */
    get y2() {
        return this.point2.y;
    }
    /**
     * TODO
     */
    draw() {
        const ctx = this.graphics.ctx;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }
}
//# sourceMappingURL=Line.js.map