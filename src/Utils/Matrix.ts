// TODO
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
  static Map(matrix: Matrix, fn: (element: number, i: number, j: number, mat: Matrix) => number): Matrix {
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
  // TODO
  static Add(matrix: Matrix, other: Matrix | number): Matrix {
    if (other instanceof Matrix) return Matrix.Map(matrix, (e, i, j) => e + other.mat[i][j])
    else return Matrix.Map(matrix, e => e + other)
  }

  // TODO
  add(matrix: Matrix): Matrix
  // TODO
  add(x: number): Matrix
  // TODO
  add(other: Matrix | number): Matrix {
    // @ts-ignore
    return Matrix.Add(this.copy(), other)
  }
}


// TODO
// class Matrix {

//   static Mul(a: Matrix, b: Matrix): Matrix
//   static Mul(a: Matrix, b: number): Matrix
//   static Mul(a: Matrix, b: Matrix | number): Matrix | number {
//     if (b instanceof Matrix) {
//       return Matrix.Map(a, (e, i, j) => e * b.m[i][j])
//     } else {
//       return Matrix.Map(a, e => e * b)
//     }
//   }
//   mul(a: Matrix | number): Matrix {
//     // @ts-ignore
//     return Matrix.Mul(this.copy(), a)
//   }

//   static Sub(a: Matrix, b: Matrix): Matrix
//   static Sub(a: Matrix, b: number): Matrix
//   static Sub(a: Matrix, b: Matrix | number): Matrix | number {
//     if (b instanceof Matrix) {
//       return Matrix.Map(a, (e, i, j) => e - b.m[i][j])
//     } else {
//       return Matrix.Map(a, e => e - b)
//     }
//   }
//   sub(a: Matrix | number): Matrix {
//     // @ts-ignore
//     return Matrix.Sub(this.copy(), a)
//   }

//   static Div(a: Matrix, b: Matrix): Matrix
//   static Div(a: Matrix, b: number): Matrix
//   static Div(a: Matrix, b: Matrix | number): Matrix | number {
//     if (b instanceof Matrix) {
//       return Matrix.Map(a, (e, i, j) => e / b.m[i][j])
//     } else {
//       return Matrix.Map(a, e => e / b)
//     }
//   }
//   div(a: Matrix | number): Matrix {
//     // @ts-ignore
//     return Matrix.Div(this.copy(), a)
//   }

//   static FromArr(arr: number[][]): Matrix
//   static FromArr(arr: number[]): Matrix
//   static FromArr(arr: number[][] | number[]): Matrix {
//     if (arr[0] instanceof Array) {
//       return Matrix.Map(new Matrix(arr.length, arr[0].length), (e, i, j) => (arr as number[][])[i][j])
//     } else {
//       return Matrix.Map(new Matrix(1, arr.length), (e, i, j) => (arr as number[])[j])
//     }
//   }

//   static ToArray(m: Matrix): number[] {
//     let res: number[] = []
//     m.map(e => res.push(e))
//     return res
//   }
//   toArray(): number[] {
//     return Matrix.ToArray(this)
//   }
//   static To2DArray(m: Matrix): number[][] {
//     return [...m.m].map(x => [...x])
//   }
//   to2DArray(): number[][] {
//     return Matrix.To2DArray(this)
//   }

//   static MakeIdentity(s: number | Matrix = 4): Matrix {
//     if (s instanceof Matrix) {
//       for (let i = 0; i < s.r; i++) s.m[i][i] = 1
//       return s
//     }
//     let m = new Matrix(s, s)
//     for (let i = 0; i < s; i++) m.m[i][i] = 1
//     return m
//   }

//   static Print(m: Matrix, text: string): Matrix {
//     if (text != undefined) console.log(`Matrix {${text}}: ${m.r}-${m.c}`)
//     console.table(m.m)
//     return m
//   }

//   print(text: string): Matrix {
//     return Matrix.Print(this, text)
//   }

//   static Summate(m: Matrix): number {
//     let s: number = 0
//     m.map(e => s += e)
//     return s
//   }

//   summate(): number {
//     return Matrix.Summate(this)
//   }

//   static Randomize(m: Matrix): Matrix {
//     return Matrix.Map(m, () => Math.random() * 2 - 1)
//   }

//   randomize(): Matrix {
//     return Matrix.Randomize(this.copy())
//   }

//   static Numerize(m: Matrix): Matrix {
//     return Matrix.Map(m, (e, i, j) => i * m.c + j)
//   }

//   numerize(): Matrix {
//     return Matrix.Numerize(this.copy())
//   }

//   static Transpose(m: Matrix): Matrix {
//     let mTemp: number[][] = new Array(m.c).fill(0).map(() => new Array(m.r).fill(0))
//     m.map((e, i, j) => mTemp[j][i] = e)
//     let rTemp: number = m.r
//     m.r = m.c
//     m.c = rTemp
//     m.m = mTemp
//     return m
//   }

//   transpose(): Matrix {
//     return Matrix.Transpose(this.copy())
//   }
// }