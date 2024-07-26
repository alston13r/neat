class Triangle {
    pos1;
    pos2;
    pos3;
    constructor(x1, y1, x2, y2, x3, y3) {
        this.pos1 = vec2.fromValues(x1, y1);
        this.pos2 = vec2.fromValues(x2, y2);
        this.pos3 = vec2.fromValues(x3, y3);
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
    get x3() {
        return this.pos3[0];
    }
    get y3() {
        return this.pos3[1];
    }
    fill(g) {
        g.fillTriangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
    }
    stroke(g) {
        g.strokeTriangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
    }
    createPath() {
        let path = new Path2D();
        path.moveTo(this.x1, this.y1);
        path.lineTo(this.x2, this.y2);
        path.lineTo(this.x3, this.y3);
        path.closePath();
        return path;
    }
    appendToPath(path) {
        path.addPath(this.createPath());
        return path;
    }
}
//# sourceMappingURL=Triangle.js.map