class TriangleGraphics {
    point1;
    point2;
    point3;
    graphics;
    fill;
    color;
    stroke;
    lineWidth;
    constructor(graphics, x1, y1, x2, y2, x3, y3, options = {}) {
        this.graphics = graphics;
        this.point1 = new Vector(x1, y1);
        this.point2 = new Vector(x2, y2);
        this.point3 = new Vector(x3, y3);
        this.fill = options.fill == undefined ? true : options.fill;
        this.color = options.color || '#fff';
        this.stroke = options.stroke == undefined ? false : options.stroke;
        this.lineWidth = options.lineWidth || 1;
    }
    get x1() {
        return this.point1.x;
    }
    get y1() {
        return this.point1.y;
    }
    get x2() {
        return this.point2.x;
    }
    get y2() {
        return this.point2.y;
    }
    get x3() {
        return this.point3.x;
    }
    get y3() {
        return this.point3.y;
    }
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