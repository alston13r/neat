class Asteroids extends EventTarget implements Drawable {
  graphics: Graphics

  draw(): void {
    this.graphics.bg()
  }

  setGraphics(graphics: Graphics): Asteroids {
    this.graphics = graphics
    return this
  }

  constructor() {
    super()
  }
}