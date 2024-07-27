/*!
@author Brandon Jones
@author Colin MacKenzie IV
@version 3.4.0

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

interface IndexedCollection extends Iterable<number> {
  readonly length: number
  [index: number]: number
}

declare type Mat2 =
  | [number, number,
    number, number]
  | IndexedCollection

declare type Mat2d =
  | [number, number,
    number, number,
    number, number]
  | IndexedCollection

declare type Mat3 =
  | [number, number, number,
    number, number, number,
    number, number, number]
  | IndexedCollection

declare type Mat4 =
  | [number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number]
  | IndexedCollection

declare type Quat = [number, number, number, number] | IndexedCollection

declare type Quat2 =
  | [number, number, number, number,
    number, number, number, number]
  | IndexedCollection

declare type Vec2 = [number, number] | IndexedCollection
declare type Vec3 = [number, number, number] | IndexedCollection
declare type Vec4 = [number, number, number, number] | IndexedCollection

declare type ReadonlyMat2 =
  | readonly [
    number, number,
    number, number
  ]
  | IndexedCollection

declare type ReadonlyMat2d =
  | readonly [
    number, number,
    number, number,
    number, number
  ]
  | IndexedCollection

declare type ReadonlyMat3 =
  | readonly [
    number, number, number,
    number, number, number,
    number, number, number
  ]
  | IndexedCollection

declare type ReadonlyMat4 =
  | readonly [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number
  ]
  | IndexedCollection

declare type ReadonlyQuat =
  | readonly [number, number, number, number]
  | IndexedCollection

declare type ReadonlyQuat2 =
  | readonly [number, number, number, number, number, number, number, number]
  | IndexedCollection

declare type ReadonlyVec2 = readonly [number, number] | IndexedCollection
declare type ReadonlyVec3 = readonly [number, number, number] | IndexedCollection
declare type ReadonlyVec4 =
  | readonly [number, number, number, number]
  | IndexedCollection

declare namespace glMatrix {
  const EPSILON: number
  let ARRAY_TYPE: Float32ArrayConstructor | ArrayConstructor
  const RANDOM: () => number
  function setMatrixArrayType(type: Float32ArrayConstructor | ArrayConstructor): void
  function toRadian(a: number): number
  function equals(a: number, b: number): boolean

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

  namespace mat3 {
    function create(): Mat3
    function fromMat4(out: Mat3, a: ReadonlyMat4): Mat3
    function clone(a: ReadonlyMat3): Mat3
    function copy(out: Mat3, a: ReadonlyMat3): Mat3
    function fromValues(
      m00: number, m01: number, m02: number,
      m10: number, m11: number, m12: number,
      m20: number, m21: number, m22: number): Mat3
    function set(out: Mat3,
      m00: number, m01: number, m02: number,
      m10: number, m11: number, m12: number,
      m20: number, m21: number, m22: number): Mat3
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

  namespace mat4 {

  }

  namespace quat {

  }

  namespace quat2 {

  }

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