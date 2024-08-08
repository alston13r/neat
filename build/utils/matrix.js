class MatrixError extends Error {
    constructor(message = '', options) {
        super(message, options);
        this.message = message;
    }
}
class MatN {
    rows = 0;
    cols = 0;
    data = [];
    static Create() {
        return new MatN();
    }
    static Clone(a) {
        let clone = new MatN();
        clone.rows = a.rows;
        clone.cols = a.cols;
        clone.data = a.data.slice();
        return clone;
    }
    static Copy(out, a) {
        out.rows = a.rows;
        out.cols = a.cols;
        out.data = a.data.slice();
        return out;
    }
    static Identity(out, size) {
        out.rows = size;
        out.cols = size;
        out.data.length = 0;
        out.data = [];
        for (let i = 0; i < size * size; i++) {
            out.data[i] = i % (size + 1) == 0 ? 1 : 0;
        }
        return out;
    }
    static FromData(data, rows, cols) {
        let out = new MatN();
        out.rows = rows;
        out.cols = cols;
        out.data = data;
        if (rows * cols != data.length) {
            throw new MatrixError('Matrix Operation<SetData>: Data length incompatible with dimensions');
        }
        return out;
    }
    static SetData(out, data, rows, cols) {
        if (rows * cols != data.length) {
            throw new MatrixError('Matrix Operation<SetData>: Data length incompatible with dimensions');
        }
        out.rows = rows;
        out.cols = cols;
        out.data = data;
        return out;
    }
    static Add(out, a, b) {
        if (a.rows != b.rows || a.cols != b.cols) {
            throw new MatrixError('Matrix Operation<Addition>: Incompatible dimensions');
        }
        if (out != a) {
            out.rows = a.rows;
            out.cols = a.cols;
            out.data.length = 0;
            out.data = [];
        }
        for (let i = 0; i < a.data.length; i++) {
            out.data[i] = a.data[i] + b.data[i];
        }
        return out;
    }
    static Subtract(out, a, b) {
        if (a.rows != b.rows || a.cols != b.cols) {
            throw new MatrixError('Matrix Operation<Subtraction>: Incompatible dimensions');
        }
        if (out != a) {
            out.rows = a.rows;
            out.cols = a.cols;
            out.data.length = 0;
            out.data = [];
        }
        for (let i = 0; i < a.data.length; i++) {
            out.data[i] = a.data[i] - b.data[i];
        }
        return out;
    }
    static Sub(out, a, b) { return null; }
    static MultiplyScalar(out, a, scale) {
        if (out != a) {
            out.rows = a.rows;
            out.cols = a.cols;
            out.data.length = 0;
            out.data = [];
        }
        for (let i = 0; i < a.rows * a.cols; i++) {
            out.data[i] = a.data[i] * scale;
        }
        return out;
    }
}
MatN.Sub = MatN.Subtract;
class Matrix {
    rows;
    cols;
    mat;
    constructor(rows = 4, cols = 4) {
        this.rows = rows;
        this.cols = cols;
        this.mat = new Array(rows).fill(0).map(() => new Array(cols).fill(0));
    }
    static Map(matrix, fn) {
        for (let i = 0; i < matrix.rows; i++) {
            for (let j = 0; j < matrix.cols; j++) {
                matrix.mat[i][j] = fn(matrix.mat[i][j], i, j, matrix);
            }
        }
        return matrix;
    }
    static Copy(matrix) {
        return Matrix.Map(new Matrix(matrix.rows, matrix.cols), (e, i, j) => matrix.mat[i][j]);
    }
    copy() {
        return Matrix.Copy(this);
    }
    map(fn) {
        return Matrix.Map(this.copy(), fn);
    }
    static Dot(matrixA, matrixB) {
        return Matrix.Map(new Matrix(matrixA.rows, matrixB.cols), (e, i, j) => {
            let s = 0;
            for (let k = 0; k < matrixA.cols; k++)
                s += matrixA.mat[i][k] * matrixB.mat[k][j];
            return s;
        });
    }
    dot(matrix) {
        return Matrix.Dot(this, matrix);
    }
    static Add(matrix, other) {
        if (other instanceof Matrix)
            return Matrix.Map(matrix, (e, i, j) => e + other.mat[i][j]);
        return Matrix.Map(matrix, e => e + other);
    }
    add(other) {
        return Matrix.Add(this.copy(), other);
    }
    static Scale(matrix, x) {
        return Matrix.Map(matrix, e => e * x);
    }
    scale(x) {
        return Matrix.Scale(this.copy(), x);
    }
    static Mul(matrixA, matrixB) {
        return Matrix.Map(matrixA, (e, i, j) => e * matrixB.mat[i][j]);
    }
    mul(matrix) {
        return Matrix.Mul(this.copy(), matrix);
    }
    static Sub(matrix, other) {
        if (other instanceof Matrix)
            return Matrix.Add(matrix, other.scale(-1));
        return Matrix.Add(matrix, -other);
    }
    sub(other) {
        return Matrix.Sub(this.copy(), other);
    }
    static Div(matrix, other) {
        if (other instanceof Matrix)
            return Matrix.Map(matrix, (e, i, j) => e / other.mat[i][j]);
        return Matrix.Scale(matrix, 1 / other);
    }
    div(a) {
        return Matrix.Div(this.copy(), a);
    }
    static FromArr(arr) {
        if (arr[0] instanceof Array)
            return Matrix.Map(new Matrix(arr.length, arr[0].length), (e, i, j) => arr[i][j]);
        return Matrix.Map(new Matrix(1, arr.length), (e, i, j) => arr[j]);
    }
    static ToArray(matrix) {
        const res = [];
        matrix.map(e => res.push(e));
        return res;
    }
    toArray() {
        return Matrix.ToArray(this);
    }
    static To2DArray(matrix) {
        return [...matrix.mat].map(row => [...row]);
    }
    to2DArray() {
        return Matrix.To2DArray(this);
    }
    static MakeIdentity(param = 4) {
        if (param instanceof Matrix)
            return Matrix.Map(param, (e, i, j) => i == j ? 1 : 0);
        return Matrix.MakeIdentity(new Matrix(param, param));
    }
    static Print(matrix, text) {
        if (text != undefined)
            console.log(`Matrix {${text}}: ${matrix.rows}-${matrix.cols}`);
        console.table(matrix.mat);
        return matrix;
    }
    print(text) {
        return Matrix.Print(this, text);
    }
    static Summate(matrix) {
        let s = 0;
        matrix.map(e => s += e);
        return s;
    }
    summate() {
        return Matrix.Summate(this);
    }
    static Randomize(matrix, lowerLimit = -1, upperLimit = 1) {
        return Matrix.Map(matrix, () => Math.random() * (upperLimit - lowerLimit) + lowerLimit);
    }
    randomize() {
        return Matrix.Randomize(new Matrix(this.rows, this.cols));
    }
    static Numerize(matrix) {
        return Matrix.Map(matrix, (e, i, j) => i * matrix.cols + j);
    }
    numerize() {
        return Matrix.Numerize(new Matrix(this.rows, this.cols));
    }
    static Transpose(matrix) {
        const matTemp = new Array(matrix.cols).fill(0).map(() => new Array(matrix.rows).fill(0));
        matrix.map((e, i, j) => matTemp[j][i] = e);
        const rowsTemp = matrix.rows;
        matrix.rows = matrix.cols;
        matrix.cols = rowsTemp;
        matrix.mat = matTemp;
        return matrix;
    }
    transpose() {
        return Matrix.Transpose(this.copy());
    }
}
//# sourceMappingURL=matrix.js.map