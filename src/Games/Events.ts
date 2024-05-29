class GameEvent {
  static #Start: GameEvent = new GameEvent('start')
  static #End: GameEvent = new GameEvent('end')
  static #FrameUpdate: GameEvent = new GameEvent('frame update')
  static #GraphicsSet: GameEvent = new GameEvent('graphics set')

  symbol: Symbol

  constructor(type: string) {
    this.symbol = Symbol(type)
  }

  static get Start(): GameEvent { return GameEvent.#Start }
  static get End(): GameEvent { return GameEvent.#End }
  static get FrameUpdate(): GameEvent { return GameEvent.#FrameUpdate }
  static get GraphicsSet(): GameEvent { return GameEvent.#GraphicsSet }
}