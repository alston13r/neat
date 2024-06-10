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
        this.velocity = Vector.FromAngle(ship.heading).scale(Laser.Speed);
    }
    update() {
        this.pos = this.pos.add(this.velocity);
        this.wrap();
    }
    draw() {
        this.graphics.createCircle(this.pos.x, this.pos.y, this.radius, false, '#fff', true).draw();
    }
    terminate() {
        this.ship.lasers.splice(this.ship.lasers.indexOf(this), 1);
    }
    wrap() {
        const x = this.pos.x;
        const y = this.pos.y;
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