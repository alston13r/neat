enum RotationAxis {
  x, y, z
}

class Matrix {
  r: number
  c: number
  m: number[][]

  constructor(r: number = 4, c: number = 4) {
    this.r = r
    this.c = c
    this.m = new Array(r).fill(0).map(() => new Array(c).fill(0))
  }

  static Map(m: Matrix, fn: (e: number, i: number, j: number, m: Matrix) => number): Matrix {
    for (let i=0; i<m.r; i++) {
      for (let j=0; j<m.c; j++) {
        m.m[i][j] = fn(m.m[i][j], i, j, m)
      }
    }
    return m
  }

  static Copy(m: Matrix): Matrix {
    return Matrix.Map(new Matrix(m.r, m.c), (e, i, j) => m.m[i][j])
  }

  copy(): Matrix {
    return Matrix.Copy(this)
  }

  map(fn: (e: number, i: number, j: number, m: Matrix) => number) {
    return Matrix.Map(this.copy(), fn)
  }

  static Dot(a: Matrix, b: Matrix): Matrix {
    return Matrix.Map(new Matrix(a.r, b.c), (e,i,j) => {
      let s = 0
      for (let k=0; k<a.c; k++) s += a.m[i][k] * b.m[k][j]
      return s
    })
  }

  dot(a: Matrix): Matrix {
    return Matrix.Dot(this, a)
  }

  static Add(a: Matrix, b: Matrix): Matrix
  static Add(a: Matrix, b: number): Matrix
  static Add(a: Matrix, b: Matrix | number): Matrix | number {
    if (b instanceof Matrix) {
      return Matrix.Map(a, (e, i, j) => e + b.m[i][j])
    } else {
      return Matrix.Map(a, e => e + b)
    }
  }
  add(a: Matrix | number): Matrix {
    // @ts-ignore
    return Matrix.Add(this.copy(), a)
  }

  static Mul(a: Matrix, b: Matrix): Matrix
  static Mul(a: Matrix, b: number): Matrix
  static Mul(a: Matrix, b: Matrix | number): Matrix | number {
    if (b instanceof Matrix) {
      return Matrix.Map(a, (e, i, j) => e * b.m[i][j])
    } else {
      return Matrix.Map(a, e => e * b)
    }
  }
  mul(a: Matrix | number): Matrix {
    // @ts-ignore
    return Matrix.Mul(this.copy(), a)
  }

  static Sub(a: Matrix, b: Matrix): Matrix
  static Sub(a: Matrix, b: number): Matrix
  static Sub(a: Matrix, b: Matrix | number): Matrix | number {
    if (b instanceof Matrix) {
      return Matrix.Map(a, (e, i, j) => e - b.m[i][j])
    } else {
      return Matrix.Map(a, e => e - b)
    }
  }
  sub(a: Matrix | number): Matrix {
    // @ts-ignore
    return Matrix.Sub(this.copy(), a)
  }

  static Div(a: Matrix, b: Matrix): Matrix
  static Div(a: Matrix, b: number): Matrix
  static Div(a: Matrix, b: Matrix | number): Matrix | number {
    if (b instanceof Matrix) {
      return Matrix.Map(a, (e, i, j) => e / b.m[i][j])
    } else {
      return Matrix.Map(a, e => e / b)
    }
  }
  div(a: Matrix | number): Matrix {
    // @ts-ignore
    return Matrix.Div(this.copy(), a)
  }

  static FromArr(arr: number[][]): Matrix
  static FromArr(arr: number[]): Matrix
  static FromArr(arr: number[][] | number[]): Matrix {
    if (arr[0] instanceof Array) {
      return Matrix.Map(new Matrix(arr.length, arr[0].length), (e, i, j) => (arr as number[][])[i][j])
    } else {
      return Matrix.Map(new Matrix(1, arr.length), (e,i,j) => (arr as number[])[j])
    }
  }

  static ToArray(m: Matrix): number[] {
    let res: number[] = []
    m.map(e => res.push(e))
    return res
  }
  toArray(): number[] {
    return Matrix.ToArray(this)
  }
  static To2DArray(m: Matrix): number[][] {
    return [...m.m].map(x => [...x])
  }
  to2DArray(): number[][] {
    return Matrix.To2DArray(this)
  }

  static MakeIdentity(s: number | Matrix = 4): Matrix {
    if (s instanceof Matrix) {
      for (let i=0; i<s.r; i++) s.m[i][i] = 1
      return s
    }
    let m = new Matrix(s, s)
    for (let i=0; i<s; i++) m.m[i][i] = 1
    return m
  }

  static Print(m: Matrix, text: string): Matrix {
    if (text != undefined) console.log(`Matrix {${text}}: ${m.r}-${m.c}`)
    console.table(m.m)
    return m
  }

  print(text: string): Matrix {
    return Matrix.Print(this, text)
  }

  static Summate(m: Matrix): number {
    let s: number = 0
    m.map(e => s += e)
    return s
  }

  summate(): number {
    return Matrix.Summate(this)
  }

  static Randomize(m: Matrix): Matrix {
    return Matrix.Map(m, () => Math.random()*2-1)
  }

  randomize(): Matrix {
    return Matrix.Randomize(this.copy())
  }

  static Numerize(m: Matrix): Matrix {
    return Matrix.Map(m, (e, i, j) => i*m.c + j)
  }

  numerize(): Matrix {
    return Matrix.Numerize(this.copy())
  }

  static Transpose(m: Matrix): Matrix {
    let mTemp: number[][] = new Array(m.c).fill(0).map(() => new Array(m.r).fill(0))
    m.map((e, i, j) => mTemp[j][i] = e)
    let rTemp: number = m.r
    m.r = m.c
    m.c = rTemp
    m.m = mTemp
    return m
  }

  transpose(): Matrix {
    return Matrix.Transpose(this.copy())
  }
}