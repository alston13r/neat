class AsteroidEvent extends GameEvent {
    static #AsteroidDestroyed = new AsteroidEvent('asteroid destroyed');
    static #AsteroidCreated = new AsteroidEvent('asteroid created');
    static get AsteroidDestroyed() { return AsteroidEvent.#AsteroidDestroyed; }
    static get AsteroidCreated() { return AsteroidEvent.#AsteroidCreated; }
}
class ShipEvent extends GameEvent {
    static #ShipDied = new ShipEvent('ship died');
    static #ShipCreated = new ShipEvent('ship created');
    static get ShipDied() { return ShipEvent.#ShipDied; }
    static get ShipCreated() { return ShipEvent.#ShipCreated; }
}
//# sourceMappingURL=Events.js.map