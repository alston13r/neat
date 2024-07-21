const mat2 = {
  add(out: Mat2, a: ReadonlyMat2, b: ReadonlyMat2): Mat2 {
    out[0] = a[0] + b[0]
    out[1] = a[1] + b[1]
    out[2] = a[2] + b[2]
    out[3] = a[3] + b[3]
    return out
  },

  adjoint(out: Mat2, a: ReadonlyMat2): Mat2 {
    let a0 = a[0]
    out[0] = a[3]
    out[1] = -a[1]
    out[2] = -a[2]
    out[3] = a0
    return out
  },

  clone(a: ReadonlyMat2): Mat2 {
    let out = new matrix.ArrayType(4)
    out[0] = a[0]
    out[1] = a[1]
    out[2] = a[2]
    out[3] = a[3]
    return out
  },

  copy(out: Mat2, a: ReadonlyMat2): Mat2 {
    out[0] = a[0]
    out[1] = a[1]
    out[2] = a[2]
    out[3] = a[3]
    return out
  },

  create(): Mat2 {
    let out = new matrix.ArrayType(2)
    if (matrix.ArrayType != Float32Array) {
      out[1] = 0
      out[2] = 0
    }
    out[0] = 1
    out[3] = 1
    return out
  },

  determinant(a: ReadonlyMat2): number {
    return a[0] * a[3] - a[2] * a[1]
  },

  equals(a: ReadonlyMat2, b: ReadonlyMat2): boolean {
    let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3]
    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3]
    return (
      Math.abs(a0 - b0) <= matrix.Epsilon * Math.max(1, Math.abs(a0), Math.abs(b0)) &&
      Math.abs(a1 - b1) <= matrix.Epsilon * Math.max(1, Math.abs(a1), Math.abs(b1)) &&
      Math.abs(a2 - b2) <= matrix.Epsilon * Math.max(1, Math.abs(a2), Math.abs(b2)) &&
      Math.abs(a3 - b3) <= matrix.Epsilon * Math.max(1, Math.abs(a3), Math.abs(b3))
    )
  },

  exactEquals(a: ReadonlyMat2, b: ReadonlyMat2): boolean {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3]
  },

  frob(a: ReadonlyMat2): number {
    return Math.hypot(a[0], a[1], a[2], a[3])
  },

  fromRotation(out: Mat2, rad: number): Mat2 {
    let s = Math.sin(rad)
    let c = Math.cos(rad)
    out[0] = c
    out[1] = s
    out[2] = -s
    out[3] = c
    return out
  },

  fromScaling(out: Mat2, v: ReadonlyVec2): Mat2 {
    out[0] = v[0]
    out[1] = 0
    out[2] = 0
    out[3] = v[1]
    return out
  },

  fromValues(m00: number, m01: number, m10: number, m11: number): Mat2 {
    let out = new matrix.ArrayType(4)
    out[0] = m00
    out[1] = m01
    out[2] = m10
    out[3] = m11
    return out
  },

  identity(out: Mat2): Mat2 {
    out[0] = 1
    out[1] = 0
    out[2] = 0
    out[3] = 1
    return out
  },

  invert(out: Mat2, a: ReadonlyMat2): Mat2 | null {
    let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3]
    let det = a0 * a3 - a2 * a1
    if (!det) return null
    det = 1 / det
    out[0] = a3 * det
    out[1] = -a1 * det
    out[2] = -a2 * det
    out[3] = a0 * det
    return out
  },

  multiply(out: Mat2, a: ReadonlyMat2, b: ReadonlyMat2): Mat2 {
    let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3]
    let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3]
    out[0] = a0 * b0 + a2 * b1
    out[1] = a1 * b0 + a3 * b1
    out[2] = a0 * b2 + a2 * b3
    out[3] = a1 * b2 + a3 * b3
    return out
  },

  multiplyScalar(out: Mat2, a: ReadonlyMat2, b: number): Mat2 {
    out[0] = a[0] * b
    out[1] = a[1] * b
    out[2] = a[2] * b
    out[3] = a[3] * b
    return out
  },

  multiplyScalarAndAdd(out: Mat2, a: ReadonlyMat2, b: ReadonlyMat2, scale: number) {
    out[0] = a[0] + b[0] * scale
    out[1] = a[1] + b[1] * scale
    out[2] = a[2] + b[2] * scale
    out[3] = a[3] + b[3] * scale
    return out
  },

  rotate(out: Mat2, a: ReadonlyMat2, rad: number): Mat2 {
    let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3]
    let s = Math.sin(rad)
    let c = Math.cos(rad)
    out[0] = a0 * c + a2 * s
    out[1] = a1 * c + a3 * s
    out[2] = a0 * -s + a2 * c
    out[3] = a1 * -s + a3 * c
    return out
  },

  scale(out: Mat2, a: ReadonlyMat2, v: ReadonlyVec2): Mat2 {
    let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3]
    let v0 = v[0], v1 = v[1]
    out[0] = a0 * v0
    out[1] = a1 * v0
    out[2] = a2 * v1
    out[3] = a3 * v1
    return out
  },

  set(out: Mat2, m00: number, m01: number, m10: number, m11: number): Mat2 {
    out[0] = m00
    out[1] = m01
    out[2] = m10
    out[3] = m11
    return out
  },

  str(a: ReadonlyMat2): string {
    return 'mat2(' + a[0] + ',' + a[1] + ',' + a[2] + ',' + a[3] + ')'
  },

  subtract(out: Mat2, a: ReadonlyMat2, b: ReadonlyMat2): Mat2 {
    out[0] = a[0] - b[0]
    out[1] = a[1] - b[1]
    out[2] = a[2] - b[2]
    out[3] = a[3] - b[3]
    return out
  },

  transpose(out: Mat2, a: ReadonlyMat2): Mat2 {
    if (out === a) {
      let a1 = a[1]
      out[1] = out[2]
      out[2] = a1
    } else {
      out[0] = a[0]
      out[1] = a[2]
      out[2] = a[1]
      out[3] = a[3]
    }
    return out
  }
}