const brainQuickGraphics = new Graphics(document.getElementById('mainCanvas') as HTMLCanvasElement).setSize(800, 600)

const brainQuick = new BrainQuick()
brainQuick.initialize(2, 1, 1)

brainQuickGraphics.bg()
drawBrain(brainQuick, brainQuickGraphics)

function drawBrain(b: BrainQuick, g: Graphics) {
  const positions: Map<NodeLike, Vec2> = new Map<NodeLike, Vec2>()

  const brainNodes = (() => {
    const t = []
    for (let i = 0; i < b.nodes.length; i += 4) {
      t.push(b.nodes.slice(i, i + 4))
    }
    return t
  })() as NodeLike[]

  const maxLayer = (() => {
    let t = 0
    for (const node of brainNodes) {
      const layer = node[3]
      if (layer > t) t = layer
    }
    return t
  })()

  const dx = g.width / (maxLayer + 2)

  for (let i = 0; i <= maxLayer; i++) {
    const currLayer = brainNodes.filter(node => node[3] == i)
    const dy = g.height / (currLayer.length + 1)
    for (let j = 0; j < currLayer.length; j++) {
      positions.set(currLayer[j], vec2.fromValues((i + 1) * dx, (j + 1) * dy))
    }
  }

  const whiteCircles: Circle[] = []
  const redCircles: Circle[] = []
  const blueCircles: Circle[] = []

  g.fillStyle = '#fff'
  g.font = '10px arial'
  g.textBaseline = 'middle'
  g.textAlign = 'center'

  for (const [node, pos] of positions) {
    const px = pos[0]
    const py = pos[1]
    whiteCircles.push(new Circle(px, py, 10))
    redCircles.push(new Circle(px + 7, py, 3))
    blueCircles.push(new Circle(px - 7, py, 3))
    g.fillText(node[3].toString(), px, py + 17)
    g.fillText(`${node[0]} (${node[2]})`, px, py - 15)
  }

  const brainConnections = (() => {
    const t = []
    for (let i = 0; i < b.connections.length; i += 5) {
      t.push(b.connections.slice(i, i + 5))
    }
    return t
  })() as ConnectionLike[]

  const enabledConnections: Line[] = []
  const disabledConnections: Line[] = []
  const recurrentConnections: Line[] = []

  for (const connection of brainConnections) {
    const inputNode = brainNodes.find(node => node[0] == connection[0])
    const outputNode = brainNodes.find(node => node[0] == connection[1])
    const inputNodePos = positions.get(inputNode)
    const outputNodePos = positions.get(outputNode)

    const point1 = vec2.create()
    const point2 = vec2.create()
    vec2.add(point1, inputNodePos, vec2.fromValues(7, 0))
    vec2.add(point2, outputNodePos, vec2.fromValues(-7, 0))
    const line = new Line(point1[0], point1[1], point2[0], point2[1])

    if (connection[2] == 1) {
      if (inputNode[3] > outputNode[3]) recurrentConnections.push(line)
      else enabledConnections.push(line)
    } else disabledConnections.push(line)
  }

  g.fillStyle = '#fff'
  whiteCircles.forEach(circle => circle.fill(g))
  g.fillStyle = '#f00'
  redCircles.forEach(circle => circle.fill(g))
  g.fillStyle = '#00f'
  blueCircles.forEach(circle => circle.fill(g))

  g.lineWidth = 1
  if (enabledConnections.length > 0) {
    g.strokeStyle = '#0f0'
    enabledConnections.forEach(line => line.stroke(g))
  }
  if (disabledConnections.length > 0) {
    g.strokeStyle = '#f00'
    disabledConnections.forEach(line => line.stroke(g))
  }
  if (recurrentConnections.length > 0) {
    g.strokeStyle = '#22f'
    recurrentConnections.forEach(line => line.stroke(g))
  }

  g.textAlign = 'left'
  g.textBaseline = 'top'
  g.fillStyle = '#fff'
}