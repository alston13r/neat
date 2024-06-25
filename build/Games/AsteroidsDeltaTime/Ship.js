class DeltaTimeShip {
    static TopAngle = 0;
    static SideAngle = 2.4;
    static TopDistance = 20;
    static SideDistance = 20;
    static MaxSpeed = 3;
    static Friction = 0.99;
    graphics;
    draw() {
        this.graphics.createTriangle(...this.top.toXY(), ...this.left.toXY(), ...this.right.toXY(), false, '#fff', true).draw();
    }
    game;
    pos;
    heading;
    velocity;
    points;
    constructor(game, pos) {
        this.game = game;
        this.graphics = game.graphics;
        this.pos = pos || new Vector(this.graphics.width / 2, this.graphics.height / 2);
        this.heading = -Math.PI / 2;
        this.velocity = new Vector();
        this.points = [
            Vector.FromAngle(Ship.TopAngle + this.heading).scale(Ship.TopDistance).add(this.pos),
            Vector.FromAngle(Ship.SideAngle + this.heading).scale(Ship.SideDistance).add(this.pos),
            Vector.FromAngle(-Ship.SideAngle + this.heading).scale(Ship.SideDistance).add(this.pos)
        ];
        // this.lasers = []
        // this.canShoot = true
        // this.alive = true
        // this.rays = new Array(Ship.NumRays).fill(0).map(
        //   () => this.pos.createRay()
        //     .setGraphics(this.graphics)
        //     .setLength(Ship.RayLength)
        // )
        // this.updateRays()
    }
    get top() {
        return this.points[0];
    }
    get left() {
        return this.points[1];
    }
    get right() {
        return this.points[2];
    }
    update(delta) {
        const seconds = delta / 1000;
        Vector.Add(this.pos, this.velocity.scale(seconds));
        this.velocity = this.velocity.scale(DeltaTimeShip.Friction ** seconds);
        // this.wrap()
        this.points[0] = Vector.FromAngle(Ship.TopAngle + this.heading).scale(Ship.TopDistance).add(this.pos);
        this.points[1] = Vector.FromAngle(Ship.SideAngle + this.heading).scale(Ship.SideDistance).add(this.pos);
        this.points[2] = Vector.FromAngle(-Ship.SideAngle + this.heading).scale(Ship.SideDistance).add(this.pos);
        // for (let laser of [...this.lasers].reverse()) {
        //   laser.update()
        // }
        // this.updateRays()
    }
    getInfo() {
        return {
            game: this.game,
            ship: this,
            posX: lerp(this.pos.x, 0, this.graphics.width, -1, 1),
            posY: lerp(this.pos.y, 0, this.graphics.height, -1, 1),
            velX: lerp(this.velocity.x, -Ship.MaxSpeed, Ship.MaxSpeed, -1, 1),
            velY: lerp(this.velocity.y, -Ship.MaxSpeed, Ship.MaxSpeed, -1, 1),
            heading: lerp(this.heading, 0, 2 * Math.PI, -1, 1)
        };
    }
}
//# sourceMappingURL=Ship.js.map