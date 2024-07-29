const raycastingGraphics: Graphics = new Graphics().setSize(800, 600).appendToBody()
const raycastingDrawQueue = raycastingGraphics.initDrawQueue('#fff', false, true, 1)

const particle = new Particle()

const walls: Line[] = []
const circles: Circle[] = []

for (let i = 0; i < 5; i++) {
  const x1: number = Math.random() * raycastingGraphics.width
  const y1: number = Math.random() * raycastingGraphics.height
  const x2: number = Math.random() * raycastingGraphics.width
  const y2: number = Math.random() * raycastingGraphics.height
  walls[i] = new Line(x1, y1, x2, y2)
}

for (let i = 0; i < 5; i++) {
  const x: number = Math.random() * raycastingGraphics.width
  const y: number = Math.random() * raycastingGraphics.height
  const r: number = Math.random() * 20 + 5
  circles[i] = new Circle(x, y, r)
}

const objects: (Line | Circle)[] = (walls as any[]).concat(circles)

let mouseX: number = 400
let mouseY: number = 300

raycastingGraphics.canvas.addEventListener('mousemove', e => {
  mouseX = e.offsetX
  mouseY = e.offsetY
})

raycastingGraphics.strokeStyle = '#fff'

function raycastLoop() {
  raycastingGraphics.bg()
  for (const wall of walls) {
    wall.stroke(raycastingGraphics)
  }
  for (const circle of circles) {
    circle.stroke(raycastingGraphics)
  }
  particle.update(mouseX, mouseY)
  particle.draw(raycastingGraphics)
  particle.look(raycastingGraphics, objects)
  window.requestAnimationFrame(raycastLoop)
}

window.requestAnimationFrame(raycastLoop)