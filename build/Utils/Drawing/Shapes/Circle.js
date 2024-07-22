class Circle {
    pos;
    radius;
    constructor(x, y, radius) {
        this.pos = vec2.fromValues(x, y);
        this.radius = radius;
    }
    get x() {
        return this.pos[0];
    }
    get y() {
        return this.pos[1];
    }
    fill(g) {
        g.fillCircle(this.pos[0], this.pos[1], this.radius);
    }
    stroke(g) {
        g.strokeCircle(this.pos[0], this.pos[1], this.radius);
    }
    createPath() {
        let path = new Path2D();
        path.arc(this.x, this.y, this.radius, 0, TwoPi);
        return path;
    }
    appendToPath(path) {
        path.moveTo(this.x, this.y);
        path.arc(this.x, this.y, this.radius, 0, TwoPi);
        return path;
    }
}
//# sourceMappingURL=Circle.js.map