const raycastingGraphics = new Graphics().setSize(800, 600).appendToBody();
let particle = new Particle().setGraphics(raycastingGraphics);
const walls = [];
for (let i = 0; i < 5; i++) {
    const x1 = Math.random() * raycastingGraphics.width;
    const y1 = Math.random() * raycastingGraphics.height;
    const x2 = Math.random() * raycastingGraphics.width;
    const y2 = Math.random() * raycastingGraphics.height;
    walls[i] = raycastingGraphics.createLine(x1, y1, x2, y2, '#fff');
}
let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
function raycastLoop() {
    raycastingGraphics.bg();
    for (let wall of walls) {
        wall.draw();
    }
    particle.update(mouseX, mouseY);
    particle.draw();
    particle.look(walls);
    window.requestAnimationFrame(raycastLoop);
}
raycastLoop();
//# sourceMappingURL=index.js.map