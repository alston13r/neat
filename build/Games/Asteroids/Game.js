class AsteroidsGame extends EventTarget {
    static MinAsteroids = 5;
    asteroids = [];
    spawningAsteroids = true;
    asteroidCounter = 0;
    frameCounter = 0;
    graphics;
    width;
    height;
    ship;
    constructor(graphics) {
        super();
        this.graphics = graphics;
        this.width = graphics.width;
        this.height = graphics.height;
        this.ship = this.createShip();
        for (let i = 0; i < AsteroidsGame.MinAsteroids; i++) {
            this.createAsteroid();
        }
        this.addEventListener('asteroiddestroyed', (ev) => ev.detail.game.asteroidCounter++);
        this.addEventListener('update', (ev) => ev.detail.game.frameCounter++);
        // figure out how to dispatch start event
        // maybe add a delay or modify constructor to take listener
    }
    createShip() {
        const ship = new Ship(this, new Vector(this.width / 2, this.height / 2));
        this.dispatchEvent(new CustomEvent('shipcreated', { detail: ship.getInfo() }));
        return ship;
    }
    createAsteroid(emit) {
        const asteroid = new Asteroid(this, new Vector(0, 0));
        this.asteroids.push(asteroid);
        if (emit)
            this.dispatchEvent(new CustomEvent('asteroidcreated', { detail: asteroid.getInfo() }));
    }
    loadInputs(keys) {
        const straight = (keys['ArrowUp'] ? 1 : 0) + (keys['ArrowDown'] ? -1 : 0);
        const turn = (keys['ArrowLeft'] ? -1 : 0) + (keys['ArrowRight'] ? 1 : 0);
        const shoot = (keys[' '] ? 1 : 0);
        this.ship.loadInputs(straight, turn, shoot);
    }
    collisions() {
        if (this.ship.lasers.length > 0) {
            laserLoop: for (let laser of [...this.ship.lasers].reverse()) {
                for (let asteroid of [...this.asteroids].reverse()) {
                    if (asteroid.collisionWithLaser(laser)) {
                        asteroid.split();
                        laser.terminate();
                        this.checkAsteroidCount();
                        continue laserLoop;
                    }
                }
            }
        }
        for (let asteroid of this.asteroids) {
            if (asteroid.collisionWithShip()) {
                this.ship.kill();
            }
        }
    }
    checkAsteroidCount() {
        if (this.spawningAsteroids && this.asteroids.length < AsteroidsGame.MinAsteroids) {
            for (let i = 0; i < AsteroidsGame.MinAsteroids - this.asteroids.length; i++) {
                this.createAsteroid(true);
            }
        }
    }
    update(keysPressed) {
        this.dispatchEvent(new CustomEvent('update', { detail: this.getInfo() }));
        if (keysPressed)
            this.loadInputs(keysPressed);
        this.ship.update();
        for (let asteroid of this.asteroids) {
            asteroid.update();
        }
        this.collisions();
    }
    draw(debug = false) {
        this.ship.draw();
        this.asteroids.forEach(asteroid => asteroid.draw());
        if (debug) {
            for (const ray of this.ship.rays) {
                ray.draw();
            }
        }
    }
    getAsteroidsByDistance() {
        return [...this.asteroids].sort((a, b) => {
            const da = this.ship.pos.distanceTo(a.pos);
            const db = this.ship.pos.distanceTo(b.pos);
            return da - db;
        });
    }
    asteroidsInfo() {
        return this.getAsteroidsByDistance().map(asteroid => asteroid.getInfo());
    }
    getInfo() {
        return {
            game: this,
            graphics: this.graphics,
            frameCounter: this.frameCounter,
            width: this.width,
            height: this.height
        };
    }
}
//# sourceMappingURL=Game.js.map