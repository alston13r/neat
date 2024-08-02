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

declare type Vec2 = IndexedCollection
  | [number, number]

declare type ReadonlyVec2 = IndexedCollection
  | readonly [number, number]

declare namespace glMatrix {
  namespace vec2 {
    function create(): Vec2
    function clone(a: ReadonlyVec2): Vec2
    function fromValues(x: number, y: number): Vec2
    function copy(out: Vec2, a: ReadonlyVec2): Vec2
    function set(out: Vec2, x: number, y: number): Vec2
    function add(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2
    function subtract(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2
    function multiply(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2
    function divide(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2
    function ceil(out: Vec2, a: ReadonlyVec2): Vec2
    function floor(out: Vec2, a: ReadonlyVec2): Vec2
    function min(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2
    function max(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2
    function round(out: Vec2, a: ReadonlyVec2): Vec2
    function scale(out: Vec2, a: ReadonlyVec2, b: number): Vec2
    function scaleAndAdd(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2, scale: number): Vec2
    function distance(a: ReadonlyVec2, b: ReadonlyVec2): number
    function squaredDistance(a: ReadonlyVec2, b: ReadonlyVec2): number
    function length(a: ReadonlyVec2): number
    function squaredLength(a: ReadonlyVec2): number
    function negate(out: Vec2, a: ReadonlyVec2): Vec2
    function inverse(out: Vec2, a: ReadonlyVec2): Vec2
    function normalize(out: Vec2, a: ReadonlyVec2): Vec2
    function dot(a: ReadonlyVec2, b: ReadonlyVec2): number
    function cross(out: Vec3, a: ReadonlyVec2, b: ReadonlyVec2): Vec3
    function lerp(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2, t: number): Vec2
    function random(out: Vec2, scale?: number): Vec2
    function transformMat2(out: Vec2, a: ReadonlyVec2, m: ReadonlyMat2): Vec2
    function transformMat3(out: Vec2, a: ReadonlyVec2, m: ReadonlyMat3): Vec2
    function transformMat4(out: Vec2, a: ReadonlyVec2, m: ReadonlyMat4): Vec2
    function rotate(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2, rad: number): Vec2
    function angle(a: ReadonlyVec2, b: ReadonlyVec2): number
    function zero(out: Vec2): Vec2
    function str(a: ReadonlyVec2): string
    function exactEquals(a: ReadonlyVec2, b: ReadonlyVec2): boolean
    function equals(a: ReadonlyVec2, b: ReadonlyVec2): boolean
    function len(a: ReadonlyVec2): number
    function sub(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2
    function mul(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2
    function div(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2
    function dist(a: ReadonlyVec2, b: ReadonlyVec2): number
    function sqrDist(a: ReadonlyVec2, b: ReadonlyVec2): number
    function sqrLen(a: ReadonlyVec2): number
    function forEach(a: Vec2[], stride: number, offset: number, count: number, fn: Function, arg?: object): Vec2[]
  }
}