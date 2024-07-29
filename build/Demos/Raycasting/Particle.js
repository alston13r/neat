class Particle {
    static NumLines = 360;
    pos;
    rays;
    constructor() {
        this.pos = vec2.fromValues(raycastingGraphics.width / 2, raycastingGraphics.height / 2);
        this.rays = [];
        for (let i = 0; i < Particle.NumLines; i++) {
            this.rays[i] = new Ray2(this.pos, lerp(i, 0, Particle.NumLines, 0, 2 * Math.PI));
        }
    }
    update(x, y) {
        vec2.set(this.pos, x, y);
    }
    look(g, objects) {
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
                g.line(this.pos[0], this.pos[1], closest[0], closest[1]);
            }
        }
    }
    lookLines(g, walls) {
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
                g.line(this.pos[0], this.pos[1], closest[0], closest[1]);
            }
        }
    }
    lookCircles(g, circles) {
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
                g.line(this.pos[0], this.pos[1], closest[0], closest[1]);
            }
        }
    }
    draw(g) {
        g.fillStyle = '#fff';
        g.fillCircle(this.pos[0], this.pos[1], 8);
        for (let ray of this.rays) {
            ray.draw(g);
        }
    }
}
//# sourceMappingURL=particle.js.map