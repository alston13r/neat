const asteroidsGraphics = new Graphics().setSize(800, 600).appendToBody();
const asteroidsGame = new DeltaTimeAsteroids();
asteroidsGame.setGraphics(asteroidsGraphics);
let lastDeltaTimeTimestamp = 0;
function deltaTimeLoop(timestamp) {
    const deltaTime = timestamp - lastDeltaTimeTimestamp;
    lastDeltaTimeTimestamp = timestamp;
    asteroidsGame.draw();
    asteroidsGraphics.createText(deltaTime.toString(), 5, 5, '#fff', 20, 'left', 'top').draw();
    window.requestAnimationFrame(deltaTimeLoop);
}
window.requestAnimationFrame(deltaTimeLoop);
//# sourceMappingURL=index.js.map