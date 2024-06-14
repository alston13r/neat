class Particle implements Drawable {
  static NumLines: number = 36

  pos: Vector
  rays: Ray[]

  graphics: Graphics

  constructor() {
    this.pos = new Vector(raycastingGraphics.width / 2, raycastingGraphics.height / 2)
    this.rays = []
    for (let i = 0; i < Particle.NumLines; i++) {
      this.rays[i] = new Ray(this.pos, lerp(i, 0, Particle.NumLines, 0, 2 * Math.PI))
    }
  }

  setGraphics(graphics: Graphics): Particle {
    this.graphics = graphics
    for (const ray of this.rays) {
      ray.setGraphics(graphics)
    }
    return this
  }

  update(x: number, y: number): void {
    this.pos.x = x
    this.pos.y = y
  }

  look(walls: Line[]): void {
    for (let ray of this.rays) {
      let closest: Vector
      let record: number = Infinity
      for (let wall of walls) {
        const point: Vector = ray.castOntoLine(wall)
        if (point) {
          const d: number = this.pos.distanceTo(point)
          if (d < record) {
            record = d
            closest = point
          }
        }
      }
      if (closest) {
        this.graphics.createLine(this.pos.x, this.pos.y, closest.x, closest.y, '#fff').draw()
      }
    }
  }

  draw(): void {
    this.graphics.createCircle(this.pos.x, this.pos.y, 8, true, '#fff').draw()
    for (let ray of this.rays) {
      ray.draw()
    }
  }
}