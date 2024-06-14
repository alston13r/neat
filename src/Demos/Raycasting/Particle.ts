class Particle {
  static NumLines: number = 36

  pos: Vector
  rays: Ray[]

  constructor() {
    this.pos = new Vector(raycastingGraphics.width / 2, raycastingGraphics.height / 2)
    this.rays = []
    for (let i = 0; i < Particle.NumLines; i++) {
      this.rays[i] = new Ray(this.pos, lerp(i, 0, Particle.NumLines, 0, 2 * Math.PI))
    }
  }

  update(x: number, y: number): void {
    this.pos.x = x
    this.pos.y = y
  }

  look(walls: Boundary[]): void {
    for (let ray of this.rays) {
      let closest: Vector
      let record: number = Infinity
      for (let wall of walls) {
        const pt: Vector = ray.cast(wall)
        if (pt) {
          const d: number = this.pos.distanceTo(pt)
          if (d < record) {
            record = d
            closest = pt
          }
        }
      }
      if (closest) {
        raycastingGraphics.createLine(this.pos.x, this.pos.y, closest.x, closest.y, '#fff').draw()
      }
    }
  }

  draw(): void {
    raycastingGraphics.createCircle(this.pos.x, this.pos.y, 8, true, '#fff').draw()
    for (let ray of this.rays) {
      ray.draw()
    }
  }
}