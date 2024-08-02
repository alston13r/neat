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

declare type Mat2d = IndexedCollection
  | [
  number, number,
  number, number,
  number, number]

declare type ReadonlyMat2d = IndexedCollection
  | readonly [
    number, number,
    number, number,
    number, number]

declare namespace glMatrix {
  namespace mat2d {
    function create(): Mat2d
    function clone(a: ReadonlyMat2d): Mat2d
    function copy(out: Mat2d, a: ReadonlyMat2d): Mat2d
    function identity(out: Mat2d): Mat2d
    function fromValues(a: number, b: number, c: number, d: number, tx: number, ty: number): Mat2d
    function set(out: Mat2d, a: number, b: number, c: number, d: number, tx: number, ty: number): Mat2d
    function invert(out: Mat2d, a: ReadonlyMat2d): Mat2d
    function determinant(a: ReadonlyMat2d): number
    function multiply(out: Mat2d, a: ReadonlyMat2d, b: ReadonlyMat2d): Mat2d
    function rotate(out: Mat2d, a: ReadonlyMat2d, rad: number): Mat2d
    function scale(out: Mat2d, a: ReadonlyMat2d, v: ReadonlyVec2): Mat2d
    function translate(out: Mat2d, a: ReadonlyMat2d, v: ReadonlyVec2): Mat2d
    function fromRotation(out: Mat2d, rad: number): Mat2d
    function fromScaling(out: Mat2d, v: ReadonlyVec2): Mat2d
    function fromTranslation(out: Mat2d, v: ReadonlyVec2): Mat2d
    function str(a: ReadonlyMat2d): string
    function frob(a: ReadonlyMat2d): number
    function add(out: Mat2d, a: ReadonlyMat2d, b: ReadonlyMat2d): Mat2d
    function subtract(out: Mat2d, a: ReadonlyMat2d, b: ReadonlyMat2d): Mat2d
    function multiplyScalar(out: Mat2d, a: ReadonlyMat2d, b: number): Mat2d
    function multiplyScalarAndAdd(out: Mat2d, a: ReadonlyMat2d, b: ReadonlyMat2d, scale: number): Mat2d
    function exactEquals(a: ReadonlyMat2d, b: ReadonlyMat2d): boolean
    function equals(a: ReadonlyMat2d, b: ReadonlyMat2d): boolean
    function mul(out: Mat2d, a: ReadonlyMat2d, b: ReadonlyMat2d): Mat2d
    function sub(out: Mat2d, a: ReadonlyMat2d, b: ReadonlyMat2d): Mat2d
  }
}