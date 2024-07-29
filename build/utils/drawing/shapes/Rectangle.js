class Rectangle {
    pos;
    size;
    constructor(x, y, width, height) {
        this.pos = vec2.fromValues(x, y);
        this.size = vec2.fromValues(width, height);
    }
    get x() {
        return this.pos[0];
    }
    get y() {
        return this.pos[1];
    }
    get width() {
        return this.size[0];
    }
    get height() {
        return this.size[1];
    }
    fill(g) {
        g.fillRect(this.x, this.y, this.width, this.height);
    }
    stroke(g) {
        g.strokeRect(this.x, this.y, this.width, this.height);
    }
    createPath() {
        let path = new Path2D();
        path.rect(this.x, this.y, this.width, this.height);
        return path;
    }
    appendToPath(path) {
        path.addPath(this.createPath());
        return path;
    }
}
//# sourceMappingURL=Rectangle.js.map