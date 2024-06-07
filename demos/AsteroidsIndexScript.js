const gameGraphics = new Graphics().setSize(800, 600).appendTo(document.body);
const population = new Population(1000, 11, 0, 3, 0.5);
const game = new AsteroidsGame(gameGraphics);
const brain = new Brain().initialize(11, 0, 3, 0.5);
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
  const nearestAsteroidInfo = game.getAsteroidsByDistance()[0].getInfo();
  inputs[6] = nearestAsteroidInfo.angleFromShip;
  inputs[7] = nearestAsteroidInfo.distanceFromShip;
  inputs[8] = nearestAsteroidInfo.velX;
  inputs[9] = nearestAsteroidInfo.velY;
  inputs[10] = nearestAsteroidInfo.size;
  return brain.think(inputs);
}
function updateFitness(pair) {
  pair.brain.fitness = (pair.game.asteroidCounter * 5) ** 4 * pair.game.frameCounter / 200;
}
function addListeners(arr) {
  arr.forEach(pair => {
    pair.game.addEventListener(AsteroidEvent.AsteroidDestroyed, () => updateFitness(pair));
    pair.game.addEventListener(GameEvent.End, () => updateFitness(pair));
  });
}
const fittestRecords = [];
let pairings = [];
let lastTimestamp = 0;
function loop(timestamp) {
  const diff = timestamp - lastTimestamp;
  lastTimestamp = timestamp;
  currentGenerationTimeAlive += diff / 1000;
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
    gameGraphics.createText(`Generation: ${population.generationCounter}`, 5, gameGraphics.height - 5, '#fff', 10, 'left', 'bottom').draw();
    gameGraphics.createText(`Alive: ${stillAlive.length} / ${population.popSize}`, 5, gameGraphics.height - 15, '#fff', 10, 'left', 'bottom').draw();
    gameGraphics.createText(`Asteroids destroyed: ${fittest.game.asteroidCounter}`, 5, gameGraphics.height - 25, '#fff', 10, 'left', 'bottom').draw();
    gameGraphics.createText(`Alive for: ${Math.round(currentGenerationTimeAlive)} / ${maxTimeAlive} seconds`, 5, gameGraphics.height - 35, '#fff', 10, 'left', 'bottom').draw();
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