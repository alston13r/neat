class Ray2 {
    pos;
    dir;
    length;
    constructor(pos, angle = 0, length = 1) {
        this.pos = pos;
        this.dir = FastVec2FromRadian(angle);
        this.length = length;
    }
    setAngle(angle) {
        vec2.copy(this.dir, FastVec2FromRadian(angle));
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
                const distance = vec2.squaredDistance(this.pos, point);
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
        const x3 = this.pos[0];
        const y3 = this.pos[1];
        const x4 = x3 + this.dir[0];
        const y4 = y3 + this.dir[1];
        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den == 0)
            return;
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
        if (t > 0 && t < 1 && u > 0) {
            const point = vec2.create();
            point[0] = x1 + t * (x2 - x1);
            point[1] = y1 + t * (y2 - y1);
            return point;
        }
    }
    castOntoCircles(circles) {
        let closest;
        let record = Infinity;
        for (const circle of circles) {
            let point = this.castOntoCircle(circle);
            if (point) {
                const distance = vec2.squaredDistance(this.pos, point);
                if (distance < record) {
                    record = distance;
                    closest = point;
                }
            }
        }
        return closest;
    }
    castOntoCircle(circle) {
        const px = this.pos[0];
        const py = this.pos[1];
        const dx = this.dir[0];
        const dy = this.dir[1];
        const cx = circle.pos[0];
        const cy = circle.pos[1];
        const x1 = px - cx;
        const y1 = py - cy;
        const x2 = x1 + dx;
        const y2 = y1 + dy;
        const det = x1 * y2 - x2 * y1;
        const disc = circle.radius ** 2 - det ** 2;
        if (disc < 0)
            return;
        const discSqrt = Math.sqrt(disc);
        const sgn = dy < 0 ? -1 : 1;
        const P = (det * dy + sgn * dx * discSqrt) + cx;
        const Q = (-det * dx + Math.abs(dy) * discSqrt) + cy;
        const R = (det * dy - sgn * dx * discSqrt) + cx;
        const S = (-det * dx - Math.abs(dy) * discSqrt) + cy;
        const p1 = vec2.fromValues(P, Q);
        const p2 = vec2.fromValues(R, S);
        const posAddDir = vec2.add(vec2.create(), this.pos, this.dir);
        const d1 = vec2.squaredDistance(this.pos, p1);
        const d2 = vec2.squaredDistance(posAddDir, p1);
        const d3 = vec2.squaredDistance(this.pos, p2);
        const d4 = vec2.squaredDistance(posAddDir, p2);
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
    draw(g) {
        const d = vec2.scaleAndAdd([], this.pos, this.dir, this.length);
        g.line(this.pos[0], this.pos[1], d[0], d[1]);
    }
}
//# sourceMappingURL=ray.js.map