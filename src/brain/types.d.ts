declare interface BrainSerial {
  /** [id, bias, activation function, layer] */
  nodes: number[]
  /** [id in, id out, enabled, weight, innovation] */
  connections: number[]
}

declare interface RouletteWheelItem {
  brain: BrainOOP
  value: number
  sum: number
}