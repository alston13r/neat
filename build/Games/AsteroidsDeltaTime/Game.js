class Asteroids extends EventTarget {
    graphics;
    draw() {
        this.graphics.bg();
    }
    setGraphics(graphics) {
        this.graphics = graphics;
        return this;
    }
    constructor() {
        super();
    }
}
//# sourceMappingURL=Game.js.map