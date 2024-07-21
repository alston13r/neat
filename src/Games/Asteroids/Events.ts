interface AsteroidsGameInfo {
  game: Asteroids
}

interface RayInfo {
  ray: Ray2
  hitting: boolean
  distance: number
}

interface ShipInfo {
  game: Asteroids
  ship: Ship
  alive: boolean
  posX: number
  posY: number
  velX: number
  velY: number
  heading: number
  canShoot: boolean
  rays: RayInfo[]
}

interface AsteroidInfo {
  game: Asteroids
  asteroid: Asteroid
  velX: number
  velY: number
  size: number
}

interface AsteroidsEventMap extends GameEventMap {
  'shipcreated': CustomEvent<ShipInfo>
  'shipdestroyed': CustomEvent<ShipInfo>
  'asteroidcreated': CustomEvent<AsteroidInfo>
  'asteroiddestroyed': CustomEvent<AsteroidInfo>
}

interface Asteroids extends EventTarget {
  addEventListener<K extends keyof AsteroidsEventMap>(type: K, listener: (this: Asteroids, ev: AsteroidsEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void
  removeEventListener<K extends keyof AsteroidsEventMap>(type: K, listener: (this: Asteroids, ev: AsteroidsEventMap[K]) => void, options?: boolean | EventListenerOptions): void
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void
}