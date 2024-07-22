class Polygon {
    points;
    constructor(points) {
        this.points = points;
    }
    fill(g) {
        g.fillPolygon(this.points);
    }
    stroke(g) {
        g.strokePolygon(this.points);
    }
    createPath() {
        let length = this.points.length;
        if (this.points.length == 0 || this.points.length == 1)
            return new Path2D();
        const path = new Path2D();
        const p1 = this.points[0];
        path.moveTo(p1[0], p1[1]);
        for (let i = 1; i < length; i++) {
            const p = this.points[i];
            path.lineTo(p[0], p[1]);
        }
        path.closePath();
        return path;
    }
    appendToPath(path) {
        const length = this.points.length;
        if (this.points.length == 0 || this.points.length == 1)
            return path;
        const p1 = this.points[0];
        path.moveTo(p1[0], p1[1]);
        for (let i = 1; i < length; i++) {
            const p = this.points[i];
            path.lineTo(p[0], p[1]);
        }
        path.lineTo(p1[0], p1[1]);
        return path;
    }
}
//# sourceMappingURL=Polygon.js.map