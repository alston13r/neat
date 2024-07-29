const raycastingGraphics = new Graphics().setSize(800, 600).appendToBody();
const raycastingDrawQueue = raycastingGraphics.initDrawQueue('#fff', false, true, 1);
const particle = new Particle();
const walls = [];
const circles = [];
for (let i = 0; i < 5; i++) {
    const x1 = Math.random() * raycastingGraphics.width;
    const y1 = Math.random() * raycastingGraphics.height;
    const x2 = Math.random() * raycastingGraphics.width;
    const y2 = Math.random() * raycastingGraphics.height;
    walls[i] = new Line(x1, y1, x2, y2);
}
for (let i = 0; i < 5; i++) {
    const x = Math.random() * raycastingGraphics.width;
    const y = Math.random() * raycastingGraphics.height;
    const r = Math.random() * 20 + 5;
    circles[i] = new Circle(x, y, r);
}
const objects = walls.concat(circles);
let mouseX = 400;
let mouseY = 300;
raycastingGraphics.canvas.addEventListener('mousemove', e => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
});
raycastingGraphics.strokeStyle = '#fff';
function raycastLoop() {
    raycastingGraphics.bg();
    for (const wall of walls) {
        wall.stroke(raycastingGraphics);
    }
    for (const circle of circles) {
        circle.stroke(raycastingGraphics);
    }
    particle.update(mouseX, mouseY);
    particle.draw(raycastingGraphics);
    particle.look(raycastingGraphics, objects);
    window.requestAnimationFrame(raycastLoop);
}
window.requestAnimationFrame(raycastLoop);
//# sourceMappingURL=index.js.map