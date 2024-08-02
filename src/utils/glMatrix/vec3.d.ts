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

declare type Vec3 = IndexedCollection
  | [number, number, number]

declare type ReadonlyVec3 = IndexedCollection
  | readonly [number, number, number]

declare namespace glMatrix {
  namespace vec3 {
    function create(): Vec3
    function clone(a: ReadonlyVec3): Vec3
    function length(a: ReadonlyVec3): number
    function fromValues(x: number, y: number, z: number): Vec3
    function copy(out: Vec3, a: ReadonlyVec3): Vec3
    function set(out: Vec3, x: number, y: number, z: number): Vec3
    function add(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3
    function subtract(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3
    function multiply(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3
    function divide(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3
    function ceil(out: Vec3, a: ReadonlyVec3): Vec3
    function floor(out: Vec3, a: ReadonlyVec3): Vec3
    function min(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3
    function max(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3
    function round(out: Vec3, a: ReadonlyVec3): Vec3
    function scale(out: Vec3, a: ReadonlyVec3, b: number): Vec3
    function scaleAndAdd(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, scale: number): Vec3
    function distance(a: ReadonlyVec3, b: ReadonlyVec3): number
    function squaredDistance(a: ReadonlyVec3, b: ReadonlyVec3): number
    function squaredLength(a: ReadonlyVec3): number
    function negate(out: Vec3, a: ReadonlyVec3): Vec3
    function inverse(out: Vec3, a: ReadonlyVec3): Vec3
    function normalize(out: Vec3, a: ReadonlyVec3): Vec3
    function dot(a: ReadonlyVec3, b: ReadonlyVec3): number
    function cross(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3
    function lerp(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, t: number): Vec3
    function slerp(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, t: number): Vec3
    function hermite(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, c: ReadonlyVec3, d: ReadonlyVec3, t: number): Vec3
    function bezier(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, c: ReadonlyVec3, d: ReadonlyVec3, t: number): Vec3
    function random(out: Vec3, scale?: number): Vec3
    function transformMat4(out: Vec3, a: ReadonlyVec3, m: ReadonlyMat4): Vec3
    function transformMat3(out: Vec3, a: ReadonlyVec3, m: ReadonlyMat3): Vec3
    function transformQuat(out: Vec3, a: ReadonlyVec3, q: ReadonlyQuat): Vec3
    function rotateX(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, rad: number): Vec3
    function rotateY(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, rad: number): Vec3
    function rotateZ(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, rad: number): Vec3
    function angle(a: ReadonlyVec3, b: ReadonlyVec3): number
    function zero(out: Vec3): Vec3
    function str(a: ReadonlyVec3): string
    function exactEquals(a: ReadonlyVec3, b: ReadonlyVec3): boolean
    function equals(a: ReadonlyVec3, b: ReadonlyVec3): boolean
    function sub(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3
    function mul(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3
    function div(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3
    function dist(a: ReadonlyVec3, b: ReadonlyVec3): number
    function sqrDist(a: ReadonlyVec3, b: ReadonlyVec3): number
    function len(a: ReadonlyVec3): number
    function sqrLen(a: ReadonlyVec3): number
    function forEach(a: Vec3[], stride: number, offset: number, count: number, fn: Function, arg?: object): Vec3[]
  }
}