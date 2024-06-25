interface Drawable {
  graphics: Graphics
  draw(): void
}

interface HasSize {
  size: Vector
  width: number
  height: number
}

interface HasPoint {
  point: Vector
  x: number
  y: number
}

interface HasTwoPoints {
  point1: Vector
  point2: Vector
  x1: number
  y1: number
  x2: number
  y2: number
}

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