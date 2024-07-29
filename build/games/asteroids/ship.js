class Ship {
    constructor(game, x, y) {
        this.top = vec2.create();
        this.left = vec2.create();
        this.right = vec2.create();
        this.shootTimer = 0;
        this.game = game;
        this.pos = vec2.fromValues(x, y);
        this.heading = -Math.PI / 2;
        this.velocity = vec2.create();
        this.lasers = [];
        this.alive = true;
        this.updateTopLeftRight();
        this.rays = new Array(Ship.NumRays).fill(0).map(() => new Ray2(this.pos)
            .setLength(Ship.RayLength));
        this.updateRays();
    }
    get canShoot() {
        return this.shootTimer <= 0;
    }
    kill() {
        this.alive = false;
        this.game.dispatchEvent(new CustomEvent('end'));
    }
    loadInputs(straight = 0, turn = 0, shoot = 0) {
        this.push(straight);
        this.turn(turn);
        if (shoot > 0.9)
            this.shoot();
    }
    update() {
        this.shootTimer--;
        this.shootTimer = clamp(this.shootTimer, 0, Ship.ShootDelay);
        vec2.add(this.pos, this.pos, this.velocity);
        vec2.scale(this.velocity, this.velocity, 0.999);
        this.wrap();
        this.updateTopLeftRight();
        for (let laser of [...this.lasers].reverse()) {
            laser.update();
        }
        this.updateRays();
    }
    updateTopLeftRight() {
        vec2.scale(this.top, FastVec2FromRadian(this.heading + Ship.TopAngle), Ship.TopDistance);
        vec2.scale(this.left, FastVec2FromRadian(this.heading + Ship.SideAngle), Ship.SideDistance);
        vec2.scale(this.right, FastVec2FromRadian(this.heading - Ship.SideAngle), Ship.SideDistance);
        vec2.add(this.top, this.top, this.pos);
        vec2.add(this.left, this.left, this.pos);
        vec2.add(this.right, this.right, this.pos);
    }
    updateRays() {
        const maxHeadingOffset = 0.5 * (Ship.NumRays - 1) * Ship.RayDeltaTheta;
        this.rays.forEach((ray, i) => ray.setAngle(lerp(i, 0, Ship.NumRays, this.heading - maxHeadingOffset, this.heading + maxHeadingOffset)));
    }
    push(direction) {
        if (direction == 0)
            return;
        const c = Math.cos(this.heading) * direction * 0.1;
        const s = Math.sin(this.heading) * direction * 0.1;
        const dir = vec2.fromValues(c, s);
        vec2.add(this.velocity, this.velocity, dir);
        if (vec2.length(this.velocity) > Ship.MaxSpeed) {
            vec2.normalize(this.velocity, this.velocity);
            vec2.scale(this.velocity, this.velocity, Ship.MaxSpeed);
        }
    }
    wrap() {
        const x = this.pos[0];
        const y = this.pos[1];
        const w = this.game.width;
        const h = this.game.height;
        if (x > w)
            this.pos[0] = 0;
        if (x < 0)
            this.pos[0] = w;
        if (y > h)
            this.pos[1] = 0;
        if (y < 0)
            this.pos[1] = h;
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
    draw(g) {
        g.strokeTriangle(this.top[0], this.top[1], this.left[0], this.left[1], this.right[0], this.right[1]);
        this.lasers.forEach(laser => laser.draw(g));
    }
    createPath() {
        let path = new Triangle(this.top[0], this.top[1], this.left[0], this.left[1], this.right[0], this.right[1]).createPath();
        this.lasers.forEach(laser => laser.appendToPath(path));
        return path;
    }
    appendToPath(path) {
        new Triangle(this.top[0], this.top[1], this.left[0], this.left[1], this.right[0], this.right[1]).appendToPath(path);
        this.lasers.forEach(laser => laser.appendToPath(path));
        return path;
    }
    getRayInfo() {
        const info = [];
        const asteroidCircles = this.game.asteroids.map(asteroid => asteroid.getCollisionCircle());
        for (const ray of this.rays) {
            const point = ray.castOntoClosest(asteroidCircles);
            if (point) {
                const distance = vec2.distance(this.pos, point);
                const hitting = distance <= Ship.RayLength;
                info.push({ ray, hitting, distance: lerp(distance, 0, Ship.RayLength, 0, 1) });
            }
            else {
                info.push({ ray, hitting: false, distance: -1 });
            }
        }
        return info;
    }
    getInfo() {
        return {
            game: this.game,
            ship: this,
            alive: this.alive,
            posX: this.pos[0] / this.game.width,
            posY: this.pos[1] / this.game.height,
            velX: this.velocity[0] / Ship.MaxSpeed,
            velY: this.velocity[1] / Ship.MaxSpeed,
            heading: this.heading / Math.PI / 2,
            canShoot: this.canShoot,
            rays: this.getRayInfo()
        };
    }
}
Ship.MaxSpeed = 3;
Ship.ShootDelay = 33;
Ship.TopAngle = 0;
Ship.SideAngle = 2.4;
Ship.TopDistance = 20;
Ship.SideDistance = 20;
Ship.NumRays = 5;
Ship.RayDeltaTheta = 0.3;
Ship.RayLength = 300;
//# sourceMappingURL=ship.js.map