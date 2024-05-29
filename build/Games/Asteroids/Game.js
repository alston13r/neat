class AsteroidsGame {
    constructor(graphics) {
        this.asteroids = [];
        this.spawningAsteroids = true;
        this.asteroidCounter = 0;
        this.frameCounter = 0;
        this.events = new Map();
        this.graphics = graphics;
        this.width = graphics.width;
        this.height = graphics.height;
        this.ship = this.createShip();
        for (let i = 0; i < AsteroidsGame.MinAsteroids; i++) {
            this.createAsteroid();
        }
        this.addEventListener(AsteroidEvent.AsteroidDestroyed, (game) => game.asteroidCounter++);
        this.addEventListener(GameEvent.FrameUpdate, (game) => game.frameCounter++);
        this.dispatch(GameEvent.Start);
    }
    addEventListener(event, callback) {
        let arr;
        if (this.events.has(event)) {
            arr = this.events.get(event);
        }
        else {
            arr = [];
            this.events.set(event, arr);
        }
        arr.push(callback);
    }
    dispatch(event) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => callback(this));
        }
    }
    createShip() {
        const ship = new Ship(this, new Vector(this.width / 2, this.height / 2));
        this.dispatch(ShipEvent.ShipCreated);
        return ship;
    }
    createAsteroid(emit) {
        this.asteroids.push(new Asteroid(this, new Vector(0, 0)));
        if (emit)
            this.dispatch(AsteroidEvent.AsteroidCreated);
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
        this.dispatch(GameEvent.FrameUpdate);
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
            const asteroidInfo = this.asteroidsInfo();
            for (let asteroid of asteroidInfo) {
                const angle = asteroid.angleFromShip * 2 * Math.PI;
                const distance = asteroid.distanceFromShip * this.graphics.size.mag();
                const v = Vector.FromAngle(angle).scale(distance);
                const pos = this.ship.pos;
                const added = pos.add(v);
                new Line(this.graphics, pos.x, pos.y, added.x, added.y, '#f00', 1).draw();
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
}
AsteroidsGame.MinAsteroids = 5;
//# sourceMappingURL=Game.js.map