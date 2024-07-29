class DrawQueue {
    graphics;
    color;
    fill;
    stroke;
    lineWidth;
    path = new Path2D();
    constructor(graphics, color, fill = true, stroke = false, lineWidth = 1) {
        this.graphics = graphics;
        this.color = color;
        this.fill = fill;
        this.stroke = stroke;
        this.lineWidth = lineWidth;
    }
    dispatch() {
        if (this.fill) {
            this.graphics.fillStyle = this.color;
            this.graphics.fill(this.path);
        }
        if (this.stroke) {
            this.graphics.lineWidth = this.lineWidth;
            this.graphics.strokeStyle = this.color;
            this.graphics.stroke(this.path);
        }
        this.path = new Path2D();
        return this.path;
    }
}
//# sourceMappingURL=draw-queue.js.map