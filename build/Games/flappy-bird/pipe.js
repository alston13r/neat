// class Pipe {
//   gap: number = 105
//   top: number
//   bottom: number
//   x: number
//   width: number
//   speed: number
//   graphics: Graphics
//   highlight: boolean
//   constructor(graphics: Graphics) {
//     this.graphics = graphics
//     this.gap = 105
//     this.top = Math.random() * (graphics.height - this.gap - 50) + 25
//     this.bottom = this.top + this.gap
//     this.x = this.graphics.width
//     this.width = 20
//     this.speed = 2
//   }
//   hits(bird: Bird): boolean {
//     if (bird.y < this.top || bird.y > this.bottom) {
//       if (bird.x > this.x && bird.x < this.x + this.width) {
//         this.highlight = true
//         return true
//       }
//     }
//     this.highlight = false
//   }
//   draw(): void {
//     this.graphics.createRectangle(this.x, 0, this.width, this.top, true, '#fff').draw()
//     this.graphics.createRectangle(this.x, this.bottom, this.width, this.graphics.height - this.bottom, true, '#fff').draw()
//   }
//   update(): void {
//     this.x -= this.speed;
//   }
//   offscreen(): boolean {
//     return this.x < -this.width
//   }
// }
//# sourceMappingURL=pipe.js.map