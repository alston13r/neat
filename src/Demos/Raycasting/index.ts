const raycastingGraphics: Graphics = new Graphics().setSize(800, 600).appendToBody()

const particle = new Particle(raycastingGraphics)

const walls: Line[] = []
const circles: Circle[] = []

for (let i = 0; i < 5; i++) {
  const x1: number = Math.random() * raycastingGraphics.width
  const y1: number = Math.random() * raycastingGraphics.height
  const x2: number = Math.random() * raycastingGraphics.width
  const y2: number = Math.random() * raycastingGraphics.height
  walls[i] = raycastingGraphics.createLine(x1, y1, x2, y2, { color: '#fff' })
}

for (let i = 0; i < 5; i++) {
  const x: number = Math.random() * raycastingGraphics.width
  const y: number = Math.random() * raycastingGraphics.height
  const r: number = Math.random() * 20 + 5
  circles[i] = raycastingGraphics.createCircle(x, y, r, { stroke: true, fill: false })
}

const objects: (Line | Circle)[] = (walls as any[]).concat(circles)

let mouseX: number = 400
let mouseY: number = 300

window.addEventListener('mousemove', e => {
  mouseX = e.clientX
  mouseY = e.clientY
})

function raycastLoop() {
  raycastingGraphics.bg()
  for (const wall of walls) {
    wall.draw()
  }
  for (const circle of circles) {
    circle.draw()
  }
  particle.update(mouseX, mouseY)
  particle.draw()
  particle.look(objects)
  window.requestAnimationFrame(raycastLoop)
}

raycastLoop()