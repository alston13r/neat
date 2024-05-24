class Vector {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  add(v) {
    return new Vector(this.x + v.x, this.y + v.y)
  }

  sub(v) {
    return new Vector(this.x - v.x, this.y - v.y)
  }

  scale(a) {
    return new Vector(a * this.x, a * this.y)
  }

  *[Symbol.iterator]() {
    yield this.x
    yield this.y
  }

  /**
   * @returns {number}
   */
  mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  /**
   * @returns {Vector}
   */
  normal() {
    return this.scale(1 / this.mag())
  }

  /**
   * @returns {number}
   */
  angle() {
    return Math.atan2(this.y, this.x)
  }

  /**
   * @param {number} theta 
   * @returns {Vector}
   */
  static FromAngle(theta) {
    return new Vector(Math.cos(theta), Math.sin(theta))
  }

  /**
   * @param {Vector} p1 
   * @param {Vector} p2 
   * @param {Vector} p3 
   * @returns {number}
   */
  static Sign(p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y)
  }

  /**
   * @param {Vector} p1 
   * @param {Vector} p2 
   * @param {Vector} p3 
   * @returns {boolean}
   */
  insideTriangle(p1, p2, p3) {
    let d1 = Vector.Sign(this, p1, p2)
    let d2 = Vector.Sign(this, p2, p3)
    let d3 = Vector.Sign(this, p3, p1)
    let hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0)
    let hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0)
    return !(hasNeg && hasPos)
  }

  /**
   * @param {Vector} v 
   * @returns {number}
   */
  distanceTo(v) {
    return v.sub(this).mag()
  }
}

function gauss() {
  let s = 0
  for (let i = 0; i < 6; i++) {
    s += Math.random()
  }
  return s / 6
}

/**
 * @param {object[]} items 
 * @param {string} param 
 * @param {number} count 
 * @returns 
 */
function rouletteWheel(items, param, count) {
  if (count == 0) return []
  const list = items.map(item => { return { item } })
  const max = list.reduce((sum, curr) => {
    curr.sum = sum + curr.item[param]
    return curr.sum
  }, 0)
  const res = new Array(count).fill(0).map(() => {
    const value = Math.random() * max
    for (let x of list) {
      if (value < x.sum) return x.item
    }
  })
  return res
}