const graphics = new Graphics().setSize(800, 600).appendTo(document.body);
const maxTimeAlive = 30;
let generationTimeAlive = 0;
class GameBrainPair {
    constructor(brain) {
        this.drawing = false;
        this.brain = brain;
        this.game = new AsteroidsGame(graphics).addEventListener(ShipEvent.ShipDied, () => this.kill());
    }
    kill() {
        this.updateFitness();
        deadSet.push(aliveSet.splice(aliveSet.indexOf(this), 1)[0]);
        this.drawing = false;
        if (aliveSet.length > 0)
            aliveSet[0].drawing = true;
    }
    updateFitness() {
        this.brain.fitness = this.game.asteroidCounter * 40 + this.game.frameCounter / 600;
    }
    loop() {
        if (this.drawing)
            graphics.bg();
        loadBrainInputs(this);
        this.brain.runTheNetwork();
        const brainOutputs = this.brain.getOutput();
        this.game.ship.loadInputs(...brainOutputs);
        this.game.update();
        if (this.drawing) {
            this.game.draw();
            this.game.graphics.createText(`Generation: ${population.generationCounter}`, 5, this.game.graphics.height - 5, '#fff', 10, 'left', 'bottom').draw();
            this.game.graphics.createText(`Alive: ${aliveSet.length} / ${population.popSize}`, 5, this.game.graphics.height - 15, '#fff', 10, 'left', 'bottom').draw();
            this.game.graphics.createText(`Alive for: ${Math.round(generationTimeAlive)} / ${maxTimeAlive} seconds`, 5, 15, '#fff', 10, 'left', 'top').draw();
        }
        if (this.game.ship.alive)
            this.lastFrame = window.requestAnimationFrame(() => this.loop());
    }
}
function loadBrainInputs(pair) {
    const inputs = [];
    const shipInfo = pair.game.ship.getInfo();
    inputs[0] = shipInfo.posX;
    inputs[1] = shipInfo.posY;
    inputs[2] = shipInfo.heading;
    inputs[3] = shipInfo.velX;
    inputs[4] = shipInfo.velY;
    inputs[5] = shipInfo.canShoot ? 1 : 0;
    const nearestAsteroidInfo = pair.game.getAsteroidsByDistance()[0].getInfo();
    inputs[6] = nearestAsteroidInfo.angleFromShip;
    inputs[7] = nearestAsteroidInfo.distanceFromShip;
    inputs[8] = nearestAsteroidInfo.velX;
    inputs[9] = nearestAsteroidInfo.velY;
    inputs[10] = nearestAsteroidInfo.size;
    pair.brain.loadInputs(inputs);
}
const population = new Population(500, 11, 0, 3);
const aliveSet = population.members.map(brain => new GameBrainPair(brain));
const deadSet = [];
aliveSet[0].drawing = true;
aliveSet.forEach(pair => pair.loop());
const fittestRecords = [];
let lastTimestamp = 0;
function mainLoop(timestamp) {
    const diff = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    generationTimeAlive += diff / 1000;
    if (aliveSet.length == 0) {
        generationTimeAlive = 0;
        fittestRecords.push(population.getFittest());
        if (Population.Speciation)
            population.speciate();
        population.nextGeneration();
        deadSet.length = 0;
        population.members.forEach(brain => aliveSet.push(new GameBrainPair(brain)));
        aliveSet[0].drawing = true;
        aliveSet.forEach(pair => pair.loop());
    }
    else if (generationTimeAlive > maxTimeAlive) {
        aliveSet.forEach(pair => pair.game.ship.kill());
        aliveSet.length = 0;
        generationTimeAlive = 0;
        fittestRecords.push(population.getFittest());
        if (Population.Speciation)
            population.speciate();
        population.nextGeneration();
        deadSet.length = 0;
        population.members.forEach(brain => aliveSet.push(new GameBrainPair(brain)));
        aliveSet[0].drawing = true;
        aliveSet.forEach(pair => pair.loop());
    }
    window.requestAnimationFrame(mainLoop);
}
window.requestAnimationFrame(mainLoop);
//# sourceMappingURL=index.js.map