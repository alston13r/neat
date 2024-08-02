/*
Copyright (c) 2015-2021, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

declare type Mat2 = IndexedCollection
  | [number, number, number, number]

declare type ReadonlyMat2 = IndexedCollection
  | readonly [number, number, number, number]

declare namespace glMatrix {
  namespace mat2 {
    function create(): Mat2
    function clone(a: ReadonlyMat2): Mat2
    function copy(out: Mat2, a: ReadonlyMat2): Mat2
    function identity(out: Mat2): Mat2
    function fromValues(m00: number, m01: number, m10: number, m11: number): Mat2
    function set(out: Mat2, m00: number, m01: number, m10: number, m11: number): Mat2
    function transpose(out: Mat2, a: ReadonlyMat2): Mat2
    function invert(out: Mat2, a: ReadonlyMat2): Mat2
    function adjoint(out: Mat2, a: ReadonlyMat2): Mat2
    function determinant(a: ReadonlyMat2): number
    function multiply(out: Mat2, a: ReadonlyMat2, b: ReadonlyMat2): Mat2
    function rotate(out: Mat2, a: ReadonlyMat2, b: number): Mat2
    function scale(out: Mat2, a: ReadonlyMat2, v: ReadonlyVec2): Mat2
    function fromRotation(out: Mat2, rad: number): Mat2
    function fromScaling(out: Mat2, v: ReadonlyVec2): Mat2
    function str(a: ReadonlyMat2): string
    function frob(a: ReadonlyMat2): number
    function LDU(L: ReadonlyMat2, D: ReadonlyMat2, U: ReadonlyMat2, a: ReadonlyMat2): [Mat2, Mat2, Mat2]
    function add(out: Mat2, a: ReadonlyMat2, b: ReadonlyMat2): Mat2
    function subtract(out: Mat2, a: ReadonlyMat2, b: ReadonlyMat2): Mat2
    function exactEquals(a: ReadonlyMat2, b: ReadonlyMat2): boolean
    function equals(a: ReadonlyMat2, b: ReadonlyMat2): boolean
    function multiplyScalar(out: Mat2, a: ReadonlyMat2, b: number): Mat2
    function multiplyScalarAndAdd(out: Mat2, a: ReadonlyMat2, b: ReadonlyMat2, scale: number): Mat2
    function mul(out: Mat2, a: ReadonlyMat2, b: ReadonlyMat2): Mat2
    function sub(out: Mat2, a: ReadonlyMat2, b: ReadonlyMat2): Mat2
  }
}