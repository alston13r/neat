class MatrixError extends Error {
  constructor(message = '', options?: ErrorOptions) {
    super(message, options)
    this.message = message
  }
}

class MatN {
  rows = 0
  cols = 0
  data: number[] = []

  static Create() {
    return new MatN()
  }

  static Clone(a: MatN) {
    let clone = new MatN()
    clone.rows = a.rows
    clone.cols = a.cols
    clone.data = a.data.slice()
    return clone
  }

  static Copy(out: MatN, a: MatN) {
    out.rows = a.rows
    out.cols = a.cols
    out.data = a.data.slice()
    return out
  }

  static Identity(out: MatN, size: number) {
    out.rows = size
    out.cols = size
    out.data.length = 0
    out.data = []
    for (let i = 0; i < size * size; i++) {
      out.data[i] = i % (size + 1) == 0 ? 1 : 0
    }
    return out
  }

  static FromData(data: number[], rows: number, cols: number) {
    let out = new MatN()
    out.rows = rows
    out.cols = cols
    out.data = data
    if (rows * cols != data.length) {
      throw new MatrixError('Matrix Operation<SetData>: Data length incompatible with dimensions')
    }
    return out
  }

  static SetData(out: MatN, data: number[], rows: number, cols: number) {
    if (rows * cols != data.length) {
      throw new MatrixError('Matrix Operation<SetData>: Data length incompatible with dimensions')
    }
    out.rows = rows
    out.cols = cols
    out.data = data
    return out
  }

  static Add(out: MatN, a: MatN, b: MatN) {
    if (a.rows != b.rows || a.cols != b.cols) {
      throw new MatrixError('Matrix Operation<Addition>: Incompatible dimensions')
    }
    if (out != a) {
      out.rows = a.rows
      out.cols = a.cols
      out.data.length = 0
      out.data = []
    }
    for (let i = 0; i < a.data.length; i++) {
      out.data[i] = a.data[i] + b.data[i]
    }
    return out
  }

  static Subtract(out: MatN, a: MatN, b: MatN) {
    if (a.rows != b.rows || a.cols != b.cols) {
      throw new MatrixError('Matrix Operation<Subtraction>: Incompatible dimensions')
    }
    if (out != a) {
      out.rows = a.rows
      out.cols = a.cols
      out.data.length = 0
      out.data = []
    }
    for (let i = 0; i < a.data.length; i++) {
      out.data[i] = a.data[i] - b.data[i]
    }
    return out
  }
  static Sub(out: MatN, a: MatN, b: MatN): MatN { return null }

  // static Multiply(out: MatN, a: MatN, b: MatN) {
  //   if (a.cols != b.rows) {
  //     throw new MatrixError('Matrix Operation<Multiplication>: Incompatible dimensions')
  //   }
  //   out.rows = a.rows
  //   out.cols = b.cols
  //   out.data.length = 0
  //   out.data = []
  //   for (let i = 0; i < out.rows * out.cols; i++) {
  //     // row = 
  //     let s = 0
  //     // TODO
  //     // out.data[i] = a.rows[i] dot b.cols[i]
  //   }
  //   return out
  // }
  // static Mul(out: MatN, a: MatN, b: MatN): MatN { return null }

  static MultiplyScalar(out: MatN, a: MatN, scale: number) {
    if (out != a) {
      out.rows = a.rows
      out.cols = a.cols
      out.data.length = 0
      out.data = []
    }
    for (let i = 0; i < a.rows * a.cols; i++) {
      out.data[i] = a.data[i] * scale
    }
    return out
  }

  // scalar and add

  // transpose
  // determinant
  // str
  // exact equals
  // equals
}

MatN.Sub = MatN.Subtract
// MatN.Mul = MatN.Multiply

class Matrix {
  rows: number
  cols: number
  mat: number[][]

  // TODO
  constructor(rows: number = 4, cols: number = 4) {
    this.rows = rows
    this.cols = cols
    this.mat = new Array(rows).fill(0).map(() => new Array(cols).fill(0))
  }

