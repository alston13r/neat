var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _AsteroidEvent_AsteroidDestroyed, _AsteroidEvent_AsteroidCreated, _b, _ShipEvent_ShipDied, _ShipEvent_ShipCreated;
class AsteroidEvent extends GameEvent {
    static get AsteroidDestroyed() { return __classPrivateFieldGet(_a, _a, "f", _AsteroidEvent_AsteroidDestroyed); }
    static get AsteroidCreated() { return __classPrivateFieldGet(_a, _a, "f", _AsteroidEvent_AsteroidCreated); }
}
_a = AsteroidEvent;
_AsteroidEvent_AsteroidDestroyed = { value: new _a('asteroid destroyed') };
_AsteroidEvent_AsteroidCreated = { value: new _a('asteroid created') };
class ShipEvent extends GameEvent {
    static get ShipDied() { return __classPrivateFieldGet(_b, _b, "f", _ShipEvent_ShipDied); }
    static get ShipCreated() { return __classPrivateFieldGet(_b, _b, "f", _ShipEvent_ShipCreated); }
}
_b = ShipEvent;
_ShipEvent_ShipDied = { value: new _b('ship died') };
_ShipEvent_ShipCreated = { value: new _b('ship created') };
//# sourceMappingURL=Events.js.map