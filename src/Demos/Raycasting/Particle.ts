class Particle implements Drawable {
  static NumLines: number = 360

  pos: Vector
  rays: Ray[]

  graphics: Graphics

  constructor(graphics: Graphics) {
    this.graphics = graphics
    this.pos = new Vector(graphics.width / 2, graphics.height / 2)
    this.rays = []
    for (let i = 0; i < Particle.NumLines; i++) {
      this.rays[i] = new Ray(this.pos, lerp(i, 0, Particle.NumLines, 0, 2 * Math.PI)).setGraphics(graphics)
    }
  }

  update(x: number, y: number): void {
    this.pos.x = x
    this.pos.y = y
  }

  look(objects: (Line | Circle)[]): void {
    for (const ray of this.rays) {
      let closest: Vector
      let record: number = Infinity
      for (const object of objects) {
        let point: Vector
        if (object instanceof Line) {
          point = ray.castOntoLine(object)
        }
        else if (object instanceof Circle) {
          point = ray.castOntoCircle(object)
        }
        if (point) {
          const distance: number = this.pos.distanceTo(point)
          if (distance < record) {
            record = distance
            closest = point
          }
        }
      }
      if (closest) {
        this.graphics.createLine(this.pos.x, this.pos.y, closest.x, closest.y, { color: '#fff' }).draw()
      }
    }
  }

  lookLines(walls: Line[]): void {
    for (const ray of this.rays) {
      let closest: Vector
      let record: number = Infinity
      for (const wall of walls) {
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
        this.graphics.createLine(this.pos.x, this.pos.y, closest.x, closest.y, { color: '#fff' }).draw()
      }
    }
  }

  lookCircles(circles: Circle[]): void {
    for (const ray of this.rays) {
      let closest: Vector
      let record: number = Infinity
      for (const circle of circles) {
        const point: Vector = ray.castOntoCircle(circle)
        if (point) {
          const d: number = this.pos.distanceTo(point)
          if (d < record) {
            record = d
            closest = point
          }
        }
      }
      if (closest) {
        this.graphics.createLine(this.pos.x, this.pos.y, closest.x, closest.y, { color: '#fff' }).draw()
      }
    }
  }

  draw(): void {
    this.graphics.createCircle(this.pos.x, this.pos.y, 8).draw()
    for (let ray of this.rays) {
      ray.draw()
    }
  }
}