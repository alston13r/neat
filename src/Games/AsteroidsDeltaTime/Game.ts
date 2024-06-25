// class DeltaTimeAsteroids extends EventTarget implements Drawable {
//   // static MinAsteroids = 5

//   graphics: Graphics

//   draw(): void {
//     this.graphics.bg()
//   }

//   setGraphics(graphics: Graphics): DeltaTimeAsteroids {
//     this.graphics = graphics
//     return this
//   }

//   ship: DeltaTimeShip

//   createShip(): DeltaTimeShip {
//     this.ship = new DeltaTimeShip(this)
//     this.dispatchEvent(new CustomEvent<DeltaTimeShipInfo>('shipcreated', { detail: this.ship.getInfo() }))
//     return this.ship
//   }

//   update(delta: number): void {
//     this.ship.update(delta)
//   }

//   // initializeAsteroids(): void {

//   // }
// }