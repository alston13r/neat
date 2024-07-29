declare interface HasPath {
  createPath(): Path2D
  appendToPath(path: Path2D): Path2D
}

declare interface Drawable {
  fill?(g: Graphics): void
  stroke?(g: Graphics): void
  draw?(g: Graphics): void
}