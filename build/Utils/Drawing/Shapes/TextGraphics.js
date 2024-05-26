/**
 * TODO
 */
class TextGraphics {
    /**
     * TODO
     * @param graphics
     * @param text
     * @param x
     * @param y
     * @param color
     * @param size
     * @param align
     * @param baseline
     */
    constructor(graphics, text, x, y, color = '#fff', size = 10, align = 'center', baseline = 'middle') {
        this.graphics = graphics;
        this.text = text;
        this.point = new Vector(x, y);
        this.text = text;
        this.color = color;
        this.size = size;
        this.align = align;
        this.baseline = baseline;
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
        const ctx = this.graphics.ctx;
        ctx.fillStyle = this.color;
        ctx.textAlign = this.align;
        ctx.textBaseline = this.baseline;
        ctx.font = this.size + 'px arial';
        ctx.fillText(this.text, this.x, this.y);
    }
}
//# sourceMappingURL=TextGraphics.js.map