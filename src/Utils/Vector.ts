/**
 * TODO
 */
class Vector {
  x: number
  y: number

  /**
   * TODO
   * @param x 
   * @param y 
   */
  constructor(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }

  /**
   * TODO
   * @param v 
   * @returns 
   */
  add(v: Vector): Vector {
    return new Vector(this.x + v.x, this.y + v.y)
  }

  /**
   * TODO
   */
  sub(v: Vector): Vector {
    return new Vector(this.x - v.x, this.y - v.y)
  }

  /**
   * TODO
   * @param a 
   * @returns 
   */
  scale(a: number): Vector {
    return new Vector(a * this.x, a * this.y)
  }

  /**
   * TODO
   */
  *[Symbol.iterator]() {
    yield this.x
    yield this.y
  }

  /**
   * TODO
   * @returns 
   */
  mag(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  /**
   * TODO
   * @returns 
   */
  normal(): Vector {
    return this.scale(1 / this.mag())
  }

  /**
   * TODO
   * @returns 
   */
  angle(): number {
    return Math.atan2(this.y, this.x)
  }

  /**
   * TODO
   * @param theta 
   * @returns 
   */
  static FromAngle(theta: number): Vector {
    return new Vector(Math.cos(theta), Math.sin(theta))
  }

  /**
   * TODO
   * @param p1 
   * @param p2 
   * @param p3 
   * @returns 
   */
  static Sign(p1: Vector, p2: Vector, p3: Vector): number {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y)
  }

  /**
   * TODO
   * @param p1 
   * @param p2 
   * @param p3 
   * @returns 
   */
  insideTriangle(p1: Vector, p2: Vector, p3: Vector): boolean {
    let d1 = Vector.Sign(this, p1, p2)
    let d2 = Vector.Sign(this, p2, p3)
    let d3 = Vector.Sign(this, p3, p1)
    let hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0)
    let hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0)
    return !(hasNeg && hasPos)
  }

  /**
   * TODO
   * @param v 
   * @returns 
   */
  distanceTo(v: Vector): number {
    return v.sub(this).mag()
  }
}