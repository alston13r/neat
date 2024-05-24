const AddConnectionChance = 0.05
const AllowRecurrent = false
const ReenableConnectionChance = 0.25
const AllowNewNodes = true
const AllowNewConnections = true

const AddANodeChance = 0.03

class Brain {
  fitness = 0
  fitnessAdjusted = 0
  species = null

  /**
   * @param {number} inputN
   * @param {number} hiddenN
   * @param {number} outputN
   * @param {number} connPerc
   * @returns {Brain}
   */
  initialize(inputN, hiddenN, outputN, connPerc) {
    this.nodes = []
    this.inputNodes = []
    this.outputNodes = []
    let layer = 1
    for (let i = 0; i < inputN; i++) {
      let node = new NNode(this.nodes.length + 1, NNodeType.Input, layer)
      this.nodes.push(node)
      this.inputNodes.push(node)
    }

    let hiddenNodes
    if (hiddenN > 0) {
      hiddenNodes = []
      layer++
      for (let i = 0; i < hiddenN; i++) {
        let node = new NNode(this.nodes.length + 1, NNodeType.Hidden, layer)
        this.nodes.push(node)
        hiddenNodes.push(node)
      }
    }

    layer++
    for (let i = 0; i < outputN; i++) {
      let node = new NNode(this.nodes.length + 1, NNodeType.Output, layer)
      this.nodes.push(node)
      this.outputNodes.push(node)
    }

    this.connections = []
    if (hiddenNodes) {
      for (let nodeI of this.inputNodes) {
        for (let nodeH of hiddenNodes) {
          if (Math.random() < connPerc) {
            this.connections.push(
              new Connection(
                nodeI, nodeH,
                Math.random() * 20 - 10,
                true, false
              )
            )
          }
        }
      }
      for (let nodeH of hiddenNodes) {
        for (let nodeO of this.outputNodes) {
          if (Math.random() < connPerc) {
            this.connections.push(
              new Connection(
                nodeH, nodeO,
                Math.random() * 20 - 10,
                true, false
              )
            )
          }
        }
      }
    } else {
      for (let nodeI of this.inputNodes) {
        for (let nodeO of this.outputNodes) {
          if (Math.random() < connPerc) {
            this.connections.push(
              new Connection(
                nodeI, nodeO,
                Math.random() * 20 - 10,
                true, false
              )
            )
          }
        }
      }
    }

    return this
  }

