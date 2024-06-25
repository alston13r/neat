class Line {
    point1;
    point2;
    graphics;
    color;
    lineWidth;
    constructor(graphics, x1, y1, x2, y2, options = {}) {
        this.graphics = graphics;
        this.point1 = new Vector(x1, y1);
        this.point2 = new Vector(x2, y2);
        this.color = options.color || '#0f0';
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