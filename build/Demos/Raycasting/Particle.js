class Particle {
    static NumLines = 36;
    pos;
    rays;
    graphics;
    constructor() {
        this.pos = new Vector(raycastingGraphics.width / 2, raycastingGraphics.height / 2);
        this.rays = [];
        for (let i = 0; i < Particle.NumLines; i++) {
            this.rays[i] = new Ray(this.pos, lerp(i, 0, Particle.NumLines, 0, 2 * Math.PI));
        }
    }
    setGraphics(graphics) {
        this.graphics = graphics;
        for (const ray of this.rays) {
            ray.setGraphics(graphics);
        }
        return this;
    }
    update(x, y) {
        this.pos.x = x;
        this.pos.y = y;
    }
    look(walls) {
        for (let ray of this.rays) {
            let closest;
            let record = Infinity;
            for (let wall of walls) {
                const point = ray.castOntoLine(wall);
                if (point) {
                    const d = this.pos.distanceTo(point);
                    if (d < record) {
                        record = d;
                        closest = point;
                    }
                }
            }
            if (closest) {
                this.graphics.createLine(this.pos.x, this.pos.y, closest.x, closest.y, '#fff').draw();
            }
        }
    }
    draw() {
        this.graphics.createCircle(this.pos.x, this.pos.y, 8, true, '#fff').draw();
        for (let ray of this.rays) {
            ray.draw();
        }
    }
}
//# sourceMappingURL=Particle.js.map