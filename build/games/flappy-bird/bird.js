class Bird {
    static Size = 16;
    static Gravity = 0.2;
    static Lift = -10;
    static Friction = 0.98;
    pos;
    velocity = vec2.create();
    score = 0;
    fitness = 0;
    brain;
    alive = true;
    constructor(brain) {
        this.brain = brain || new BrainOOP().initialize(6, 0, 1);
        this.pos = vec2.fromValues(64, flappyBirdGraphics.height / 2);
    }
    draw(g, many = false) {
        g.strokeStyle = `rgba(255, 255, 255, ${many ? 0.4 : 1})`;
        g.strokeCircle(this.pos[0], this.pos[1], Bird.Size);
    }
    loadInputs(up = 0) {
        if (up > 0.9)
            this.velocity[1] += Bird.Lift;
    }
    update() {
        this.score++;
        this.velocity[1] += Bird.Gravity;
        vec2.scale(this.velocity, this.velocity, Bird.Friction);
        vec2.add(this.pos, this.pos, this.velocity);
        if (this.pos[1] > flappyBirdGraphics.height || this.pos[1] < 0)
            this.alive = false;
    }
}
//# sourceMappingURL=bird.js.map