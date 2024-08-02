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

declare type Vec4 = IndexedCollection
  | [number, number, number, number]

declare type ReadonlyVec4 = IndexedCollection
  | readonly [number, number, number, number]

declare namespace glMatrix {
  namespace vec4 {
    function create(): Vec4
    function clone(a: ReadonlyVec4): Vec4
    function fromValues(x: number, y: number, z: number, w: number): Vec4
    function copy(out: Vec4, a: ReadonlyVec4): Vec4
    function set(out: Vec4, x: number, y: number, z: number, w: number): Vec4
    function add(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4): Vec4
    function subtract(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4): Vec4
    function multiply(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4): Vec4
    function divide(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4): Vec4
    function ceil(out: Vec4, a: ReadonlyVec4): Vec4
    function floor(out: Vec4, a: ReadonlyVec4): Vec4
    function min(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4): Vec4
    function max(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4): Vec4
    function round(out: Vec4, a: ReadonlyVec4): Vec4
    function scale(out: Vec4, a: ReadonlyVec4, b: number): Vec4
    function scaleAndAdd(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4, scale: number): Vec4
    function distance(a: ReadonlyVec4, b: ReadonlyVec4): number
    function squaredDistance(a: ReadonlyVec4, b: ReadonlyVec4): number
    function length(a: ReadonlyVec4): number
    function squaredLength(a: ReadonlyVec4): number
    function negate(out: Vec4, a: ReadonlyVec4): Vec4
    function inverse(out: Vec4, a: ReadonlyVec4): Vec4
    function normalize(out: Vec4, a: ReadonlyVec4): Vec4
    function dot(a: ReadonlyVec4, b: ReadonlyVec4): number
    function cross(out: Vec4, u: ReadonlyVec4, v: ReadonlyVec4, w: ReadonlyVec4): Vec4
    function lerp(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4, t: number): Vec4
    function random(out: Vec4, scale?: number): Vec4
    function transformMat4(out: Vec4, a: ReadonlyVec4, m: ReadonlyMat4): Vec4
    function transformQuat(out: Vec4, a: ReadonlyVec4, q: ReadonlyQuat): Vec4
    function zero(out: Vec4): Vec4
    function str(a: ReadonlyVec4): string
    function exactEquals(a: ReadonlyVec4, q: ReadonlyVec4): boolean
    function equals(a: ReadonlyVec4, q: ReadonlyVec4): boolean
    function sub(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4): Vec4
    function mul(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4): Vec4
    function div(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4): Vec4
    function dist(a: ReadonlyVec4, b: ReadonlyVec4): number
    function sqrDist(a: ReadonlyVec4, b: ReadonlyVec4): number
    function len(a: ReadonlyVec4): number
    function sqrLen(a: ReadonlyVec4): number
    function forEach(a: Vec4[], stride: number, offset: number, count: number, fn: Function, arg?: object): Vec4[]
  }
}