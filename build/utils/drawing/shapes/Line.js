class Line {
    pos1;
    pos2;
    constructor(x1, y1, x2, y2) {
        this.pos1 = vec2.fromValues(x1, y1);
        this.pos2 = vec2.fromValues(x2, y2);
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
    stroke(g) {
        g.line(this.x1, this.y1, this.x2, this.y2);
    }
    createPath() {
        let path = new Path2D();
        path.moveTo(this.x1, this.y1);
        path.lineTo(this.x2, this.y2);
        return path;
    }
    appendToPath(path) {
        path.addPath(this.createPath());
        return path;
    }
}
//# sourceMappingURL=Line.js.map