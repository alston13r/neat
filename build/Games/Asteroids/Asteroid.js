class Asteroid {
    static SizeCutoff = 10;
    graphics;
    game;
    pos;
    radius;
    offsets;
    velocity;
    maxR;
    minR;
    collisionRadius;
    points;
    constructor(game, pos, radius) {
        this.game = game;
        this.graphics = game.graphics;
        this.pos = pos;
        this.radius = radius || Math.random() * 25 + 25;
        this.offsets = new Array(Math.floor(Math.random() * 5) + 10).fill(0).map(() => Math.random() * 20 - 8);
        this.velocity = vec2.random(vec2.create(), Math.random() * 0.5 + 1);
        this.maxR = this.offsets.reduce((max, curr) => curr > max ? curr : max, 0) + this.radius;
        this.minR = this.offsets.reduce((min, curr) => curr < min ? curr : min) + this.radius;
        this.collisionRadius = (this.maxR + this.minR) / 2;
        this.points = this.offsets.map((x, i) => {
            let angle = i / this.offsets.length * 2 * Math.PI;
            let r = this.radius + x;
            return vec2.fromAngle(angle, r);
        });
    }
    update() {
        vec2.add(this.pos, this.pos, this.velocity);
        this.wrap();
    }
    split() {
        const index = this.game.asteroids.indexOf(this);
        this.game.asteroids.splice(index, 1);
        const half = this.radius / 2;
        if (half < Asteroid.SizeCutoff)
            return;
        this.game.asteroids.push(new Asteroid(this.game, this.pos, half));
        this.game.asteroids.push(new Asteroid(this.game, vec2.copy(vec2.create(), this.pos), half));
        this.game.dispatchEvent(new CustomEvent('asteroiddestroyed', { detail: this.getInfo() }));
    }
    draw() {
        const points = this.points.map(point => vec2.add(vec2.create(), point, this.pos));
        this.graphics.createPolygon(points, { fill: false, stroke: true }).draw();
    }
    wrap() {
        const x = this.pos[0];
        const y = this.pos[1];
        const w = this.game.width;
        const h = this.game.height;
        if (x > w + this.radius)
            this.pos[0] = -this.radius;
        if (x < -this.radius)
            this.pos[0] = w + this.radius;
        if (y > h + this.radius)
            this.pos[1] = -this.radius;
        if (y < -this.radius)
            this.pos[1] = h + this.radius;
    }
    collisionWithShip() {
        return (vec2.distance(this.pos, this.game.ship.top) <= this.collisionRadius
            || vec2.distance(this.pos, this.game.ship.left) <= this.collisionRadius
            || vec2.distance(this.pos, this.game.ship.right) <= this.collisionRadius);
    }
    collisionWithLaser(laser) {
        return vec2.distance(this.pos, laser.pos) <= this.collisionRadius;
    }
    getCollisionCircle() {
        return this.graphics.createCircle(this.pos[0], this.pos[1], this.collisionRadius, { fill: false, stroke: true, color: '#750101' });
    }
    getInfo() {
        return {
            game: this.game,
            asteroid: this,
            velX: this.velocity[0] / 1.5,
            velY: this.velocity[1] / 1.5,
            size: this.collisionRadius / 50
        };
    }
}
//# sourceMappingURL=Asteroid.js.map