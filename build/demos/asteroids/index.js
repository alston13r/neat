const asteroidsGraphics = new Graphics(document.getElementById('mainCanvas'));
asteroidsGraphics.setSize(800, 600);
asteroidsGraphics.canvas.style.display = 'block';
asteroidsGraphics.textBaseline = 'bottom';
asteroidsGraphics.textAlign = 'left';
asteroidsGraphics.fillStyle = '#fff';
asteroidsGraphics.context.font = 'arial 10px';
const asteroidsPopulation = new Population(500, 11, 0, 3, 0.5);
const maxTimeAlive = 30;
let currentGenerationTimeAlive = 0;
function thinkBrain(brain, game) {
    return game.ship.loadIntoBrain(brain);
}
const fittestRecords = [];
let pairings = [];
let lastTimestamp = 0;
function loop(timestamp) {
    const delta = clamp(timestamp - lastTimestamp, 0, 1000);
    lastTimestamp = timestamp;
    currentGenerationTimeAlive += delta / 1000;
    const stillAlive = pairings.filter(pair => pair.game.ship.alive);
    if (currentGenerationTimeAlive > maxTimeAlive) {
        stillAlive.forEach(pair => pair.game.ship.alive = false);
    }
    if (stillAlive.length > 0) {
        const fittest = stillAlive.reduce((best, curr) => curr.brain.fitness > best.brain.fitness ? curr : best);
        asteroidsGraphics.bg();
        stillAlive.forEach(pair => {
            const brainThoughts = pair.game.ship.loadIntoBrain(pair.brain);
            pair.game.ship.loadInputs(...brainThoughts);
            pair.game.update();
            pair.brain.fitness = pair.game.asteroidCounter * 5 + pair.game.frameCounter / 120;
        });
        fittest.game.draw(asteroidsGraphics);
        asteroidsGraphics.fillStyle = '#fff';
        asteroidsGraphics.fillText(`Generation: ${asteroidsPopulation.generationCounter}`, 5, asteroidsGraphics.height - 5);
        asteroidsGraphics.fillText(`Alive: ${stillAlive.length} / ${asteroidsPopulation.popSize}`, 5, asteroidsGraphics.height - 15);
        asteroidsGraphics.fillText(`Asteroids destroyed: ${fittest.game.asteroidCounter}`, 5, asteroidsGraphics.height - 25);
        asteroidsGraphics.fillText(`Alive for: ${Math.round(currentGenerationTimeAlive)} / ${maxTimeAlive} seconds`, 5, asteroidsGraphics.height - 35);
    }
    else {
        currentGenerationTimeAlive = 0;
        asteroidsPopulation.nextGeneration();
        if (asteroidsPopulation.generationCounter > 0) {
            asteroidsPopulation.speciate();
            fittestRecords.push(asteroidsPopulation.getFittest());
            pairings.forEach((pair, index) => {
                pair.brain = asteroidsPopulation.members[index];
                pair.game.reset();
            });
        }
        pairings = asteroidsPopulation.members.map(member => {
            return {
                brain: member,
                game: new Asteroids(asteroidsGraphics.width, asteroidsGraphics.height)
            };
        });
    }
    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);
//# sourceMappingURL=index.js.map