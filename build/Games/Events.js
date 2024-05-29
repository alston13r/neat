var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _GameEvent_Start, _GameEvent_End, _GameEvent_FrameUpdate;
class GameEvent {
    constructor(type) {
        this.symbol = Symbol(type);
    }
    static get Start() { return __classPrivateFieldGet(_a, _a, "f", _GameEvent_Start); }
    static get End() { return __classPrivateFieldGet(_a, _a, "f", _GameEvent_End); }
    static get FrameUpdate() { return __classPrivateFieldGet(_a, _a, "f", _GameEvent_FrameUpdate); }
}
_a = GameEvent;
_GameEvent_Start = { value: new _a('start') };
_GameEvent_End = { value: new _a('end') };
_GameEvent_FrameUpdate = { value: new _a('frame update') };
//# sourceMappingURL=Events.js.map