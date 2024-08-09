/**
 * The brain is the main class in the neat algorithm. From the neat algorithm, a brain
 * differs from the ordinary fulley connected neural networks in that its topology, or
 * the number of nodes and which connections between them exist, can change. This class
 * houses the necessary methods and fields needed to augment its topology and process
 * data.
 */
class BrainOOP {
  /** Toggle for new connections */
  static AllowNewConnections = true
  /** Toggle for connection disabling */
  static AllowDisablingConnections = false
  /** Toggle for allowing recurrent connections */
  static AllowRecurrent = false
  /** The chance for a new connection to be made */
  static AddConnectionChance = 0.4
  /** The chance for a connection to be disabled */
  static DisableConnectionChance = 0.05
  /** The chance for a connection to be reenabled */
  static ReenableConnectionChance = 0.25
  /** Toggle for new nodes */
  static AllowNewNodes = true
  /** The chance for a new node to be made */
  static AddANodeChance = 0.01

  /** The current fitness of the brain */
  fitness = 0
  /** The current species this brain belongs to, null if none assigned */
  species: Species
  /** An array of the brain's nodes */
  nodes: NNode[] = []
  /** An array of the brain's input nodes */
  inputNodes: NNode[] = []
  /** An array of the brain's output nodes */
  outputNodes: NNode[] = []
  /** An array of the brain's connections */
  connections: Connection[] = []
  /** Array of enabled connections sorted by innovation ID */
  #connectionsSorted: Connection[] = []
  /** Boolean indicating if the brain is an elite from the prior generation */
  isElite = false

  /**
   * Initializes the brain's topology to contain the specified number of input nodes,
   * hidden nodes, output nodes, and enabled chance.
   * @param inputN the number of input nodes
   * @param hiddenN the number of hidden nodes
   * @param outputN the number of output nodes
   * @param enabledChance the chance for connections to start enabled, defaults to 100%
   * @returns a reference to this Brain
   */
  initialize(inputN: number, hiddenN: number, outputN: number, enabledChance = 1) {
    this.nodes.length = 0
    this.inputNodes.length = 0
    this.outputNodes.length = 0
    this.connections.length = 0

    for (let i = 0; i < inputN; i++) {
      const node = new NNode(this.nodes.length, NNodeType.Input, 0)
      this.nodes.push(node)
      this.inputNodes.push(node)
    }
    const outputLayer = hiddenN > 0 ? 2 : 1
    for (let i = 0; i < outputN; i++) {
      const node = new NNode(this.nodes.length, NNodeType.Output, outputLayer)
      this.nodes.push(node)
      this.outputNodes.push(node)
    }
    if (hiddenN > 0) {
      for (let i = 0; i < hiddenN; i++) {
        const node = new NNode(this.nodes.length, NNodeType.Hidden, 1)
        this.nodes.push(node)
        for (const inputNode of this.inputNodes) {
          this.constructConnection(inputNode, node, Connection.GenerateRandomWeight(), Math.random() < enabledChance)
        }
        for (const outputNode of this.outputNodes) {
          this.constructConnection(node, outputNode, Connection.GenerateRandomWeight(), Math.random() < enabledChance)
        }
      }
    } else {
      for (const inputNode of this.inputNodes) {
        for (const outputNode of this.outputNodes) {
          this.constructConnection(inputNode, outputNode, Connection.GenerateRandomWeight(), Math.random() < enabledChance)
        }
      }
    }

    if (Population.Speciation) this.#updateSortedConnections()
    return this
  }

