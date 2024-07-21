class Line {
    pos1;
    pos2;
    graphics;
    color;
    lineWidth;
    constructor(graphics, x1, y1, x2, y2, options = {}) {
        this.graphics = graphics;
        this.pos1 = vec2.fromValues(x1, y1);
        this.pos2 = vec2.fromValues(x2, y2);
        this.color = options.color || '#0f0';
        this.lineWidth = options.lineWidth || 1;
    }
    get x1() {
        return this.pos1[0];
    }
    get y1() {
        return this.pos1[1];
    }
    get x2() {
        return this.pos2[0];
    }
    get y2() {
        return this.pos2[1];
    }
    draw() {
        const ctx = this.graphics.ctx;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        graphics.line(ctx, this.pos1, this.pos2);
    }
}
//# sourceMappingURL=Line.js.map