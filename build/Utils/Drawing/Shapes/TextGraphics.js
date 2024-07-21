class TextGraphics {
    pos;
    graphics;
    text;
    color;
    size;
    align;
    baseline;
    constructor(graphics, text, x, y, options = {}) {
        this.graphics = graphics;
        this.text = text;
        this.pos = vec2.fromValues(x, y);
        this.text = text;
        this.color = options.color || '#fff';
        this.size = options.size || 10;
        this.align = options.align || 'left';
        this.baseline = options.baseline || 'top';
    }
    get x() {
        return this.pos[0];
    }
    get y() {
        return this.pos[1];
    }
    draw() {
        const ctx = this.graphics.ctx;
        ctx.fillStyle = this.color;
        ctx.textAlign = this.align;
        ctx.textBaseline = this.baseline;
        ctx.font = this.size + 'px arial';
        graphics.fillText(ctx, this.text, this.pos);
    }
}
//# sourceMappingURL=TextGraphics.js.map