class Laser {
    static Speed = 5;
    graphics;
    ship;
    pos;
    velocity;
    radius = 5;
    constructor(ship) {
        this.ship = ship;
        ship.lasers.push(this);
        this.graphics = ship.graphics;
        this.graphics = ship.graphics;
        this.pos = ship.top;
        this.velocity = vec2.fromAngle(ship.heading, Laser.Speed);
    }
    update() {
        vec2.add(this.pos, this.pos, this.velocity);
        this.wrap();
    }
    draw() {
        this.graphics.createCircle(this.pos[0], this.pos[1], this.radius, { fill: false, stroke: true }).draw();
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
//# sourceMappingURL=Laser.js.map