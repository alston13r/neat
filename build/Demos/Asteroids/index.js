const gameGraphics = new Graphics().setSize(800, 600).appendTo(document.body);
const population = new Population(500, 11, 0, 3, 0.5);
// code for individual play
// const keysPressed = {}
// window.addEventListener('keydown', e => keysPressed[e.key] = true)
// window.addEventListener('keyup', e => keysPressed[e.key] = false)
// const game: AsteroidsGame = new AsteroidsGame(gameGraphics)
// const brain: Brain = new Brain().initialize(11, 0, 3, 0.5)
// let lastTimestamp: number = 0
// function asteroidsLoop(timestamp: number = 0): void {
//   gameGraphics.bg()
//   const diff: number = timestamp - lastTimestamp
//   lastTimestamp = timestamp
//   game.update(keysPressed)
//   game.draw()
//   window.requestAnimationFrame(asteroidsLoop)
// }
// window.requestAnimationFrame(asteroidsLoop)
const maxTimeAlive = 30;
let currentGenerationTimeAlive = 0;
function thinkBrain(brain, game) {
    const inputs = [];
    const shipInfo = game.ship.getInfo();
    inputs[0] = shipInfo.posX;
    inputs[1] = shipInfo.posY;
    inputs[2] = shipInfo.heading;
    inputs[3] = shipInfo.velX;
    inputs[4] = shipInfo.velY;
    inputs[5] = shipInfo.canShoot ? 1 : 0;
    inputs[6] = shipInfo.rays[0].distance;
    inputs[7] = shipInfo.rays[1].distance;
    inputs[8] = shipInfo.rays[2].distance;
    inputs[9] = shipInfo.rays[3].distance;
    inputs[10] = shipInfo.rays[4].distance;
    return brain.think(inputs);
}
function updateFitness(pair) {
    pair.brain.fitness = pair.game.asteroidCounter * 5 + pair.game.frameCounter / 120;
}
function addListeners(arr) {
    arr.forEach(pair => {
        pair.game.addEventListener('asteroiddestroyed', () => updateFitness(pair));
        pair.game.addEventListener('end', () => updateFitness(pair));
    });
}
const fittestRecords = [];
let pairings = [];
let lastTimestamp = 0;
function loop(timestamp) {
    const diff = timestamp - lastTimestamp; // delta time in milliseconds
    lastTimestamp = timestamp;
    currentGenerationTimeAlive += Math.min(diff / 1000, 1); // clamp delta time to 1 second
    const stillAlive = pairings.filter(pair => pair.game.ship.alive);
    if (currentGenerationTimeAlive > maxTimeAlive) {
        stillAlive.forEach(pair => pair.game.ship.kill());
    }
    if (stillAlive.length > 0) {
        const fittest = stillAlive.reduce((best, curr) => curr.brain.fitness > best.brain.fitness ? curr : best);
        gameGraphics.bg();
        stillAlive.forEach(pair => {
            const brainThoughts = thinkBrain(pair.brain, pair.game);
            pair.game.ship.loadInputs(...brainThoughts);
            pair.game.update();
        });
        fittest.game.draw();
        gameGraphics.createText(`Generation: ${population.generationCounter}`, 5, gameGraphics.height - 5, { baseline: 'bottom' }).draw();
        gameGraphics.createText(`Alive: ${stillAlive.length} / ${population.popSize}`, 5, gameGraphics.height - 15, { baseline: 'bottom' }).draw();
        gameGraphics.createText(`Asteroids destroyed: ${fittest.game.asteroidCounter}`, 5, gameGraphics.height - 25, { baseline: 'bottom' }).draw();
        gameGraphics.createText(`Alive for: ${Math.round(currentGenerationTimeAlive)} / ${maxTimeAlive} seconds`, 5, gameGraphics.height - 35, { baseline: 'bottom' }).draw();
    }
    else {
        currentGenerationTimeAlive = 0;
        population.nextGeneration();
        if (population.generationCounter > 0) {
            population.speciate();
            fittestRecords.push(population.getFittest());
        }
        pairings = population.members.map(member => {
            return {
                brain: member,
                game: new AsteroidsGame(gameGraphics)
            };
        });
        addListeners(pairings);
    }
    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);
//# sourceMappingURL=index.js.map