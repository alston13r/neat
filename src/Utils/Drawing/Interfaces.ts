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
  pos: Vec2
  x: number
  y: number
}

interface HasTwoPoints {
  pos1: Vec2
  pos2: Vec2
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