interface GameInfo {
  frameCounter: number
  width: number
  height: number
}

interface AsteroidsGameInfo extends GameInfo {
  asteroidsDestroyed: number
  game: AsteroidsGame
}

interface ShipInfo {
  game: AsteroidsGame
  ship: Ship
  alive: boolean
  posX: number
  posY: number
  velX: number
  velY: number
  heading: number
  canShoot: boolean
}

interface AsteroidInfo {
  game: AsteroidsGame
  asteroid: Asteroid
  velX: number
  velY: number
  angleFromShip: number
  distanceFromShip: number
  size: number
}

interface AsteroidsEventMap {
  'start': CustomEvent<AsteroidsGameInfo>
  'end': CustomEvent<AsteroidsGameInfo>
  'update': CustomEvent<AsteroidsGameInfo>
  'shipcreated': CustomEvent<ShipInfo>
  'shipdestroyed': CustomEvent<ShipInfo>
  'asteroidcreated': CustomEvent<AsteroidInfo>
  'asteroiddestroyed': CustomEvent<AsteroidInfo>
}

interface AsteroidsGame extends EventTarget {
  addEventListener<K extends keyof AsteroidsEventMap>(type: K, listener: (this: AsteroidsGame, ev: AsteroidsEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void
  removeEventListener<K extends keyof AsteroidsEventMap>(type: K, listener: (this: AsteroidsGame, ev: AsteroidsEventMap[K]) => void, options?: boolean | EventListenerOptions): void
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}


// interface GameEventMap {
//   'start': GameEvent
//   'end': GameEvent
//   'update': GameEvent
// }

// interface GameEvent {
//   readonly target: AsteroidsGame | null
//   readonly type: string
// }

// interface GameEventListener {
//   (evt: GameEvent): void
// }

// interface GameEventListenerObject {
//   handleEvent(object: GameEvent): void
// }

// type GameEventListenerOrGameEventListenerObject = GameEventListener | GameEventListenerObject

// interface GameAddEventListenerOptions {
//   once?: boolean
// }

// interface GameEventTarget {
//   addEventListener(type: string, callback: GameEventListenerOrGameEventListenerObject | null, options?: GameAddEventListenerOptions): void;
//   dispatchEvent(event: GameEvent): boolean;
//   removeEventListener(type: string, callback: GameEventListenerOrGameEventListenerObject | null): void;
// }

// class GameEvent {
//   constructor(type: string) {
//   }

//   // static #Start: GameEvent = new GameEvent('start')
//   // static #End: GameEvent = new GameEvent('end')
//   // static #FrameUpdate: GameEvent = new GameEvent('frame update')

//   // symbol: Symbol

//   // constructor(type: string) {
//   //   this.symbol = Symbol(type)
//   // }

//   // static get Start(): GameEvent { return GameEvent.#Start }
//   // static get End(): GameEvent { return GameEvent.#End }
//   // static get FrameUpdate(): GameEvent { return GameEvent.#FrameUpdate }
// }