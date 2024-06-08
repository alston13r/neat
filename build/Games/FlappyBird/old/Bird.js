class Bird {
    constructor(brain) {
        this.size = 32;
        this.x = 64;
        this.y = graphics.height / 2;
        this.gravity = 0.6;
        this.lift = -15;
        this.velocity = 0;
        this.score = 0;
        this.fitness = 0;
        this.hitBounds = false;
        this.brain = brain ? brain.copy() : new NeuralNetwork(6, 6, 1);
    }
    setGraphics(graphics) {
        this.graphics = graphics;
        return this;
    }
    draw() {
        this.graphics.createCircle(this.x, this.y, this.size / 2, false, 'rgba(255, 255, 255, 50)', true).draw();
    }
    up() {
        this.velocity += this.lift;
    }
    mutate() {
        this.brain.mutateWeights();
        this.brain.mutateBiases();
        // this.brain.mutateActivationFunctions()
    }
    think(pipes) {
        let closest = null;
        let closestD = Infinity;
        for (let i in pipes) {
            const d = pipes[i].x - this.x;
            if (d < closestD && d > 0) {
                closest = pipes[i];
                closestD = d;
            }
        }
        const inputs = [];
        inputs[0] = this.y / this.graphics.height;
        inputs[1] = this.velocity / 15;
        inputs[2] = closest.top / this.graphics.height;
        inputs[3] = closest.bottom / this.graphics.height;
        inputs[4] = closest.x / this.graphics.width;
        inputs[5] = (closest.x + closest.width) / this.graphics.width;
        const output = this.brain.feedForward(inputs);
        if (output[0] > 0.5)
            this.up();
    }
    update() {
        this.score++;
        this.velocity += this.gravity;
        this.velocity *= 0.95;
        this.y += this.velocity;
        if (this.y > this.graphics.height) {
            this.hitBounds = true;
        }
        if (this.y < 0) {
            this.hitBounds = true;
        }
    }
}
//# sourceMappingURL=Bird.js.map