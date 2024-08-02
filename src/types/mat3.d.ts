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

declare type Mat3 = IndexedCollection
  | [
  number, number, number,
  number, number, number,
  number, number, number]

declare type ReadonlyMat3 = IndexedCollection
  | readonly [
    number, number, number,
    number, number, number,
    number, number, number]

declare namespace glMatrix {
  namespace mat3 {
    function create(): Mat3
    function fromMat4(out: Mat3, a: ReadonlyMat4): Mat3
    function clone(a: ReadonlyMat3): Mat3
    function copy(out: Mat3, a: ReadonlyMat3): Mat3
    function fromValues(m00: number, m01: number, m02: number, m10: number, m11: number, m12: number, m20: number, m21: number, m22: number): Mat3
    function set(out: Mat3, m00: number, m01: number, m02: number, m10: number, m11: number, m12: number, m20: number, m21: number, m22: number): Mat3
    function identity(out: Mat3): Mat3
    function transpose(out: Mat3, a: ReadonlyMat3): Mat3
    function invert(out: Mat3, a: ReadonlyMat3): Mat3
    function adjoint(out: Mat3, a: ReadonlyMat3): Mat3
    function determinant(a: ReadonlyMat3): number
    function multiply(out: Mat3, a: ReadonlyMat3, b: ReadonlyMat3): Mat3
    function translate(out: Mat3, a: ReadonlyMat3, v: ReadonlyVec2): Mat3
    function rotate(out: Mat3, a: ReadonlyMat3, rad: number): Mat3
    function scale(out: Mat3, a: ReadonlyMat3, v: ReadonlyVec2): Mat3
    function fromTranslation(out: Mat3, v: ReadonlyVec2): Mat3
    function fromRotation(out: Mat3, rad: number): Mat3
    function fromScaling(out: Mat3, v: ReadonlyVec2): Mat3
    function fromMat2d(out: Mat3, a: ReadonlyMat2d): Mat3
    function fromQuat(out: Mat3, q: ReadonlyQuat): Mat3
    function normalFromMat4(out: Mat3, a: ReadonlyMat4): Mat3
    function projection(out: Mat3, width: number, height: number): Mat3
    function str(a: ReadonlyMat3): string
    function frob(a: ReadonlyMat3): number
    function add(out: Mat3, a: ReadonlyMat3, b: ReadonlyMat3): Mat3
    function subtract(out: Mat3, a: ReadonlyMat3, b: ReadonlyMat3): Mat3
    function multiplyScalar(out: Mat3, a: ReadonlyMat3, b: number): Mat3
    function multiplyScalarAndAdd(out: Mat3, a: ReadonlyMat3, b: ReadonlyMat3, scale: number): Mat3
    function exactEquals(a: ReadonlyMat3, b: ReadonlyMat3): boolean
    function equals(a: ReadonlyMat3, b: ReadonlyMat3): boolean
    function mul(out: Mat3, a: ReadonlyMat3, b: ReadonlyMat3): Mat3
    function sub(out: Mat3, a: ReadonlyMat3, b: ReadonlyMat3): Mat3
  }
}