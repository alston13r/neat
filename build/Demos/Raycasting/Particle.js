class Particle {
    static NumLines = 360;
    pos;
    rays;
    graphics;
    constructor(graphics) {
        this.graphics = graphics;
        this.pos = vec2.fromValues(graphics.width / 2, graphics.height / 2);
        this.rays = [];
        for (let i = 0; i < Particle.NumLines; i++) {
            this.rays[i] = new Ray2(this.pos, lerp(i, 0, Particle.NumLines, 0, 2 * Math.PI)).setGraphics(graphics);
        }
    }
    update(x, y) {
        vec2.set(this.pos, x, y);
    }
    look(objects) {
        for (const ray of this.rays) {
            let closest;
            let record = Infinity;
            for (const object of objects) {
                let point;
                if (object instanceof Line) {
                    point = ray.castOntoLine(object);
                }
                else if (object instanceof Circle) {
                    point = ray.castOntoCircle(object);
                }
                if (point) {
                    const distance = vec2.distance(this.pos, point);
                    if (distance < record) {
                        record = distance;
                        closest = point;
                    }
                }
            }
            if (closest) {
                this.graphics.createLine(this.pos[0], this.pos[1], closest[0], closest[1], { color: '#fff' }).draw();
            }
        }
    }
    lookLines(walls) {
        for (const ray of this.rays) {
            let closest;
            let record = Infinity;
            for (const wall of walls) {
                const point = ray.castOntoLine(wall);
                if (point) {
                    const d = vec2.distance(this.pos, point);
                    if (d < record) {
                        record = d;
                        closest = point;
                    }
                }
            }
            if (closest) {
                this.graphics.createLine(this.pos[0], this.pos[1], closest[0], closest[1], { color: '#fff' }).draw();
            }
        }
    }
    lookCircles(circles) {
        for (const ray of this.rays) {
            let closest;
            let record = Infinity;
            for (const circle of circles) {
                const point = ray.castOntoCircle(circle);
                if (point) {
                    const d = vec2.distance(this.pos, point);
                    if (d < record) {
                        record = d;
                        closest = point;
                    }
                }
            }
            if (closest) {
                this.graphics.createLine(this.pos[0], this.pos[1], closest[0], closest[1], { color: '#fff' }).draw();
            }
        }
    }
    draw() {
        this.graphics.createCircle(this.pos[0], this.pos[1], 8).draw();
        for (let ray of this.rays) {
            ray.draw();
        }
    }
}
//# sourceMappingURL=Particle.js.map