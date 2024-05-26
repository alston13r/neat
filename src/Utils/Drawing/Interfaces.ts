/**
 * TODO
 */
interface Drawable {
  graphics: Graphics
  draw(): void
}

/**
 * TODO
 */
interface HasSize {
  size: Vector
  width: number
  height: number
}

/**
 * TODO
 */
interface HasPoint {
  point: Vector
  x: number
  y: number
}

/**
 * TODO
 */
interface HasTwoPoints {
  point1: Vector
  point2: Vector
  x1: number
  y1: number
  x2: number
  y2: number
}

/**
 * TODO
 */
interface HasThreePoints {
  point1: Vector
  point2: Vector
  point3: Vector
  x1: number
  y1: number
  x2: number
  y2: number
  x3: number
  y3: number
}