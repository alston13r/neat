class Vector {
  x: number
  y: number

  constructor(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }

  static Add(a: Vector, b: Vector): Vector {
    a.x += b.x
    a.y += b.y
    return a
  }

  add(v: Vector): Vector {
    return new Vector(this.x + v.x, this.y + v.y)
  }

  static Sub(a: Vector, b: Vector): Vector {
    a.x -= b.x
    a.y -= b.y
    return a
  }

  sub(v: Vector): Vector {
    return new Vector(this.x - v.x, this.y - v.y)
  }

  static Scale(v: Vector, s: number): Vector {
    v.x *= s
    v.y *= s
    return v
  }

  scale(a: number): Vector {
    return new Vector(a * this.x, a * this.y)
  }

  *[Symbol.iterator]() {
    yield this.x
    yield this.y
  }

  mag(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  static Normal(v: Vector): Vector {
    return Vector.Scale(v, 1 / v.mag())
  }

  normal(): Vector {
    return this.scale(1 / this.mag())
  }

  angle(): number {
    return Math.atan2(this.y, this.x)
  }

  static FromAngle(theta: number): Vector {
    return new Vector(Math.cos(theta), Math.sin(theta))
  }

  static Sign(p1: Vector, p2: Vector, p3: Vector): number {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y)
  }

  insideTriangle(p1: Vector, p2: Vector, p3: Vector): boolean {
    let d1 = Vector.Sign(this, p1, p2)
    let d2 = Vector.Sign(this, p2, p3)
    let d3 = Vector.Sign(this, p3, p1)
    let hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0)
    let hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0)
    return !(hasNeg && hasPos)
  }

  distanceTo(v: Vector): number {
    return v.sub(this).mag()
  }

  copy(): Vector {
    return new Vector(this.x, this.y)
  }

  createRay(angle: number = 0): Ray {
    return new Ray(this, angle)
  }

  toXY(): [number, number] {
    return [this.x, this.y]
  }

  static CopyFrom(vector: Vector, target: Vector): Vector {
    vector.x = target.x
    vector.y = target.y
    return vector
  }
}