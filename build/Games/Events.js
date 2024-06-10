class GameEvent {
    static #Start = new GameEvent('start');
    static #End = new GameEvent('end');
    static #FrameUpdate = new GameEvent('frame update');
    symbol;
    constructor(type) {
        this.symbol = Symbol(type);
    }
    static get Start() { return GameEvent.#Start; }
    static get End() { return GameEvent.#End; }
    static get FrameUpdate() { return GameEvent.#FrameUpdate; }
}
//# sourceMappingURL=Events.js.map