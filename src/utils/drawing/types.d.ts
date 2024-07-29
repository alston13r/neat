declare interface HasPath {
  createPath(): Path2D
  appendToPath(path: Path2D): Path2D
}

declare interface Drawable {
  fill?(g: Graphics): void
  stroke?(g: Graphics): void
  draw?(g: Graphics): void
}

declare interface HasSize {
  size: Vec2
  width: number
  height: number
}

declare interface HasPoint {
  pos: Vec2
  x: number
  y: number
}

declare interface HasTwoPoints {
  pos1: Vec2
  pos2: Vec2
  x1: number
  y1: number
  x2: number
  y2: number
}

declare interface HasThreePoints {
  pos1: Vec2
  pos2: Vec2
  pos3: Vec2
  x1: number
  y1: number
  x2: number
  y2: number
  x3: number
  y3: number
}