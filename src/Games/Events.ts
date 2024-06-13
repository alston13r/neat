interface GameInfo {
  graphics: Graphics
  frameCounter: number
  width: number
  height: number
  game: any
}

interface GameEventMap {
  'start': CustomEvent<GameInfo>
  'end': CustomEvent<GameInfo>
  'update': CustomEvent<GameInfo>
}