
// floor(out, a) → { vec3 }
// forEach(a, stride, offset, count, fn, argopt) → { Array }
// fromValues(x, y, z) → { vec3 }


const vec3 = {
  add(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3 {
    out[0] = a[0] + b[0]
    out[1] = a[1] + b[1]
    out[2] = a[2] + b[2]
    return out
  },

  angle(a: ReadonlyVec3, b: ReadonlyVec3): number {
    let ax = a[0], ay = a[1], az = a[2]
    let bx = b[0], by = b[1], bz = b[2]
    let mag = Math.sqrt((ax * ax + ay * ay + az * az) * (bx * bx + by * by + bz * bz))
    let c = mag && vec3.dot(a, b) / mag
    return Math.acos(Math.min(Math.max(c, -1), 1))
  },

  bezier(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, c: ReadonlyVec3, d: ReadonlyVec3, t: number): Vec3 {
    let inverseFactor = 1 - t
    let inverseFactorTimesTwo = inverseFactor * inverseFactor
    let factorTimesTwo = t * t
    let factor1 = inverseFactorTimesTwo * inverseFactor
    let factor2 = 3 * t * inverseFactorTimesTwo
    let factor3 = 3 * factorTimesTwo * inverseFactor
    let factor4 = factorTimesTwo * t

    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4
    return out
  },

  ceil(out: Vec3, a: ReadonlyVec3): Vec3 {
    out[0] = Math.ceil(a[0])
    out[1] = Math.ceil(a[1])
    out[2] = Math.ceil(a[2])
    return out
  },

  clone(a: ReadonlyVec3): Vec3 {
    let out = new matrix.ArrayType(3)
    out[0] = a[0]
    out[1] = a[1]
    out[2] = a[2]
    return out
  },

  copy(out: Vec3, a: ReadonlyVec3): Vec3 {
    out[0] = a[0]
    out[1] = a[1]
    out[2] = a[2]
    return out
  },

  create(): Vec3 {
    let out = new matrix.ArrayType(3)
    if (matrix.ArrayType != Float32Array) {
      out[0] = 0
      out[1] = 0
      out[2] = 0
    }
    return out
  },

  cross(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3 {
    let ax = a[0], ay = a[1], az = a[2]
    let bx = b[0], by = b[1], bz = b[2]
    out[0] = ay * bz - az * by
    out[1] = az * bx - ax * bz
    out[2] = ax * by - ay * bx
    return out
  },

  distance(a: ReadonlyVec3, b: ReadonlyVec3): number {
    let x = b[0] - a[0]
    let y = b[1] - a[1]
    let z = b[2] - a[2]
    return Math.hypot(x, y, z)
  },

  divide(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3 {
    out[0] = a[0] / b[0]
    out[1] = a[1] / b[1]
    out[2] = a[2] / b[2]
    return out
  },

  dot(a: ReadonlyVec3, b: ReadonlyVec3): number {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  },

  equals(a: ReadonlyVec3, b: ReadonlyVec3): boolean {
    let a0 = a[0], a1 = a[1], a2 = a[2]
    let b0 = b[0], b1 = b[1], b2 = b[2]
    return (
      Math.abs(a0 - b0) <= matrix.Epsilon * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
      Math.abs(a1 - b1) <= matrix.Epsilon * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
      Math.abs(a2 - b2) <= matrix.Epsilon * Math.max(1.0, Math.abs(a2), Math.abs(b2))
    )
  },

  exactEquals(a: ReadonlyVec3, b: ReadonlyVec3): boolean {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
  },

  floor(out: Vec3, a: ReadonlyVec3): Vec3 {
    out[0] = Math.floor(a[0])
    out[1] = Math.floor(a[1])
    out[2] = Math.floor(a[2])
    return out
  },

  fromValues(x: number, y: number, z: number): Vec3 {
    let out = new matrix.ArrayType(3)
    out[0] = x
    out[1] = y
    out[2] = z
    return out
  },

  hermite(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, c: ReadonlyVec3, d: ReadonlyVec3, t: number): Vec3 {
    let factorTimesTwo = t * t
    let factor1 = factorTimesTwo * (2 * t - 3) + 1
    let factor2 = factorTimesTwo * (t - 2) + t
    let factor3 = factorTimesTwo * (t - 1)
    let factor4 = factorTimesTwo * (3 - 2 * t)

    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4
    return out
  },

  inverse(out: Vec3, a: ReadonlyVec3): Vec3 {
    out[0] = 1 / a[0]
    out[1] = 1 / a[1]
    out[2] = 1 / a[2]
    return out
  },

  length(a: ReadonlyVec3): number {
    let x = a[0]
    let y = a[1]
    let z = a[2]
    return Math.hypot(x, y, z)
  },

  lerp(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, t: number): Vec3 {
    let ax = a[0], ay = a[1], az = a[2]
    out[0] = ax + t * (b[0] - ax)
    out[1] = ay + t * (b[1] - ay)
    out[2] = az + t * (b[2] - az)
    return out
  },

  max(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3 {
    out[0] = Math.max(a[0], b[0])
    out[1] = Math.max(a[1], b[1])
    out[2] = Math.max(a[2], b[2])
    return out
  },

  min(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3 {
    out[0] = Math.min(a[0], b[0])
    out[1] = Math.min(a[1], b[1])
    out[2] = Math.min(a[2], b[2])
    return out
  },

  multiply(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3 {
    out[0] = a[0] * b[0]
    out[1] = a[1] * b[1]
    out[2] = a[2] * b[2]
    return out
  },

  negate(out: Vec3, a: ReadonlyVec3): Vec3 {
    out[0] = -a[0]
    out[1] = -a[1]
    out[2] = -a[2]
    return out
  },

  normalize(out: Vec3, a: ReadonlyVec3): Vec3 {
    let x = a[0], y = a[1], z = a[2]
    let len = x * x + y * y + z * z
    if (len > 0) {
      len = 1 / Math.sqrt(len)
    }
    out[0] = a[0] * len
    out[1] = a[1] * len
    out[2] = a[2] * len
    return out
  },

  random(out: Vec3, scale: number = 1): Vec3 {
    let r = matrix.random() * 2 * Math.PI
    let z = matrix.random() * 2 - 1
    let zScale = Math.sqrt(1 - z * z) * scale
    out[0] = Math.cos(r) * zScale
    out[1] = Math.sin(r) * zScale
    out[2] = z * scale
    return out
  },

  rotateX(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, rad: number): Vec3 {
    let p: Vec3 = [], r: Vec3 = []
    let s = Math.sin(rad)
    let c = Math.cos(rad)

    p[0] = a[0] - b[0]
    p[1] = a[1] - b[1]
    p[2] = a[2] - b[2]
    r[0] = p[0]
    r[1] = p[1] * c - p[2] * s
    r[2] = p[1] * s + p[2] * c

    out[0] = r[0] + b[0]
    out[1] = r[1] + b[1]
    out[2] = r[2] + b[2]
    return out
  },

  rotateY(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, rad: number): Vec3 {
    let p: Vec3 = [], r: Vec3 = []
    let s = Math.sin(rad)
    let c = Math.cos(rad)

    p[0] = a[0] - b[0]
    p[1] = a[1] - b[1]
    p[2] = a[2] - b[2]
    r[0] = p[2] * s + p[0] * c
    r[1] = p[1]
    r[2] = p[2] * c - p[0] * s

    out[0] = r[0] + b[0]
    out[1] = r[1] + b[1]
    out[2] = r[2] + b[2]
    return out
  },

  rotateZ(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, rad: number): Vec3 {
    let p: Vec3 = [], r: Vec3 = []
    let s = Math.sin(rad)
    let c = Math.cos(rad)

    p[0] = a[0] - b[0]
    p[1] = a[1] - b[1]
    p[2] = a[2] - b[2]
    r[0] = p[0] * c - p[1] * s
    r[1] = p[0] * s + p[1] * c
    r[2] = p[2]

    out[0] = r[0] + b[0]
    out[1] = r[1] + b[1]
    out[2] = r[2] + b[2]
    return out
  },

  round(out: Vec3, a: ReadonlyVec3): Vec3 {
    out[0] = Math.round(a[0])
    out[1] = Math.round(a[1])
    out[2] = Math.round(a[2])
    return out
  },

  roundSymm(out: Vec3, a: ReadonlyVec3): Vec3 {
    out[0] = matrix.roundSymm(a[0])
    out[1] = matrix.roundSymm(a[1])
    out[2] = matrix.roundSymm(a[2])
    return out
  },

  scale(out: Vec3, a: ReadonlyVec3, b: number): Vec3 {
    out[0] = a[0] * b
    out[1] = a[1] * b
    out[2] = a[2] * b
    return out
  },

  scaleAndAdd(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, scale: number): Vec3 {
    out[0] = a[0] * b[0] * scale
    out[1] = a[1] * b[1] * scale
    out[2] = a[2] * b[2] * scale
    return out
  },

  set(out: Vec3, x: number, y: number, z: number): Vec3 {
    out[0] = x
    out[1] = y
    out[2] = z
    return out
  },

  slerp(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, t: number): Vec3 {
    let angle = Math.acos(Math.min(Math.max(this.dot(a, b), -1), 1))
    let s = Math.sin(angle)
    let ratioA = Math.sin((1 - t) * angle) / s
    let ratioB = Math.sin(t * angle) / s
    out[0] = ratioA * a[0] + ratioB * b[0]
    out[1] = ratioA * a[1] + ratioB * b[1]
    out[2] = ratioA * a[2] + ratioB * b[2]
    return out
  },

  squaredDistance(a: ReadonlyVec3, b: ReadonlyVec3): number {
    let x = b[0] - a[0]
    let y = b[1] - a[1]
    let z = b[2] - a[2]
    return x * x + y * y + z * z
  },

  squaredLength(a: ReadonlyVec3): number {
    let x = a[0]
    let y = a[1]
    let z = a[2]
    return x * x + y * y + z * z
  },

  str(a: ReadonlyVec3): string {
    return 'vec3(' + a[0] + ',' + a[1] + ',' + a[2] + ')'
  },

  subtract(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3 {
    out[0] = a[0] - b[0]
    out[1] = a[1] - b[1]
    out[2] = a[2] - b[2]
    return out
  },

  transformMat3(out: Vec3, a: ReadonlyVec3, m: ReadonlyMat3): Vec3 {
    let x = a[0], y = a[1], z = a[2]
    out[0] = m[0] * x + m[3] * y + m[6] * z
    out[1] = m[1] * x + m[4] * y + m[7] * z
    out[2] = m[2] * x + m[5] * y + m[8] * z
    return out
  },

  transformMat4(out: Vec3, a: ReadonlyVec3, m: ReadonlyMat4): Vec3 {
    let x = a[0], y = a[1], z = a[2]
    let w = m[3] * x + m[7] * y + m[11] * z + m[15]
    w = w || 1
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w
    return out
  },

  transformQuat(out: Vec3, a: ReadonlyVec3, q: ReadonlyQuat): Vec3 {
    let qx = q[0], qy = q[1], qz = q[2], qw = q[3]
    let x = a[0], y = a[1], z = a[2]

    let uvx = qy * z - qz * y,
      uvy = qz * x - qx * z,
      uvz = qx * y - qy * x
    let uuvx = qy * uvz - qz * uvy,
      uuvy = qz * uvx - qx * uvz,
      uuvz = qx * uvy - qy * uvx

    let w2 = qw * 2
    uvx *= w2
    uvy *= w2
    uvz *= w2
    uuvx *= 2
    uuvy *= 2
    uuvz *= 2

    out[0] = x + uvx + uuvx
    out[1] = y + uvy + uuvy
    out[2] = z + uvz + uuvz
    return out
  },

  zero(out: Vec3): Vec3 {
    out[0] = 0
    out[1] = 0
    out[2] = 0
    return out
  }
}