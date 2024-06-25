class TextGraphics {
    point;
    graphics;
    text;
    color;
    size;
    align;
    baseline;
    constructor(graphics, text, x, y, options = {}) {
        this.graphics = graphics;
        this.text = text;
        this.point = new Vector(x, y);
        this.text = text;
        this.color = options.color || '#fff';
        this.size = options.size || 10;
        this.align = options.align || 'left';
        this.baseline = options.baseline || 'top';
    }
    get x() {
        return this.point.x;
    }
    get y() {
        return this.point.y;
    }
    draw() {
        const ctx = this.graphics.ctx;
        ctx.fillStyle = this.color;
        ctx.textAlign = this.align;
        ctx.textBaseline = this.baseline;
        ctx.font = this.size + 'px arial';
        ctx.fillText(this.text, this.x, this.y);
    }
}
//# sourceMappingURL=TextGraphics.js.map