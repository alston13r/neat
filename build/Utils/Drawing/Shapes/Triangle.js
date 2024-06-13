/**
 * TODO
 */
class Triangle {
    point1;
    point2;
    point3;
    graphics;
    fill;
    color;
    stroke;
    lineWidth;
    /**
     * TODO
     */
    constructor(graphics, x1, y1, x2, y2, x3, y3, fill = true, color = '#fff', stroke = false, lineWidth = 1) {
        this.graphics = graphics;
        this.point1 = new Vector(x1, y1);
        this.point2 = new Vector(x2, y2);
        this.point3 = new Vector(x3, y3);
        this.fill = fill;
        this.color = color;
        this.stroke = stroke;
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
    get x3() {
        return this.point3.x;
    }
    /**
     * TODO
     */
    get y3() {
        return this.point3.y;
    }
    /**
     * TODO
     */
    draw() {
        if (!this.fill && !this.stroke)
            return;
        const ctx = this.graphics.ctx;
        if (this.fill)
            ctx.fillStyle = this.color;
        if (this.stroke)
            ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.lineTo(this.x3, this.y3);
        ctx.closePath();
        if (this.fill)
            ctx.fill();
        if (this.stroke)
            ctx.stroke();
    }
}
//# sourceMappingURL=Triangle.js.map