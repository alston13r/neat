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

declare type Quat = IndexedCollection
  | [number, number, number, number]

declare type ReadonlyQuat = IndexedCollection
  | readonly [number, number, number, number]

declare namespace glMatrix {
  namespace quat {
    function create(): Quat
    function identity(out: Quat): Quat
    function setAxisAngle(out: Quat, axis: ReadonlyVec3, rad: number): Quat
    function getAxisAngle(out_axis: Vec3, q: ReadonlyQuat): number
    function getAngle(a: ReadonlyQuat, b: ReadonlyQuat): number
    function multiply(out: Quat, a: ReadonlyQuat, b: ReadonlyQuat): Quat
    function rotateX(out: Quat, a: ReadonlyQuat, rad: number): Quat
    function rotateY(out: Quat, a: ReadonlyQuat, rad: number): Quat
    function rotateZ(out: Quat, a: ReadonlyQuat, rad: number): Quat
    function calculateW(out: Quat, a: ReadonlyQuat): Quat
    function exp(out: Quat, a: ReadonlyQuat): Quat
    function ln(out: Quat, a: ReadonlyQuat): Quat
    function pow(out: Quat, a: ReadonlyQuat, b: number): Quat
    function slerp(out: Quat, a: ReadonlyQuat, b: ReadonlyQuat, t: number): Quat
    function random(out: Quat): Quat
    function invert(out: Quat, a: ReadonlyQuat): Quat
    function conjugate(out: Quat, a: ReadonlyQuat): Quat
    function fromMat3(out: Quat, m: ReadonlyMat3): Quat
    function fromEuler(out: Quat, x: number, y: number, z: number, order: 'xyz' | 'xzy' | 'yxz' | 'yzx' | 'zxy' | 'zyx'): Quat
    function str(a: ReadonlyQuat): string
    function clone(a: ReadonlyQuat): Quat
    function fromValues(x: number, y: number, z: number, w: number): Quat
    function copy(out: Quat, a: ReadonlyQuat): Quat
    function set(out: Quat, x: number, y: number, z: number, w: number): Quat
    function add(out: Quat, a: ReadonlyQuat, b: ReadonlyQuat): Quat
    function mul(out: Quat, a: ReadonlyQuat, b: ReadonlyQuat): Quat
    function scale(out: Quat, a: ReadonlyQuat, b: number): Quat
    function dot(a: ReadonlyQuat, b: ReadonlyQuat): number
    function lerp(out: Quat, a: ReadonlyQuat, b: ReadonlyQuat, t: number): Quat
    function length(a: ReadonlyQuat): number
    function len(a: ReadonlyQuat): number
    function squaredLength(a: ReadonlyQuat): number
    function sqrLen(a: ReadonlyQuat): number
    function normalize(out: Quat, a: ReadonlyQuat): Quat
    function exactEquals(a: ReadonlyQuat, b: ReadonlyQuat): boolean
    function equals(a: ReadonlyQuat, b: ReadonlyQuat): boolean
    function rotationTo(out: Quat, a: ReadonlyVec3, b: ReadonlyVec3): Quat
    function sqlerp(out: Quat, a: ReadonlyQuat, b: ReadonlyQuat, c: ReadonlyQuat, d: ReadonlyQuat, t: number): Quat
    function setAxes(out: Quat, view: ReadonlyVec3, right: ReadonlyVec3, up: ReadonlyVec3): Quat
  }
}