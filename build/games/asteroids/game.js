class Asteroids {
    static MinAsteroids = 5;
    asteroids = [];
    asteroidCounter = 0;
    frameCounter = 0;
    width;
    height;
    ship;
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.createShip();
        for (let i = 0; i < Asteroids.MinAsteroids; i++) {
            this.asteroids.push(new Asteroid(this));
        }
    }
    createShip() {
        this.ship = new Ship(this);
    }
    reset() {
        this.asteroidCounter = 0;
        this.frameCounter = 0;
        this.asteroids.length = 0;
        for (let i = 0; i < Asteroids.MinAsteroids; i++) {
            this.asteroids.push(new Asteroid(this));
        }
        this.ship.reset();
        return this;
    }
    loadInputs(keys) {
        this.ship.loadInputs(keys['ArrowUp'] - keys['ArrowDown'], keys['ArrowRight'] - keys['ArrowLeft'], keys[' ']);
    }
    collisions() {
        if (this.ship.lasers.length > 0) {
            laserLoop: for (let laser of [...this.ship.lasers].reverse()) {
                for (let asteroid of [...this.asteroids].reverse()) {
                    if (asteroid.collisionWithLaser(laser)) {
                        asteroid.split();
                        this.ship.lasers.splice(this.ship.lasers.indexOf(laser), 1);
                        this.checkAsteroidCount();
                        continue laserLoop;
                    }
                }
            }
        }
        for (let asteroid of this.asteroids) {
            if (asteroid.collisionWithShip()) {
                this.ship.alive = false;
                break;
            }
        }
    }
    checkAsteroidCount() {
        if (this.asteroids.length < Asteroids.MinAsteroids) {
            for (let i = 0; i < Asteroids.MinAsteroids - this.asteroids.length; i++) {
                this.asteroids.push(new Asteroid(this));
            }
        }
    }
    update() {
        this.frameCounter++;
        this.ship.update();
        for (let asteroid of this.asteroids) {
            asteroid.update();
        }
        this.collisions();
    }
    draw(g) {
        g.strokeStyle = '#fff';
        g.lineWidth = 1;
        g.strokeTriangle(this.ship.top[0], this.ship.top[1], this.ship.left[0], this.ship.left[1], this.ship.right[0], this.ship.right[1]);
        for (const laser of this.ship.lasers) {
            g.strokeCircle(laser.pos[0], laser.pos[1], Laser.Radius);
        }
        for (const asteroid of this.asteroids) {
            g.strokePolygon(asteroid.points.map(point => vec2.add([], point, asteroid.pos)));
        }
    }
}
//# sourceMappingURL=game.js.map