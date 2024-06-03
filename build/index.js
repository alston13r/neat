const gameGraphics = new Graphics().setSize(800, 600).appendTo(document.body);
const game = new AsteroidsGame(gameGraphics);
const brain = new Brain().initialize(11, 0, 3, 0.5);
function thinkBrain() {
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
game.addEventListener(AsteroidEvent.AsteroidDestroyed, updateFitness);
game.addEventListener(GameEvent.End, updateFitness);
function updateFitness() {
    brain.fitness = game.asteroidCounter * 5 + game.frameCounter / 120;
}
function loop() {
    gameGraphics.bg();
    const brainThoughts = thinkBrain();
    game.ship.loadInputs(...brainThoughts);
    game.update();
    game.draw();
    if (game.ship.alive)
        window.requestAnimationFrame(loop);
    else
        console.log(`Brain has died and achieved a fitness of: ${brain.fitness}`);
}
loop();
//# sourceMappingURL=index.js.map