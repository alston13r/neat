// const asteroidsGraphics: Graphics = new Graphics().setSize(800, 600).appendToBody()
// const asteroidsGame: DeltaTimeAsteroids = new DeltaTimeAsteroids()
// asteroidsGame.setGraphics(asteroidsGraphics)
// let lastDeltaTimeTimestamp: number = 0
// function deltaTimeLoop(timestamp?: number): void {
//   const deltaTime: number = timestamp - lastDeltaTimeTimestamp
//   lastDeltaTimeTimestamp = timestamp
//   asteroidsGame.draw()
//   asteroidsGraphics.createText(deltaTime.toString(), 5, 5, '#fff', 20, 'left', 'top').draw()
//   window.requestAnimationFrame(deltaTimeLoop)
// }
// window.requestAnimationFrame(deltaTimeLoop)
const tempGraphics = new Graphics().setSize(800, 600).appendToBody();
let tempDeltaTimestamp = 0;
function deltaTimeLoop(timestamp) {
    const delta = timestamp - tempDeltaTimestamp;
    tempDeltaTimestamp = timestamp;
    tempGraphics.bg();
    tempGraphics.createText(delta.toString(), 5, 5, { baseline: 'top', align: 'left' });
    window.requestAnimationFrame(deltaTimeLoop);
}
window.requestAnimationFrame(deltaTimeLoop);
//# sourceMappingURL=index.js.map