  /**
   * @param {function(NNode): boolean} fn 
   * @returns {NNode[]}
   */
  #filterNodes(fn) {
    let res = []
    for (let node of this.nodes) {
      if (fn(node)) res.push(node)
    }
    return res
  }

  fixLayers() {
    let tNodeArr = []
    for (let x of this.nodes) {
      tNodeArr.push({
        node: x,
        connectionsIn: x.connectionsIn.filter(y => !y.recurrent),
        connectionsOut: x.connectionsOut.filter(y => !y.recurrent)
      })
    }

    let layer = 1
    let toProcess = tNodeArr.filter(x => x.connectionsIn.length == 0)
    while (toProcess.length > 0) {
      for (let x of toProcess) {
        x.node.layer = layer
        tNodeArr.splice(tNodeArr.indexOf(x), 1)
        for (let c of x.connectionsOut) {
          for (let y of tNodeArr) {
            let index = y.connectionsIn.indexOf(c)
            if (index >= 0) {
              y.connectionsIn.splice(index, 1)
            }
          }
        }
      }

      toProcess = tNodeArr.filter(x => x.connectionsIn.length == 0)
      layer++
    }

    if (AllowRecurrent) {
      let recurrent = this.connections.filter(c => c.recurrent)
      for (let c of recurrent) {
        let a = c.inNode.layer
        let b = c.outNode.layer
        if (a == b) {
          c.enabled = false
        } else if (a < b) {
          c.recurrent = false
        }
      }
    }
  }

  addANode(override) {
    if (Math.random() < AddANodeChance || override) {
      let forward = this.connections.filter(x => x.enabled && !x.recurrent)
      if (forward.length == 0) return
      let chosen = forward[Math.floor(Math.random() * forward.length)]
      chosen.enabled = false
      let newNode = new NNode(this.nodes.length + 1, NNodeType.Hidden, chosen.outNode.layer)
      let connectionIn = new Connection(chosen.inNode, newNode, chosen.weight, true, false)
      let connectionOut = new Connection(newNode, chosen.outNode, Math.random() * 20 - 10, true, false)
      this.connections.push(connectionIn, connectionOut)
      this.nodes.push(newNode)
      this.fixLayers()
    }
  }

  addAConnection() {
    if (Math.random() < AddConnectionChance) {
      for (let i = 0; i < 20; i++) {
        let node1 = this.nodes[Math.floor(Math.random() * this.nodes.length)]
        let node2 = this.nodes[Math.floor(Math.random() * this.nodes.length)]
        if (
          node1 == node2
          || node1.layer > node2.layer && !AllowRecurrent
          || node1.layer == node2.layer
        ) continue
        let c = this.connections.filter(x => x.innovationID == Connection.GetInnovationID(node1, node2))[0]
        if (c != undefined) {
          if (c.enabled) continue
          if (Math.random() < ReenableConnectionChance) {
            c.enabled = true
            break
          }
        } else {
          this.connections.push(new Connection(node1, node2, Math.random() * 20 - 10, true, node1.layer > node2.layer))
          break
        }
      }
    }
  }

  mutate() {
    if (this.isElite) {
      delete this.isElite
      return
    }

    // mutate weights
    for (let connection of this.connections) {
      connection.mutate()
    }

    // add a connection
    this.addAConnection()

    // add a node
    this.addANode()

    // mutate activation functions and bias
    for (let node of this.nodes) {
      node.mutate()
    }
  }

  /**
   * @param {number[]} arr 
   */
  loadInputs(arr) {
    this.inputNodes.map((node, i) => node.sumOutput = arr[i])
  }

  runTheNetwork() {
    for (let currLayerI = 2; currLayerI <= this.outputNodes[0].layer; currLayerI++) {
      let currLayer = this.#filterNodes(node => node.layer == currLayerI)
      for (let node of currLayer) {
        node.sumInput = 0
        for (let connectionIn of node.connectionsIn) {
          if (connectionIn.enabled) node.sumInput += connectionIn.inNode.sumOutput * connectionIn.weight
        }
        node.activate()
      }
    }
  }

  /**
   * @returns {number[]}
   */
  getOutput() {
    return this.outputNodes.map(node => node.sumOutput)
  }

  adjustFitness() {
    this.fitnessAdjusted = this.fitness / this.species.members.length
  }

  /**
   * @returns {Brain}
   */
  clone() {
    let b = new Brain()

    // species
    if (Population.Speciation) {
      b.species = this.species
      b.species.members.push(b)
    }

    // nodes
    b.nodes = this.nodes.map(x => x.clone())

    // input nodes
    b.inputNodes = b.nodes.filter(x => x.type == NNodeType.Input)

    // output nodes
    b.outputNodes = b.nodes.filter(x => x.type == NNodeType.Output)

    // connections
    let t = []
    for (let n of b.nodes) {
      t[n.id] = n
    }
    b.connections = this.connections.map(c => {
      return new Connection(t[c.inNode.id], t[c.outNode.id], c.weight, c.enabled, c.recurrent)
    })

    return b
  }

  static Crossover(a, b) {
    if (a == b) return a.clone()
    else {
      let offspring
      let other
      if (a.fitness >= b.fitness) {
        offspring = a.clone()
        other = b
      } else {
        offspring = b.clone()
        other = a
      }
      let t = []
      for (let c of other.connections) {
        t[c.innovationID] = c
      }
      for (let c of offspring.connections) {
        let oc = t[c.innovationID]
        if (oc != undefined) {
          if (Math.random() > 0.5) {
            c.weight = oc.weight
          }
        }
      }
      return offspring
    }
  }

  /**
   * @param {Graphics} graphics 
   */
  draw(graphics) {
    let width = graphics.width
    let height = graphics.height

    graphics.bg('#000')

    let nodePositions = new Map()

    let mlayer = this.outputNodes[0].layer
    let dx = width / (mlayer + 1)

    for (let i = 1; i <= mlayer; i++) {
      let currNodes = this.#filterNodes(n => n.layer == i)
      let dy = height / (currNodes.length + 1)
      for (let j = 1; j <= currNodes.length; j++) {
        nodePositions.set(currNodes[j - 1], new Vector(i * dx, j * dy))
      }
    }

    // node circles
    // base is white
    // inputs are red
    // outputs are blue
    let circleArray = []

    // text values
    let textArray = []

    for (let [node, pos] of nodePositions) {
      circleArray.push(new GraphicsCircle(graphics, pos.x, pos.y, 10, '#fff'))
      circleArray.push(new GraphicsCircle(graphics, pos.x + 7, pos.y, 3, '#f00'))
      circleArray.push(new GraphicsCircle(graphics, pos.x - 7, pos.y, 3, '#00f'))
      textArray.push(new GraphicsText(graphics, node.layer, pos.x, pos.y + 17))
      textArray.push(new GraphicsText(graphics, `${node.id} (${node.activationFunction.name})`, pos.x, pos.y - 15))
    }

    // connections
    let lineArray = []

    for (let connection of this.connections) {
      let inputNodePos = nodePositions.get(connection.inNode)
      let outputNodePos = nodePositions.get(connection.outNode)

      let color = '#0f0'
      if (!connection.enabled) color = '#f00'
      else if (connection.recurrent) color = '#22f'
      lineArray.push(new Line(graphics, ...inputNodePos.add(new Vector(7, 0)), ...outputNodePos.sub(new Vector(7, 0)), color))
    }

    circleArray.forEach(circle => circle.draw())
    lineArray.forEach(line => line.draw())
    textArray.forEach(text => text.draw())

    let ytemp = 0
    let weightsInfo = []
    for (let c of this.connections) {
      let str = `${c.inNode.id}-${c.outNode.id} : ${c.weight}`
      weightsInfo.push(new GraphicsText(graphics, str, 0, ytemp))
      ytemp += 10
    }
    graphics.listText(5, 5, weightsInfo, '#fff', 10, new GraphicsText('Weights', 0, 0), '#fff', 20)

    graphics.text(this.fitness, 10, 10, '#fff', 10, 'left', 'top')
  }
}