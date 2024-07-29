class Laser {
    static Speed = 5;
    static Radius = 5;
    ship;
    pos = vec2.create();
    velocity = vec2.create();
    constructor(ship) {
        this.ship = ship;
        ship.lasers.push(this);
        vec2.copy(this.pos, ship.top);
        vec2.scale(this.velocity, FastVec2FromRadian(ship.heading), Laser.Speed);
    }
    update() {
        vec2.add(this.pos, this.pos, this.velocity);
        this.wrap();
    }
    draw(g) {
        g.strokeCircle(this.pos[0], this.pos[1], Laser.Radius);
    }
    createPath() {
        return new Circle(this.pos[0], this.pos[1], Laser.Radius).createPath();
    }
    appendToPath(path) {
        return new Circle(this.pos[0], this.pos[1], Laser.Radius).appendToPath(path);
    }
    terminate() {
        this.ship.lasers.splice(this.ship.lasers.indexOf(this), 1);
    }
    wrap() {
        const x = this.pos[0];
        const y = this.pos[1];
        const w = this.ship.game.width;
        const h = this.ship.game.height;
        if (x > w)
            this.terminate();
        else if (x < 0)
            this.terminate();
        else if (y > h)
            this.terminate();
        else if (y < 0)
            this.terminate();
    }
}
//# sourceMappingURL=laser.js.map