/// <reference path="../../utils/drawing/graphics.ts" />

class Particle implements Drawable {
  static NumLines: number = 360

  pos: Vec2
  rays: Ray2[]

  constructor() {
    this.pos = vec2.fromValues(raycastingGraphics.width / 2, raycastingGraphics.height / 2)
    this.rays = []
    for (let i = 0; i < Particle.NumLines; i++) {
      this.rays[i] = new Ray2(this.pos, lerp(i, 0, Particle.NumLines, 0, 2 * Math.PI))
    }
  }

  update(x: number, y: number): void {
    vec2.set(this.pos, x, y)
  }

  look(g: Graphics, objects: (Line | Circle)[]): void {
    for (const ray of this.rays) {
      let closest: Vec2
      let record = Infinity
      for (const object of objects) {
        let point: Vec2
        if (object instanceof Line) {
          point = ray.castOntoLine(object)
        }
        else if (object instanceof Circle) {
          point = ray.castOntoCircle(object)
        }
        if (point) {
          const distance = vec2.distance(this.pos, point)
          if (distance < record) {
            record = distance
            closest = point
          }
        }
      }
      if (closest) {
        g.line(this.pos[0], this.pos[1], closest[0], closest[1])
      }
    }
  }

  lookLines(g: Graphics, walls: Line[]): void {
    for (const ray of this.rays) {
      let closest: Vec2
      let record = Infinity
      for (const wall of walls) {
        const point = ray.castOntoLine(wall)
        if (point) {
          const d = vec2.distance(this.pos, point)
          if (d < record) {
            record = d
            closest = point
          }
        }
      }
      if (closest) {
        g.line(this.pos[0], this.pos[1], closest[0], closest[1])
      }
    }
  }

  lookCircles(g: Graphics, circles: Circle[]): void {
    for (const ray of this.rays) {
      let closest: Vec2
      let record = Infinity
      for (const circle of circles) {
        const point = ray.castOntoCircle(circle)
        if (point) {
          const d = vec2.distance(this.pos, point)
          if (d < record) {
            record = d
            closest = point
          }
        }
      }
      if (closest) {
        g.line(this.pos[0], this.pos[1], closest[0], closest[1])
      }
    }
  }

  draw(g: Graphics): void {
    g.fillStyle = '#fff'
    g.fillCircle(this.pos[0], this.pos[1], 8)
    for (let ray of this.rays) {
      ray.draw(g)
    }
  }
}

const raycastingGraphics = new Graphics(document.getElementById('mainCanvas') as HTMLCanvasElement).setSize(800, 600)

const particle = new Particle()

const walls: Line[] = []
const circles: Circle[] = []

for (let i = 0; i < 5; i++) {
  const x1 = Math.random() * raycastingGraphics.width
  const y1 = Math.random() * raycastingGraphics.height
  const x2 = Math.random() * raycastingGraphics.width
  const y2 = Math.random() * raycastingGraphics.height
  walls[i] = new Line(x1, y1, x2, y2)
}

for (let i = 0; i < 5; i++) {
  const x = Math.random() * raycastingGraphics.width
  const y = Math.random() * raycastingGraphics.height
  const r = Math.random() * 20 + 5
  circles[i] = new Circle(x, y, r)
}

const objects: (Line | Circle)[] = (walls as any[]).concat(circles)

let mouseX = 400
let mouseY = 300

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