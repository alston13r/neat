class AsteroidPool {
    pool = [];
    acquire(game, pos, radius) {
        if (this.pool.length > 0) {
            const asteroid = this.pool.pop();
            asteroid.reset(game, pos, radius);
            return asteroid;
        }
        return new Asteroid(game, pos, radius);
    }
    release(asteroid) {
        this.pool.push(asteroid);
    }
}
//# sourceMappingURL=asteroid-pool.js.map