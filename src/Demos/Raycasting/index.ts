const raycastingGraphics: Graphics = new Graphics().setSize(800, 600).appendToBody()

let particle = new Particle().setGraphics(raycastingGraphics)

const walls: Line[] = []

for (let i = 0; i < 5; i++) {
  const x1: number = Math.random() * raycastingGraphics.width
  const y1: number = Math.random() * raycastingGraphics.height
  const x2: number = Math.random() * raycastingGraphics.width
  const y2: number = Math.random() * raycastingGraphics.height
  walls[i] = raycastingGraphics.createLine(x1, y1, x2, y2, '#fff')
}

let mouseX: number = 0
let mouseY: number = 0

window.addEventListener('mousemove', e => {
  mouseX = e.clientX
  mouseY = e.clientY
})

function raycastLoop() {
  raycastingGraphics.bg()
  for (let wall of walls) {
    wall.draw()
  }
  particle.update(mouseX, mouseY)
  particle.draw()
  particle.look(walls)
  window.requestAnimationFrame(raycastLoop)
}

raycastLoop()