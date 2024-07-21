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
        this.point1 = vec2.fromValues(x1, y1);
        this.point2 = vec2.fromValues(x2, y2);
        this.point3 = vec2.fromValues(x3, y3);
        this.fill = options.fill == undefined ? true : options.fill;
        this.color = options.color || '#fff';
        this.stroke = options.stroke == undefined ? false : options.stroke;
        this.lineWidth = options.lineWidth || 1;
    }
    get x1() {
        return this.point1[0];
    }
    get y1() {
        return this.point1[1];
    }
    get x2() {
        return this.point2[0];
    }
    get y2() {
        return this.point2[1];
    }
    get x3() {
        return this.point3[0];
    }
    get y3() {
        return this.point3[1];
    }
    draw() {
        if (!this.fill && !this.stroke)
            return;
        const ctx = this.graphics.ctx;
        if (this.fill) {
            ctx.fillStyle = this.color;
            graphics.fillTriangle(ctx, this.point1, this.point2, this.point3);
        }
        if (this.stroke) {
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.color;
            graphics.strokeTriangle(ctx, this.point1, this.point2, this.point3);
        }
    }
}
//# sourceMappingURL=Triangle.js.map