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

declare type Quat2 = IndexedCollection
  | [
  number, number, number, number,
  number, number, number, number]

declare type ReadonlyQuat2 = IndexedCollection
  | readonly [
    number, number, number, number,
    number, number, number, number]

declare namespace glMatrix {
  namespace quat2 {
    function create(): Quat2
    function clone(a: ReadonlyQuat2): Quat2
    function fromValues(x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number): Quat2
    function fromRotationTranslationValues(x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number): Quat2
    function fromRotationTranslation(out: ReadonlyQuat2, q: ReadonlyQuat, t: ReadonlyVec3): Quat2
    function fromTranslation(out: ReadonlyQuat2, t: ReadonlyVec3): Quat2
    function fromRotation(out: ReadonlyQuat2, q: ReadonlyQuat): Quat2
    function fromMat4(out: Quat2, a: ReadonlyMat4): Quat2
    function copy(out: Quat2, a: ReadonlyQuat2): Quat2
    function identity(out: Quat2): Quat2
    function set(out: Quat2, x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number): Quat2
    function getReal(out: Quat, a: ReadonlyQuat2): Quat
    function getDual(out: Quat, a: ReadonlyQuat2): Quat
    function setReal(out: Quat2, a: ReadonlyQuat): Quat2
    function setDual(out: Quat2, q: ReadonlyQuat): Quat2
    function getTranslation(out: Vec3, a: ReadonlyQuat2): Vec3
    function translate(out: Quat2, a: ReadonlyQuat2, v: ReadonlyVec3): Quat2
    function rotateX(out: Quat2, a: ReadonlyQuat2, rad: number): Quat2
    function rotateY(out: Quat2, a: ReadonlyQuat2, rad: number): Quat2
    function rotateZ(out: Quat2, a: ReadonlyQuat2, rad: number): Quat2
    function rotateByQuatAppend(out: Quat2, a: ReadonlyQuat2, q: ReadonlyQuat): Quat2
    function rotateByQuatPrepend(out: Quat2, q: ReadonlyQuat, a: ReadonlyQuat2): Quat2
    function rotateAroundAxis(out: Quat2, a: ReadonlyQuat2, axis: ReadonlyVec3, rad: number): Quat2
    function add(out: Quat2, a: ReadonlyQuat2, b: ReadonlyQuat2): Quat2
    function multiply(out: Quat2, a: ReadonlyQuat2, b: ReadonlyQuat2): Quat2
    function mul(out: Quat2, a: ReadonlyQuat2, b: ReadonlyQuat2): Quat2
    function scale(out: Quat2, a: ReadonlyQuat2, b: number): Quat2
    function dot(a: ReadonlyQuat2, b: ReadonlyQuat2): number
    function lerp(out: Quat2, a: ReadonlyQuat2, b: ReadonlyQuat2, t: number): Quat2
    function invert(out: Quat2, a: ReadonlyQuat2): Quat2
    function conjugate(out: Quat2, a: ReadonlyQuat2): Quat2
    function length(a: ReadonlyQuat2): number
    function len(a: ReadonlyQuat2): number
    function squaredLength(a: ReadonlyQuat2): number
    function sqrLen(a: ReadonlyQuat2): number
    function normalize(out: Quat2, a: ReadonlyQuat2): Quat2
    function str(a: ReadonlyQuat2): string
    function exactEquals(a: ReadonlyQuat2, b: ReadonlyQuat2): boolean
    function equals(a: ReadonlyQuat2, b: ReadonlyQuat2): boolean
  }
}