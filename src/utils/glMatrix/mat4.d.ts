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

declare type Mat4 = IndexedCollection
  | [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number]

declare type ReadonlyMat4 = IndexedCollection
  | readonly [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number]

declare namespace glMatrix {
  namespace mat4 {
    function create(): Mat4
    function clone(a: ReadonlyMat4): Mat4
    function copy(out: Mat4, a: ReadonlyMat4): Mat4
    function fromValues(m00: number, m01: number, m02: number, m03: number, m10: number, m11: number, m12: number, m13: number, m20: number, m21: number, m22: number, m23: number, m30: number, m31: number, m32: number, m33: number): Mat4
    function set(out: Mat4, m00: number, m01: number, m02: number, m03: number, m10: number, m11: number, m12: number, m13: number, m20: number, m21: number, m22: number, m23: number, m30: number, m31: number, m32: number, m33: number): Mat4
    function identity(out: Mat4): Mat4
    function transpose(out: Mat4, a: ReadonlyMat4): Mat4
    function invert(out: Mat4, a: ReadonlyMat4): Mat4
    function adjoint(out: Mat4, a: ReadonlyMat4): Mat4
    function determinant(a: ReadonlyMat4): number
    function multiply(out: Mat4, a: ReadonlyMat4, b: ReadonlyMat4): Mat4
    function translate(out: Mat4, a: ReadonlyMat4, v: ReadonlyVec3): Mat4
    function scale(out: Mat4, a: ReadonlyMat4, v: ReadonlyVec3): Mat4
    function rotate(out: Mat4, a: ReadonlyMat4, rad: number, axis: ReadonlyVec3): Mat4
    function rotateX(out: Mat4, a: ReadonlyMat4, rad: number): Mat4
    function rotateY(out: Mat4, a: ReadonlyMat4, rad: number): Mat4
    function rotateZ(out: Mat4, a: ReadonlyMat4, rad: number): Mat4
    function fromTranslation(out: Mat4, v: ReadonlyVec3): Mat4
    function fromScaling(out: Mat4, v: ReadonlyVec3): Mat4
    function fromRotation(out: Mat4, rad: number, axis: ReadonlyVec3): Mat4
    function fromXRotation(out: Mat4, rad: number): Mat4
    function fromYRotation(out: Mat4, rad: number): Mat4
    function fromZRotation(out: Mat4, rad: number): Mat4
    function fromRotationTranslation(out: Mat4, q: ReadonlyQuat, v: ReadonlyVec3): Mat4
    function fromQuat2(out: Mat4, a: ReadonlyQuat2): Mat4
    function getTranslation(out: Vec3, mat: ReadonlyMat4): Vec3
    function getScaling(out: Vec3, mat: ReadonlyMat4): Vec3
    function getRotation(out: Quat, mat: ReadonlyMat4): Quat
    function decompose(out_r: Quat, out_t: Vec3, out_s: Vec3, mat: ReadonlyMat4): Quat
    function fromRotationTranslationScale(out: Mat4, q: Quat, v: ReadonlyVec3, s: ReadonlyVec3): Mat4
    function fromRotationTranslationScaleOrigin(out: Mat4, q: Quat, v: ReadonlyVec3, s: ReadonlyVec3, o: ReadonlyVec3): Mat4
    function fromQuat(out: Mat4, q: ReadonlyQuat): Mat4
    function frustum(out: Mat4, left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4
    function perspectiveNO(out: Mat4, fovy: number, aspect: number, near: number, far: number): Mat4
    function perspective(out: Mat4, fovy: number, aspect: number, near: number, far: number): Mat4
    function perspectiveZO(out: Mat4, fovy: number, aspect: number, near: number, far: number): Mat4
    function perspectiveFromFieldOfView(out: Mat4, fov: { upDegrees: number, downDegrees: number, leftDegrees: number, rightDegrees: number }, near: number, far: number): Mat4
    function orthoNO(out: Mat4, left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4
    function ortho(out: Mat4, left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4
    function orthoZO(out: Mat4, left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4
    function lookAt(out: Mat4, eye: ReadonlyVec3, center: ReadonlyVec3, up: ReadonlyVec3): Mat4
    function targetTo(out: Mat4, eye: ReadonlyVec3, target: ReadonlyVec3, up: ReadonlyVec3): Mat4
    function str(a: ReadonlyMat4): string
    function frob(a: ReadonlyMat4): number
    function add(out: Mat4, a: ReadonlyMat4, b: ReadonlyMat4): Mat4
    function subtract(out: Mat4, a: ReadonlyMat4, b: ReadonlyMat4): Mat4
    function multiplyScalar(out: Mat4, a: ReadonlyMat4, b: number): Mat4
    function multiplyScalarAndAdd(out: Mat4, a: ReadonlyMat4, b: ReadonlyMat4, scale: number): Mat4
    function exactEquals(a: ReadonlyMat4, b: ReadonlyMat4): boolean
    function equals(a: ReadonlyMat4, b: ReadonlyMat4): boolean
    function mul(out: Mat4, a: ReadonlyMat4, b: ReadonlyMat4): Mat4
    function sub(out: Mat4, a: ReadonlyMat4, b: ReadonlyMat4): Mat4
  }
}