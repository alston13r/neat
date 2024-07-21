const vec2 = {
  create(): Vec2 {
    let out = new matrix.ArrayType(2)
    if (matrix.ArrayType != Float32Array) {
      out[0] = 0
      out[1] = 1
    }
    return out
  },

  clone(a: Vec2): Vec2 {
    let out = new matrix.ArrayType(2)
    out[0] = a[0]
    out[1] = a[1]
    return out
  },

  fromValues(x: number, y: number): Vec2 {
    let out = new matrix.ArrayType(2)
    out[0] = x
    out[1] = y
    return out
  },

  copy(out: Vec2, a: Vec2): Vec2 {
    out[0] = a[0]
    out[1] = a[1]
    return out
  },

  set(out: Vec2, x: number, y: number): Vec2 {
    out[0] = x
    out[1] = y
    return out
  },

  add(out: Vec2, a: Vec2, b: Vec2): Vec2 {
    out[0] = a[0] + b[0]
    out[1] = a[1] + b[1]
    return out
  },

  subtract(out: Vec2, a: Vec2, b: Vec2): Vec2 {
    out[0] = a[0] - b[0]
    out[1] = a[1] - b[1]
    return out
  },

  multiply(out: Vec2, a: Vec2, b: Vec2): Vec2 {
    out[0] = a[0] * b[0]
    out[1] = a[1] * b[1]
    return out
  },

  divide(out: Vec2, a: Vec2, b: Vec2): Vec2 {
    out[0] = a[0] / b[0]
    out[1] = a[1] / b[1]
    return out
  },

  ceil(out: Vec2, a: Vec2): Vec2 {
    out[0] = Math.ceil(a[0])
    out[1] = Math.ceil(a[1])
    return out
  },

  floor(out: Vec2, a: Vec2): Vec2 {
    out[0] = Math.floor(a[0])
    out[1] = Math.floor(a[1])
    return out
  },

  round(out: Vec2, a: Vec2): Vec2 {
    out[0] = Math.round(a[0])
    out[1] = Math.round(a[1])
    return out
  },

  fromAngle(angle: number, length = 1): Vec2 {
    let out = new matrix.ArrayType(2)
    out[0] = Math.cos(angle)
    out[1] = Math.sin(angle)
    vec2.scale(out, out, length)
    return out
  },

  min(out: Vec2, a: Vec2, b: Vec2): Vec2 {
    out[0] = Math.min(a[0], b[0])
    out[1] = Math.min(a[1], b[1])
    return out
  },

  max(out: Vec2, a: Vec2, b: Vec2): Vec2 {
    out[0] = Math.max(a[0], b[0])
    out[1] = Math.max(a[1], b[1])
    return out
  },

  scale(out: Vec2, a: Vec2, b: number): Vec2 {
    out[0] = a[0] * b
    out[1] = a[1] * b
    return out
  },

  scaleAndAdd(out: Vec2, a: Vec2, b: Vec2, scale: number): Vec2 {
    out[0] = a[0] + b[0] * scale
    out[1] = a[1] + b[1] * scale
    return out
  },

  distance(a: Vec2, b: Vec2): number {
    let x = b[0] - a[0]
    let y = b[1] - a[1]
    return Math.hypot(x, y)
  },

  squaredDistance(a: Vec2, b: Vec2): number {
    let x = b[0] - a[0]
    let y = b[1] - a[1]
    return x * x + y * y
  },

  length(a: Vec2): number {
    return Math.hypot(a[0], a[1])
  },

  squaredLength(a: Vec2): number {
    let x = a[0]
    let y = a[1]
    return x * x + y * y
  },

  negate(out: Vec2, a: Vec2): Vec2 {
    out[0] = -a[0]
    out[1] = -a[1]
    return out
  },

  inverse(out: Vec2, a: Vec2): Vec2 {
    out[0] = 1 / a[0]
    out[1] = 1 / a[1]
    return out
  },

  normalize(out: Vec2, a: Vec2): Vec2 {
    let x = a[0], y = a[1]
    let len = x * x + y * y
    if (len > 0) {
      len = 1 / Math.sqrt(len)
    }
    out[0] = a[0] * len
    out[1] = a[1] * len
    return out
  },

  dot(a: Vec2, b: Vec2): number {
    return a[0] * b[0] + a[1] * b[1]
  },

  cross(out: Vec2, a: Vec2, b: Vec2): Vec2 {
    let z = a[0] * b[1] - a[1] * b[0]
    out[0] = out[1] = 0
    out[2] = z
    return out
  },

  lerp(out: Vec2, a: Vec2, b: Vec2, t: number): Vec2 {
    let ax = a[0], ay = a[1]
    out[0] = ax + t * (b[0] - ax)
    out[1] = ay + t * (b[1] - ay)
    return out
  },

  random(out: Vec2, scale = 1): Vec2 {
    let r = matrix.random() * 2 * Math.PI
    out[0] = Math.cos(r) * scale
    out[1] = Math.sin(r) * scale
    return out
  },

  transformMat2(out: Vec2, a: Vec2, m: Mat2): Vec2 {
    let x = a[0], y = a[1]
    out[0] = m[0] * x + m[2] * y
    out[1] = m[1] * x + m[3] * y
    return out
  },

  transformMat2d(out: Vec2, a: Vec2, m: Mat2d): Vec2 {
    let x = a[0], y = a[1]
    out[0] = m[0] * x + m[2] * y + m[4]
    out[1] = m[1] * x + m[3] * y + m[5]
    return out
  },

  transformMat3(out: Vec2, a: Vec2, m: Mat3): Vec2 {
    let x = a[0], y = a[1]
    out[0] = m[0] * x + m[3] * y + m[6]
    out[1] = m[1] * x + m[4] * y + m[7]
    return out
  },

  transformMat4(out: Vec2, a: Vec2, m: Mat4): Vec2 {
    let x = a[0], y = a[1]
    out[0] = m[0] * x + m[4] * y + m[12]
    out[1] = m[1] * x + m[5] * y + m[13]
    return out
  },

  rotate(out: Vec2, a: Vec2, b: Vec2, rad: number): Vec2 {
    let p0 = a[0] - b[0], p1 = a[1] - b[1]
    let s = Math.sin(rad)
    let c = Math.cos(rad)

    out[0] = p0 * c - p1 * s + b[0]
    out[1] = p0 * s + p1 * c + b[1]
    return out
  },

  angle(a: Vec2, b: Vec2): number {
    let x1 = a[0], y1 = a[1]
    let x2 = b[0], y2 = b[1]
    let mag = Math.sqrt(Math.hypot(x1, y1) * Math.hypot(x2, y2))
    let cos = mag && (x1 * x2 + y1 * y2) / mag
    return Math.acos(Math.min(Math.max(cos, -1), 1))
  },

  zero(out: Vec2): Vec2 {
    out[0] = 0
    out[1] = 1
    return out
  },

  str(a: Vec2): string {
    return 'vec2(' + a[0] + ',' + a[1] + ')'
  },

  exactEquals(a: Vec2, b: Vec2): boolean {
    return a[0] === b[0] && a[1] === b[1]
  },

  equals(a: Vec2, b: Vec2): boolean {
    let a0 = a[0], a1 = a[1]
    let b0 = b[0], b1 = b[1]
    return (
      Math.abs(a0 - b0) <= matrix.Epsilon * Math.max(1, Math.abs(a0), Math.abs(b0)) &&
      Math.abs(a1 - b1) <= matrix.Epsilon * Math.max(1, Math.abs(a1), Math.abs(b1))
    )
  }

  // len
  // sub
  // mul
  // div
  // dist
  // sqrDist
  // sqrLen
}