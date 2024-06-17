class Ray {
    pos;
    dir;
    graphics;
    length;
    constructor(pos, angle, length = 1) {
        this.pos = pos;
        this.dir = Vector.FromAngle(angle);
        this.length = length;
    }
    setGraphics(graphics) {
        this.graphics = graphics;
        return this;
    }
    lookAt(x, y) {
        this.dir.x = x - this.pos.x;
        this.dir.y = y - this.pos.y;
        Vector.Normal(this.dir);
    }
    setAngle(theta) {
        this.dir = Vector.FromAngle(theta);
        return this;
    }
    setLength(length) {
        this.length = length;
        return this;
    }
    castOntoClosest(objects) {
        let closest;
        let record = Infinity;
        for (const object of objects) {
            let point;
            if (object instanceof Line) {
                point = this.castOntoLine(object);
            }
            else if (object instanceof Circle) {
                point = this.castOntoCircle(object);
            }
            if (point) {
                const distance = this.pos.distanceTo(point);
                if (distance < record) {
                    record = distance;
                    closest = point;
                }
            }
        }
        return closest;
    }
    castOntoLine(line) {
        const x1 = line.x1;
        const y1 = line.y1;
        const x2 = line.x2;
        const y2 = line.y2;
        const x3 = this.pos.x;
        const y3 = this.pos.y;
        const x4 = this.pos.x + this.dir.x;
        const y4 = this.pos.y + this.dir.y;
        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den == 0)
            return;
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
        if (t > 0 && t < 1 && u > 0) {
            const point = new Vector();
            point.x = x1 + t * (x2 - x1);
            point.y = y1 + t * (y2 - y1);
            return point;
        }
    }
    castOntoCircle(circle) {
        const x1 = this.pos.x - circle.x;
        const y1 = this.pos.y - circle.y;
        const x2 = this.pos.x + this.dir.x - circle.x;
        const y2 = this.pos.y + this.dir.y - circle.y;
        const dx = this.dir.x;
        const dy = this.dir.y;
        const dr = Math.sqrt(dx ** 2 + dy ** 2);
        const det = x1 * y2 - x2 * y1;
        const disc = circle.radius ** 2 * dr ** 2 - det ** 2;
        if (disc < 0)
            return;
        const discSqrt = Math.sqrt(disc);
        const sgn = dy < 0 ? -1 : 1;
        const P = (det * dy + sgn * dx * discSqrt) / dr ** 2;
        const Q = (-det * dx + Math.abs(dy) * discSqrt) / dr ** 2;
        const R = (det * dy - sgn * dx * discSqrt) / dr ** 2;
        const S = (-det * dx - Math.abs(dy) * discSqrt) / dr ** 2;
        const p1 = new Vector(P, Q).add(circle.point);
        const p2 = new Vector(R, S).add(circle.point);
        const d1 = this.pos.distanceTo(p1);
        const d2 = this.pos.add(this.dir).distanceTo(p1);
        const d3 = this.pos.distanceTo(p2);
        const d4 = this.pos.add(this.dir).distanceTo(p2);
        const p1Forward = d2 < d1;
        const p2Forward = d4 < d3;
        if (!p1Forward && !p2Forward)
            return;
        if (p1Forward && !p2Forward)
            return p1;
        if (!p1Forward && p2Forward)
            return p2;
        return d1 < d3 ? p1 : p2;
    }
    draw(color = '#fff') {
        const d = this.pos.add(this.dir.scale(this.length));
        this.graphics.createLine(this.pos.x, this.pos.y, d.x, d.y, color).draw();
    }
}
//# sourceMappingURL=Ray.js.map