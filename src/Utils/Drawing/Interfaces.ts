interface Drawable {
  graphics: Graphics
  draw(): void
}

interface HasSize {
  size: Vec2
  width: number
  height: number
}

interface HasPoint {
  point: Vec2
  x: number
  y: number
}

interface HasTwoPoints {
  point1: Vec2
  point2: Vec2
  x1: number
  y1: number
  x2: number
  y2: number
}

interface HasThreePoints {
  point1: Vec2
  point2: Vec2
  point3: Vec2
  x1: number
  y1: number
  x2: number
  y2: number
  x3: number
  y3: number
}