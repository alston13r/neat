class Ship {
    static MaxSpeed = 3;
    static ShootDelay = 200;
    static TopAngle = 0;
    static SideAngle = 2.4;
    static TopDistance = 20;
    static SideDistance = 20;
    static NumRays = 5;
    static RayDeltaTheta = 0.3;
    static RayLength = 300;
    pos;
    game;
    graphics;
    heading;
    velocity;
    lasers;
    alive;
    top;
    left;
    right;
    rays;
    shootTimer = 0;
    constructor(game, pos) {
        this.game = game;
        this.graphics = game.graphics;
        this.pos = pos || new Vector();
        this.heading = -Math.PI / 2;
        this.velocity = new Vector();
        this.lasers = [];
        this.alive = true;
        this.top = Vector.FromAngle(Ship.TopAngle + this.heading).scale(Ship.TopDistance).add(pos);
        this.left = Vector.FromAngle(Ship.SideAngle + this.heading).scale(Ship.SideDistance).add(pos);
        this.right = Vector.FromAngle(-Ship.SideAngle + this.heading).scale(Ship.SideDistance).add(pos);
        this.rays = new Array(Ship.NumRays).fill(0).map(() => this.pos.createRay()
            .setGraphics(this.graphics)
            .setLength(Ship.RayLength));
        this.updateRays();
    }
    get canShoot() {
        return this.shootTimer <= 0;
    }
    kill() {
        this.alive = false;
        this.game.dispatchEvent(new CustomEvent('shipdestroyed', { detail: this.getInfo() }));
        this.game.dispatchEvent(new CustomEvent('end', { detail: this.game.getInfo() }));
    }
    loadInputs(straight = 0, turn = 0, shoot = 0) {
        this.push(straight);
        this.turn(turn);
        if (shoot > 0.9)
            this.shoot();
    }
    update(delta = 0) {
        this.shootTimer -= delta;
        this.shootTimer = clamp(this.shootTimer, 0, Ship.ShootDelay);
        Vector.Add(this.pos, this.velocity);
        this.velocity = this.velocity.scale(0.999);
        this.wrap();
        this.top = Vector.FromAngle(Ship.TopAngle + this.heading).scale(Ship.TopDistance).add(this.pos);
        this.left = Vector.FromAngle(Ship.SideAngle + this.heading).scale(Ship.SideDistance).add(this.pos);
        this.right = Vector.FromAngle(-Ship.SideAngle + this.heading).scale(Ship.SideDistance).add(this.pos);
        for (let laser of [...this.lasers].reverse()) {
            laser.update();
        }
        this.updateRays();
    }
    updateRays() {
        const maxHeadingOffset = 0.5 * (Ship.NumRays - 1) * Ship.RayDeltaTheta;
        this.rays.forEach((ray, i) => ray.setAngle(lerp(i, 0, Ship.NumRays, this.heading - maxHeadingOffset, this.heading + maxHeadingOffset)));
    }
    push(direction) {
        if (direction == 0)
            return;
        const dir = Vector.FromAngle(this.heading).scale(0.1).scale(direction);
        this.velocity = this.velocity.add(dir);
        const speed = this.velocity.mag();
        if (speed > Ship.MaxSpeed)
            this.velocity = this.velocity.normal().scale(Ship.MaxSpeed);
    }
    wrap() {
        const x = this.pos.x;
        const y = this.pos.y;
        const w = this.game.width;
        const h = this.game.height;
        if (x > w)
            this.pos.x = 0;
        if (x < 0)
            this.pos.x = w;
        if (y > h)
            this.pos.y = 0;
        if (y < 0)
            this.pos.y = h;
    }
    turn(direction) {
        if (direction == 0)
            return;
        this.heading += direction * 0.05;
        this.heading %= 2 * Math.PI;
    }
    shoot() {
        if (this.canShoot) {
            new Laser(this);
            this.shootTimer = Ship.ShootDelay;
        }
    }
    draw() {
        this.graphics.createTriangle(...this.top.toXY(), ...this.left.toXY(), ...this.right.toXY(), { fill: false, stroke: true }).draw();
        this.lasers.forEach(laser => laser.draw());
    }
    getRayInfo(debug = false) {
        const info = [];
        const asteroidCircles = this.game.asteroids.map(asteroid => asteroid.getCollisionCircle());
        for (const ray of this.rays) {
            const point = ray.castOntoClosest(asteroidCircles);
            if (point) {
                const distance = this.pos.distanceTo(point);
                const hitting = distance <= Ship.RayLength;
                info.push({ ray, hitting, distance: lerp(distance, 0, Ship.RayLength, 0, 1) });
                if (debug) {
                    ray.draw(hitting ? '#0f0' : '#00f');
                    this.graphics.createCircle(point.x, point.y, 5, { color: '#f00' }).draw();
                }
            }
            else {
                info.push({ ray, hitting: false, distance: -1 });
                if (debug)
                    ray.draw();
            }
        }
        return info;
    }
    getInfo() {
        return {
            game: this.game,
            ship: this,
            alive: this.alive,
            posX: this.pos.x / this.game.width,
            posY: this.pos.y / this.game.height,
            velX: this.velocity.x / Ship.MaxSpeed,
            velY: this.velocity.y / Ship.MaxSpeed,
            heading: this.heading / Math.PI / 2,
            canShoot: this.canShoot,
            rays: this.getRayInfo()
        };
    }
}
//# sourceMappingURL=Ship.js.map