  // TODO
  static Map(matrix: Matrix, fn: (element?: number, i?: number, j?: number, mat?: Matrix) => number): Matrix {
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        matrix.mat[i][j] = fn(matrix.mat[i][j], i, j, matrix)
      }
    }
    return matrix
  }

  // TODO
  static Copy(matrix: Matrix): Matrix {
    return Matrix.Map(new Matrix(matrix.rows, matrix.cols), (e, i, j) => matrix.mat[i][j])
  }

  // TODO
  copy(): Matrix {
    return Matrix.Copy(this)
  }

  // TODO
  map(fn: (element: number, i: number, j: number, mat: Matrix) => number): Matrix {
    return Matrix.Map(this.copy(), fn)
  }

  // TODO
  static Dot(matrixA: Matrix, matrixB: Matrix): Matrix {
    return Matrix.Map(new Matrix(matrixA.rows, matrixB.cols), (e, i, j) => {
      let s: number = 0
      for (let k = 0; k < matrixA.cols; k++) s += matrixA.mat[i][k] * matrixB.mat[k][j]
      return s
    })
  }
  // TODO
  dot(matrix: Matrix): Matrix {
    return Matrix.Dot(this, matrix)
  }

  // TODO
  static Add(matrixA: Matrix, matrixB: Matrix): Matrix
  // TODO
  static Add(matrix: Matrix, x: number): Matrix
  static Add(matrix: Matrix, other: Matrix | number): Matrix {
    if (other instanceof Matrix) return Matrix.Map(matrix, (e, i, j) => e + other.mat[i][j])
    return Matrix.Map(matrix, e => e + other)
  }

  // TODO
  add(matrix: Matrix): Matrix
  // TODO
  add(x: number): Matrix
  add(other: Matrix | number): Matrix {
    // @ts-ignore
    return Matrix.Add(this.copy(), other)
  }

  // TODO
  static Scale(matrix: Matrix, x: number): Matrix {
    return Matrix.Map(matrix, e => e * x)
  }
  // TODO
  scale(x: number): Matrix {
    return Matrix.Scale(this.copy(), x)
  }

  // TODO
  static Mul(matrixA: Matrix, matrixB: Matrix): Matrix {
    return Matrix.Map(matrixA, (e, i, j) => e * matrixB.mat[i][j])
  }
  // TODO
  mul(matrix: Matrix): Matrix {
    return Matrix.Mul(this.copy(), matrix)
  }


  // TODO
  static Sub(matrixA: Matrix, matrixB: Matrix): Matrix
  // TODO
  static Sub(matrix: Matrix, x: number): Matrix
  static Sub(matrix: Matrix, other: Matrix | number): Matrix {
    if (other instanceof Matrix) return Matrix.Add(matrix, other.scale(-1))
    return Matrix.Add(matrix, -other)
  }
  // TODO
  sub(matrix: Matrix): Matrix
  // TODO
  sub(x: number): Matrix
  sub(other: Matrix | number): Matrix {
    // @ts-ignore
    return Matrix.Sub(this.copy(), other)
  }

  // TODO
  static Div(matrixA: Matrix, matrixB: Matrix): Matrix
  // TODO
  static Div(matrix: Matrix, x: number): Matrix
  static Div(matrix: Matrix, other: Matrix | number): Matrix {
    if (other instanceof Matrix) return Matrix.Map(matrix, (e, i, j) => e / other.mat[i][j])
    return Matrix.Scale(matrix, 1 / other)
  }
  // TODO
  div(a: Matrix | number): Matrix {
    // @ts-ignore
    return Matrix.Div(this.copy(), a)
  }

  // TODO
  static FromArr(arr: number[][]): Matrix
  // TODO
  static FromArr(arr: number[]): Matrix
  static FromArr(arr: number[][] | number[]): Matrix {
    if (arr[0] instanceof Array) return Matrix.Map(new Matrix(arr.length, arr[0].length), (e, i, j) => (arr as number[][])[i][j])
    return Matrix.Map(new Matrix(1, arr.length), (e, i, j) => (arr as number[])[j])
  }

  // TODO
  static ToArray(matrix: Matrix): number[] {
    const res: number[] = []
    matrix.map(e => res.push(e))
    return res
  }
  // TODO
  toArray(): number[] {
    return Matrix.ToArray(this)
  }

  // TODO
  static To2DArray(matrix: Matrix): number[][] {
    return [...matrix.mat].map(row => [...row])
  }
  // TODO
  to2DArray(): number[][] {
    return Matrix.To2DArray(this)
  }

  // TODO
  static MakeIdentity(size: number): Matrix
  // TODO
  static MakeIdentity(matrix: Matrix): Matrix
  static MakeIdentity(param: number | Matrix = 4): Matrix {
    if (param instanceof Matrix) return Matrix.Map(param, (e, i, j) => i == j ? 1 : 0)
    return Matrix.MakeIdentity(new Matrix(param, param))
  }

  // TODO
  static Print(matrix: Matrix, text?: string): Matrix {
    if (text != undefined) console.log(`Matrix {${text}}: ${matrix.rows}-${matrix.cols}`)
    console.table(matrix.mat)
    return matrix
  }
  // TODO
  print(text?: string): Matrix {
    return Matrix.Print(this, text)
  }

  // TODO
  static Summate(matrix: Matrix): number {
    let s: number = 0
    matrix.map(e => s += e)
    return s
  }
  // TODO
  summate(): number {
    return Matrix.Summate(this)
  }

  // TODO
  static Randomize(matrix: Matrix, lowerLimit: number = -1, upperLimit: number = 1): Matrix {
    return Matrix.Map(matrix, () => Math.random() * (upperLimit - lowerLimit) + lowerLimit)
  }
  // TODO
  randomize(): Matrix {
    return Matrix.Randomize(new Matrix(this.rows, this.cols))
  }

  // TODO
  static Numerize(matrix: Matrix): Matrix {
    return Matrix.Map(matrix, (e, i, j) => i * matrix.cols + j)
  }
  // TODO
  numerize(): Matrix {
    return Matrix.Numerize(new Matrix(this.rows, this.cols))
  }

  // TODO
  static Transpose(matrix: Matrix): Matrix {
    const matTemp: number[][] = new Array(matrix.cols).fill(0).map(() => new Array(matrix.rows).fill(0))
    matrix.map((e, i, j) => matTemp[j][i] = e)
    const rowsTemp: number = matrix.rows
    matrix.rows = matrix.cols
    matrix.cols = rowsTemp
    matrix.mat = matTemp
    return matrix
  }
  // TODO
  transpose(): Matrix {
    return Matrix.Transpose(this.copy())
  }
}