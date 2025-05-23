/**
 * This class represents an arbitrarily sized matrix in row-major order.
 * See {@link https://en.wikipedia.org/wiki/Row-_and_column-major_order}
 * for the difference between row-major and column-major. This differs
 * from how gl-matrix does it, where matrices are laid out in column-major
 * order.
 */
class Matrix {
  /** The number of rows in this matrix. */
  rows: number
  /** The number of columns in this matrix. */
  cols: number
  /** Internal 2D array representation of this matrix. This holds all data. */
  mat: number[][]

  /**
   * Constructs a new matrix of specified size. All values are
   * intialized to 0.
   * @param rows the number of rows to make, defaults to 4
   * @param cols the number of columns to make, defaults to 4
   */
  constructor(rows: number = 4, cols: number = 4) {
    this.rows = rows
    this.cols = cols
    this.mat = new Array(rows).fill(0).map(() => new Array(cols).fill(0))
  }

  /**
   * Runs the callback function over all elements. The callback function
   * takes a parameter for the element, the row index, the column index,
   * and the matrix. The callback function should return the new data for
   * each cell.
   * @param matrix the matrix to run the callback function on
   * @param callback the callback function
   * @returns a reference to this Matrix
   */
  static Map(matrix: Matrix, callback: MatrixCallback): Matrix {
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        matrix.mat[i][j] = callback(matrix.mat[i][j], i, j, matrix)
      }
    }
    return matrix
  }

  /**
   * Creates a clone of the specified matrix, copying the dimenions
   * and data.
   * @param matrix the matrix to clone
   * @returns the new matrix
   */
  static Clone(matrix: Matrix): Matrix {
    return Matrix.Map(new Matrix(matrix.rows, matrix.cols), (e, i, j) => matrix.mat[i][j])
  }

  /**
   * Creates a clone of this matrix, copying the dimenions and data.
   * @returns the new matrix
   */
  clone(): Matrix {
    return Matrix.Clone(this)
  }

  /**
   * Creates a clone of this matrix and runs the callback function
   * over all elements. The callback function takes a parameter for
   * the element, the row index, the column index, and the matrix.
   * The callback function should return the new data for each cell.
   * @param fn the callback function
   * @returns the new matrix
   */
  map(fn: MatrixCallback): Matrix {
    return Matrix.Map(this.clone(), fn)
  }

  /**
   * Computes the matrix-matrix dot product of the two specified
   * matrices: `matrixA * matrixB`. The number of columns in matrixA
   * must equal the number of columns in matrixB, and the resulting
   * matrix will have matrixA's number of rows and matrixB's number
   * of columns.
   * @param matrixA the first matrix
   * @param matrixB the second matrix
   * @returns a new matrix holding the dot product
   */
  static Dot(matrixA: Matrix, matrixB: Matrix): Matrix {
    return Matrix.Map(new Matrix(matrixA.rows, matrixB.cols), (e, i, j) => {
      let s: number = 0
      for (let k = 0; k < matrixA.cols; k++) s += matrixA.mat[i][k] * matrixB.mat[k][j]
      return s
    })
  }
  /**
   * Computs the matrix-matrix dot product of this matrix and the
   * specified matrix: `this * matrix`. The number of columns in this
   * matrix must equal the number of columns in the other matrix, and
   * the resulting matrix will have this matrix's number of rows and
   * the other matrix's number of columns.
   * @param matrix the other matrix
   * @returns a new matrix holding the dot product
   */
  dot(matrix: Matrix): Matrix {
    return Matrix.Dot(this, matrix)
  }

  /**
   * Adds each cell from matrixB to matrixA, modifying matrixA.
   * @param matrixA the first matrix
   * @param matrixB the second matrix
   * @returns a reference to matrixA
   */
  static Add(matrixA: Matrix, matrixB: Matrix): Matrix
  /**
   * Adds the constant value `x` to every cell of the matrix, modifying it.
   * @param matrix the matrix
   * @param x the constant value
   * @returns a reference to the matrix
   */
  static Add(matrix: Matrix, x: number): Matrix
  /**
   * Adds either two matrices together or a constant value
   * to every cell in a matrix.
   * @param matrix the matrix
   * @param other either a matrix or a constant value
   * @returns a reference to the matrix being modified
   */
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
    return Matrix.Add(this.clone(), other)
  }

  // TODO
  static Scale(matrix: Matrix, x: number): Matrix {
    return Matrix.Map(matrix, e => e * x)
  }
  // TODO
  scale(x: number): Matrix {
    return Matrix.Scale(this.clone(), x)
  }

  // TODO
  static Mul(matrixA: Matrix, matrixB: Matrix): Matrix {
    return Matrix.Map(matrixA, (e, i, j) => e * matrixB.mat[i][j])
  }
  // TODO
  mul(matrix: Matrix): Matrix {
    return Matrix.Mul(this.clone(), matrix)
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
    return Matrix.Sub(this.clone(), other)
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
    return Matrix.Div(this.clone(), a)
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
    return Matrix.Transpose(this.clone())
  }
}

/**
 * A callback function used to modify a Matrix's data.
 * This is similar to JavaScript's {@link Array.prototype.forEach}.
 * @param element the current cell's data
 * @param i the row index
 * @param j the column index
 * @param matrix reference to the matrix
 * @returns the new value for the cell
 */
type MatrixCallback = (element?: number, i?: number, j?: number, matrix?: Matrix) => number