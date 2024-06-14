const raycastingGraphics = new Graphics().setSize(800, 600).appendToBody();
let wall = new Boundary(100, 100, 200, 300);
let particle = new Particle();
let walls = [];
for (let i = 0; i < 5; i++) {
    const x1 = Math.random() * raycastingGraphics.width;
    const y1 = Math.random() * raycastingGraphics.height;
    const x2 = Math.random() * raycastingGraphics.width;
    const y2 = Math.random() * raycastingGraphics.height;
    walls[i] = new Boundary(x1, y1, x2, y2);
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
    // const pt: Vector = ray.cast(wall)
    // if (pt) {
    // raycastingGraphics.createCircle(pt.x, pt.y, 4, true, '#fff').draw()
    // }
    window.requestAnimationFrame(raycastLoop);
}
raycastLoop();
//# sourceMappingURL=index.js.map