interface IndexedCollection extends Iterable<number> {
  readonly length: number;
  [index: number]: number;
}

declare type Mat2 = IndexedCollection
  | [number, number,
  number, number]
declare type Mat2d = IndexedCollection
  | [number, number,
  number, number,
  number, number]
declare type Mat3 = IndexedCollection
  | [number, number, number,
  number, number, number,
  number, number, number]
declare type Mat4 = IndexedCollection
  | [number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number]

declare type Quat = IndexedCollection
  | [number, number, number, number]
declare type Quat2 = IndexedCollection
  | [number, number, number, number,
  number, number, number, number]

declare type Vec2 = IndexedCollection | [number, number]
declare type Vec3 = IndexedCollection | [number, number, number]
declare type Vec4 = IndexedCollection | [number, number, number, number]

declare type ReadonlyMat2 = IndexedCollection
  | readonly
  [number, number,
    number, number]
declare type ReadonlyMat2d = IndexedCollection
  | readonly
  [number, number,
    number, number,
    number, number]
declare type ReadonlyMat3 = IndexedCollection
  | readonly
  [number, number, number,
    number, number, number,
    number, number, number]
declare type ReadonlyMat4 = IndexedCollection
  | readonly
  [number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number]

declare type ReadonlyQuat = IndexedCollection
  | readonly [number, number, number, number]
declare type ReadonlyQuat2 = IndexedCollection
  | readonly [number, number, number, number, number, number, number, number]

declare type ReadonlyVec2 = IndexedCollection | readonly [number, number]
declare type ReadonlyVec3 = IndexedCollection | readonly [number, number, number]
declare type ReadonlyVec4 = IndexedCollection | readonly [number, number, number, number]

const matrix = {
  Epsilon: 0.000001,
  AngleOrder: 'zyx',
  ArrayType: (typeof Float32Array !== undefined) ? Float32Array : Array<number>,
  setMatrixArrayType(type: Float32ArrayConstructor | ArrayConstructor) {
    this.ArrayType = type
  },
  random: Math.random,
  degree: Math.PI / 180,
  radian: 180 / Math.PI,
  toRadian(a: number): number {
    return a * this.degree
  },
  toDegree(a: number) {
    return a * this.radian
  },
  equals(a: number, b: number): boolean {
    return Math.abs(a - b) <= this.Epsilon * Math.max(1, Math.abs(a), Math.abs(b))
  },
  roundSymm(a: number): number {
    if (a >= 0) return Math.round(a)
    return (a % 0.5 === 0) ? Math.floor(a) : Math.round(a)
  }
}