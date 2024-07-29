declare interface NeatNodeSerial {
  id: number,
  type: number
  layer: number
  bias: number
  connectionsIn: number[]
  connectionsOut: number[]
  activationFunction: string
}

declare interface ConnectionSerial {
  id: number
  inNode: number
  outNode: number
  weight: number
  enabled: boolean
  recurrent: boolean
  innovationID: number
}

declare interface BrainSerial {
  nodes: NeatNodeSerial[]
  connections: ConnectionSerial[]
}