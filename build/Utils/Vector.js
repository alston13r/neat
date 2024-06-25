class Vector {
    x;
    y;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    static Add(a, b) {
        a.x += b.x;
        a.y += b.y;
        return a;
    }
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    static Sub(a, b) {
        a.x -= b.x;
        a.y -= b.y;
        return a;
    }
    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    static Scale(v, s) {
        v.x *= s;
        v.y *= s;
        return v;
    }
    scale(a) {
        return new Vector(a * this.x, a * this.y);
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
    }
    mag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    static Normal(v) {
        return Vector.Scale(v, 1 / v.mag());
    }
    normal() {
        return this.scale(1 / this.mag());
    }
    angle() {
        return Math.atan2(this.y, this.x);
    }
    static FromAngle(theta) {
        return new Vector(Math.cos(theta), Math.sin(theta));
    }
    static Sign(p1, p2, p3) {
        return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    }
    insideTriangle(p1, p2, p3) {
        let d1 = Vector.Sign(this, p1, p2);
        let d2 = Vector.Sign(this, p2, p3);
        let d3 = Vector.Sign(this, p3, p1);
        let hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
        let hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);
        return !(hasNeg && hasPos);
    }
    distanceTo(v) {
        return v.sub(this).mag();
    }
    copy() {
        return new Vector(this.x, this.y);
    }
    createRay(angle = 0) {
        return new Ray(this, angle);
    }
    toXY() {
        return [this.x, this.y];
    }
    static CopyFrom(vector, target) {
        vector.x = target.x;
        vector.y = target.y;
        return vector;
    }
}
//# sourceMappingURL=Vector.js.map