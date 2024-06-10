// class AsteroidEvent extends GameEvent {
//   static #AsteroidDestroyed = new AsteroidEvent('asteroid destroyed')
//   static #AsteroidCreated = new AsteroidEvent('asteroid created')
//   static get AsteroidDestroyed(): AsteroidEvent { return AsteroidEvent.#AsteroidDestroyed }
//   static get AsteroidCreated(): AsteroidEvent { return AsteroidEvent.#AsteroidCreated }
// }

// class ShipEvent extends GameEvent {
//   static #ShipDied = new ShipEvent('ship died')
//   static #ShipCreated = new ShipEvent('ship created')
//   static get ShipDied(): ShipEvent { return ShipEvent.#ShipDied }
//   static get ShipCreated(): ShipEvent { return ShipEvent.#ShipCreated }
// }

// interface ShipEvent {

// }

// interface ShipEventMap extends GameEventMap {
//   'died': GameEvent
//   'created': GameEvent
// }