  /**
   * Helper method to update the private sorted connections array using for comparing brains.
   * This does not run if speciation is not enabled.
   */
  #updateSortedConnections() {
    this.#connectionsSorted = this.connections.filter(c => c.enabled).sort((a, b) => a.innovationID - b.innovationID)
  }

  /**
   * Getter for the sorted connections array.
   * @returns the connections sorted by innovation ID
   */
  getSortedConnections() {
    return this.#connectionsSorted
  }

  /**
   * Helper method to construct a connection between two nodes. This constructs the connection
   * as well as inserts it into the two parameter nodes' respective internal arrays.
   * @param inputNode the input node
   * @param outputNode the output node
   * @param weight the weight
   * @param enabled enabled flag
   * @param recurrent recurrent flag
   * @returns the connection
   */
  constructConnection(inputNode: NNode, outputNode: NNode, weight: number, enabled = true, recurrent = false) {
    const connectionId = this.connections.length
    const connection = new Connection(connectionId, inputNode, outputNode, weight, enabled, recurrent)
    inputNode.connectionsOut.push(connectionId)
    outputNode.connectionsIn.push(connectionId)
    this.connections.push(connection)
    return connection
  }

  /**
   * Helper method to fix recurrent connections after modifying the brain's topology.
   * Recurrent connections cannot exist between two nodes on the same layer nor if the
   * output layer is greater than the input layer (that's just a regular connection).
   * Disables recurrent connections between nodes of the same layer and removes the
   * recurrent flag if it's no longer recurrent.
   */
  fixRecurrent() {
    if (!BrainOOP.AllowRecurrent) return
    const recurrent = this.connections.filter(c => c.recurrent)
    if (recurrent.length == 0) return
    for (const connection of recurrent) {
      const inputLayer = connection.inNode.layer
      const outputLayer = connection.outNode.layer
      if (inputLayer == outputLayer) connection.enabled = false
      else if (outputLayer > inputLayer) connection.recurrent = false
    }
  }

  /**
   * Helper method to add a new node to the brain's topology during the mutation process. This
   * method takens a random enabled forward connection and inserts a node. The original connection
   * is disabled, with new connections forming accordingly. The first connection is identical to
   * the original and the second is randomized.
   */
  addANode() {
    const forwardArr = this.connections.filter(x => x.enabled && !x.recurrent)
    if (forwardArr.length == 0) return
    const forwardIntercept = forwardArr[Math.floor(Math.random() * forwardArr.length)]
    forwardIntercept.enabled = false
    const inputNode = forwardIntercept.inNode
    const outputNode = forwardIntercept.outNode
    const newNode = new NNode(this.nodes.length, NNodeType.Hidden, inputNode.layer + 1)
    this.nodes.push(newNode)
    this.constructConnection(inputNode, newNode, forwardIntercept.weight)
    this.constructConnection(newNode, outputNode, Connection.GenerateRandomWeight())
    if (outputNode.layer > newNode.layer) return
    outputNode.layer++
    const potentialConflicts = outputNode.connectionsOut.map(i => this.connections[i]).filter(c => !c.recurrent)
    while (potentialConflicts.length > 0) {
      const connection = potentialConflicts.splice(0, 1)[0]
      const outputNode = connection.outNode
      if (outputNode.layer > connection.inNode.layer) continue
      outputNode.layer++
      potentialConflicts.push(...outputNode.connectionsOut.map(i => this.connections[i]).filter(c => !c.recurrent))
    }
    this.fixRecurrent()
    if (Population.Speciation) this.#updateSortedConnections()
  }

  /**
   * Attempts to add a new random connection in the topology, called during the mutation
   * process. A new connection will be added between any two valid nodes. The checks for
   * valid nodes are: they are not the same node; they are not on the same layer; they are
   * not recurrent when recurrent connections are disabled. When they are valid, a new
   * connection is made with a random weight.
   */
  addAConnection() {
    attempt: for (let i = 0; i < 20; i++) {
      const A = Math.floor(Math.random() * this.nodes.length)
      const B = Math.floor(Math.random() * this.nodes.length)
      const nodeA = this.nodes[A]
      const nodeB = this.nodes[B]

      if (A == B || nodeA.layer == nodeB.layer
        || !BrainOOP.AllowRecurrent && nodeA.layer > nodeB.layer) continue

      for (const connection of this.connections) {
        if (connection.inNode.id == A && connection.outNode.id == B) { // connection already exists
          if (connection.enabled) continue attempt // next attempt
          if (Math.random() < BrainOOP.ReenableConnectionChance) { // reenable connection
            connection.enabled = true
            break attempt
          } else continue attempt // failed to reenable
        }
      } // outside of connection search loop
      // therefore connection does not exist yet
      this.constructConnection(nodeA, nodeB, Connection.GenerateRandomWeight(), true, nodeA.layer > nodeB.layer)
      if (Population.Speciation) this.#updateSortedConnections()
      break attempt
    }
  }

  /**
   * Helper method to disable a connection in the brain's topology during the mutation process.
   * This method selects a random enabled connection and disables it. A maximum of 20 iterations
   * are used to find a valid connection.
   */
  disableAConnection() {
    for (let i = 0; i < 20; i++) {
      const connection = this.connections[Math.floor(Math.random() * this.connections.length)]
      if (!connection.enabled) continue
      connection.enabled = false
      break
    }
  }

  /**
   * Mutates the brain's topology and weights. If this brain is an elite from the previous
   * generation, it is skipped for the mutation process. Connections can have their weights
   * mutated, be it nudged or randomized. New connections can be added to the topology as
   * well as disabled. Nodes can also be added and have their activation functions mutated
   * and bias weights nudged or randomized.
   */
  mutate() {
    if (this.isElite) return

    // mutate weights
    for (let connection of this.connections) {
      connection.mutate()
    }

    if (BrainOOP.AllowNewConnections && Math.random() < BrainOOP.AddConnectionChance) {
      this.addAConnection() // add a connection
    } else if (BrainOOP.AllowDisablingConnections && Math.random() < BrainOOP.DisableConnectionChance) {
      this.disableAConnection() // disable a connection
    } else if (BrainOOP.AllowNewNodes && Math.random() < BrainOOP.AddANodeChance) {
      this.addANode() // add a node
    }

    // mutate activation functions and bias
    for (let node of this.nodes) {
      node.mutate()
    }
  }

  /**
   * Loads the specified array of input values to the brain's input nodes.
   * @param inputs the array of inputs
   */
  loadInputs(inputs: number[]) {
    inputs.forEach((value, i) => {
      this.inputNodes[i].sumInput = value
    })
  }

  /**
   * Goes through the brain's topology, propagating the input values all the way
   * through each connection and node. The propagation process takes a layer of nodes,
   * looks through all incoming connections, and does a weighted sum of all the previous
   * layer's sum output values. Then, a call to the node's activate() method is made which
   * adds the bias and sets the sum output value to whatever is returned by the
   * node's activation function.
   */
  runTheNetwork() {
    for (let i = 0; i <= this.outputNodes[0].layer; i++) {
      const currentLayer = this.nodes.filter(n => n.layer == i)
      for (const node of currentLayer) {
        if (i > 0) {
          node.sumInput = 0
          for (const connectionInId of node.connectionsIn) {
            const connectionIn = this.connections[connectionInId]
            if (connectionIn.enabled) node.sumInput += connectionIn.inNode.sumOutput * connectionIn.weight
          }
        }
        node.activate()
      }
    }
  }

  /**
   * Returns an array of the output node layer's values. This is meant to
   * be run after the brain's has propagated values through it.
   * @returns the output node layer's values
   */
  getOutput() {
    return this.outputNodes.map(node => node.sumOutput)
  }

  /**
   * Helper method that will load the specified inputs to the brain's input
   * nodes, run the network, and return the output values.
   * @param inputs an array of inputs
   * @returns the brain's output
   */
  think(inputs: number[]) {
    this.loadInputs(inputs)
    this.runTheNetwork()
    return this.getOutput()
  }

  /**
   * Returns the fitter of the two brains.
   * @param brainA the first brain
   * @param brainB the second brain
   */
  static GetFitter(brainA: BrainOOP, brainB: BrainOOP) {
    return (brainA.fitness > brainB.fitness ? brainA : brainB)
  }

  /**
   * Clones this brain's topology and returns the clone.
   * @returns the clone
   */
  clone() {
    const clone = new BrainOOP()

    // nodes
    clone.nodes = this.nodes.map(node => node.clone())
    // input nodes
    clone.inputNodes = clone.nodes.filter(node => node.type == NNodeType.Input)
    // output nodes
    clone.outputNodes = clone.nodes.filter(node => node.type == NNodeType.Output)

    // connections
    this.connections.forEach(connection => {
      clone.constructConnection(clone.nodes[connection.inNode.id], clone.nodes[connection.outNode.id],
        connection.weight, connection.enabled, connection.recurrent
      )
    })

    if (Population.Speciation) clone.#updateSortedConnections()

    return clone
  }

  /**
   * Creates an offspring of two parents. The fitter brain of the two
   * has its topology cloned to the offspring. Any overlapping connections
   * between the parents have an equal chance to be carried over to the offspring.
   * @param brainA the first parent
   * @param brainB the second parent
   * @returns the offspring
   */
  static Crossover(brainA: BrainOOP, brainB: BrainOOP) {
    if (brainA == brainB) return brainA.clone()
    else {
      let offspring: BrainOOP
      let other: BrainOOP
      if (brainA.fitness >= brainB.fitness) {
        offspring = brainA.clone()
        other = brainB
      } else {
        offspring = brainB.clone()
        other = brainA
      }
      const tConnectionArr: Connection[] = []
      for (const connection of other.connections) {
        tConnectionArr[connection.innovationID] = connection
      }
      for (const connection of offspring.connections) {
        const otherConnection = tConnectionArr[connection.innovationID]
        if (otherConnection != undefined) {
          if (Math.random() > 0.5) {
            connection.weight = otherConnection.weight
          }
        }
      }
      return offspring
    }
  }

  /**
   * Helper method to take a random member from an array of brains, removing said
   * member from the list and returning it.
   * @param members the list of members to select from
   * @returns the random member
   */
  static TakeRandomMember(members: BrainOOP[]) {
    return members.splice(Math.floor(Math.random() * members.length), 1)[0]
  }

  /**
   * Draws this brain to the local graphics.
   * @param options the options to draw the brain with
   */
  draw(g: Graphics, maxWidth = 800, maxHeight = 600, xOffset = 0, yOffset = 0) {
    const nodePositions = new Map<NNode, Vec2>()

    const maxLayer = this.outputNodes[0].layer
    const dx = maxWidth / (maxLayer + 2)
    for (let i = 0; i <= maxLayer; i++) {
      const currLayer = this.nodes.filter(n => n.layer == i)
      const dy = maxHeight / (currLayer.length + 1)
      for (let j = 0; j < currLayer.length; j++) {
        nodePositions.set(currLayer[j], vec2.fromValues((i + 1) * dx + xOffset, (j + 1) * dy + yOffset))
      }
    }

    const whiteCircles: Circle[] = []
    const redCircles: Circle[] = []
    const blueCircles: Circle[] = []

    g.fillStyle = '#fff'
    g.font = '10px arial'
    g.textBaseline = 'middle'
    g.textAlign = 'center'

    for (const [node, pos] of nodePositions) {
      const px = pos[0]
      const py = pos[1]
      whiteCircles.push(new Circle(px, py, 10)) // base
      redCircles.push(new Circle(px + 7, py, 3)) // input
      blueCircles.push(new Circle(px - 7, py, 3)) // output
      g.fillText(node.layer.toString(), px, py + 17)
      g.fillText(`${node.id} (${node.activationFunction.name})`, px, py - 15)
    }

    const enabledConnections: Line[] = []
    const disabledConnections: Line[] = []
    const recurrentConnections: Line[] = []

    for (const connection of this.connections) {
      const inputNodePos = nodePositions.get(connection.inNode)
      const outputNodePos = nodePositions.get(connection.outNode)

      const point1 = vec2.create()
      const point2 = vec2.create()
      vec2.add(point1, inputNodePos, vec2.fromValues(7, 0))
      vec2.add(point2, outputNodePos, vec2.fromValues(-7, 0))
      const line = new Line(point1[0], point1[1], point2[0], point2[1])

      if (connection.enabled) {
        if (connection.recurrent) recurrentConnections.push(line)
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
    g.fillText(this.fitness.toString(), xOffset + 10, yOffset + 10)
  }
}