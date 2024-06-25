class DeltaTimeAsteroids extends EventTarget {
    // static MinAsteroids = 5
    graphics;
    draw() {
        this.graphics.bg();
    }
    setGraphics(graphics) {
        this.graphics = graphics;
        return this;
    }
    ship;
    constructor() {
        super();
    }
    createShip() {
        this.ship = new DeltaTimeShip(this);
        this.dispatchEvent(new CustomEvent('shipcreated', { detail: this.ship.getInfo() }));
        return this.ship;
    }
}
//# sourceMappingURL=Game.js.map