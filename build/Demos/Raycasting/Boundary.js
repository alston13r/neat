class Boundary {
    a;
    b;
    constructor(x1, y1, x2, y2) {
        this.a = new Vector(x1, y1);
        this.b = new Vector(x2, y2);
    }
    draw() {
        raycastingGraphics.createLine(this.a.x, this.a.y, this.b.x, this.b.y, '#fff').draw();
    }
}
//# sourceMappingURL=Boundary.js.map