const raycastingGraphics = new Graphics().setSize(800, 600).appendToBody();
const particle = new Particle(raycastingGraphics);
const walls = [];
const circles = [];
for (let i = 0; i < 5; i++) {
    const x1 = Math.random() * raycastingGraphics.width;
    const y1 = Math.random() * raycastingGraphics.height;
    const x2 = Math.random() * raycastingGraphics.width;
    const y2 = Math.random() * raycastingGraphics.height;
    walls[i] = raycastingGraphics.createLine(x1, y1, x2, y2, '#fff');
}
for (let i = 0; i < 5; i++) {
    const x = Math.random() * raycastingGraphics.width;
    const y = Math.random() * raycastingGraphics.height;
    const r = Math.random() * 20 + 5;
    circles[i] = raycastingGraphics.createCircle(x, y, r, false, '#fff', true);
}
const objects = walls.concat(circles);
let mouseX = 400;
let mouseY = 300;
window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
function raycastLoop() {
    raycastingGraphics.bg();
    for (const wall of walls) {
        wall.draw();
    }
    for (const circle of circles) {
        circle.draw();
    }
    particle.update(mouseX, mouseY);
    particle.draw();
    particle.look(objects);
    window.requestAnimationFrame(raycastLoop);
}
raycastLoop();
//# sourceMappingURL=index.js.map