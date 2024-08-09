function randomNodeBias() {
  return Math.random() * 20 - 10
}

function randomConnectionWeight() {
  return Math.random() * 20 - 10
}

const DefaultInputActivationFunction = ActivationFunction.Arr.indexOf(ActivationFunction.Identity)
const DefaultHiddenActivationFunction = ActivationFunction.Arr.indexOf(ActivationFunction.Sigmoid)
const DefaultOutputActivationFunction = ActivationFunction.Arr.indexOf(ActivationFunction.Tanh)

const AllowRecurrentConnections = true
const ReenableConnectionChance = 0.25

// /** Toggle for new connections */
// static AllowNewConnections = true
// /** Toggle for connection disabling */
// static AllowDisablingConnections = false

// /** The chance for a new connection to be made */
// static AddConnectionChance = 0.4
// /** The chance for a connection to be disabled */
// static DisableConnectionChance = 0.05
// /** The chance for a connection to be reenabled */
// static ReenableConnectionChance = 0.25
// /** Toggle for new nodes */
// static AllowNewNodes = true
// /** The chance for a new node to be made */
// static AddANodeChance = 0.01

declare type NodeLike = [number, number, number, number]
declare type ConnectionLike = [number, number, number, number, number]

class BrainQuick {
  nodeN: number = 0
  nodes: number[] = [] // [id, bias, activation function, layer]
  connections: number[] = [] // [id in, id out, enabled, weight, innovation]

  initialize(inputN: number, hiddenN: number, outputN: number, connectionChance = 1) {
    this.nodeN = 0
    this.nodes.length = 0
    this.connections.length = 0

    for (let i = 0; i < inputN; i++) {
      this.nodes.push(this.nodeN++, randomNodeBias(), DefaultInputActivationFunction, 0)
    }
    const outputLayer = hiddenN > 0 ? 2 : 1
    for (let i = 0; i < outputN; i++) {
      this.nodes.push(this.nodeN++, randomNodeBias(), DefaultOutputActivationFunction, outputLayer)
    }
    if (hiddenN > 0) {
      for (let i = 0; i < outputN; i++) {
        this.nodes.push(this.nodeN++, randomNodeBias(), DefaultHiddenActivationFunction, 1)
      }

      const inputNodes = []
      const hiddenNodes = []
      const outputNodes = []
      for (let i = 0; i < this.nodes.length; i += 4) {
        const id = this.nodes[i]
        const layer = this.nodes[i + 3]
        if (layer == 0) inputNodes.push(id)
        else if (layer == 1) hiddenNodes.push(id)
        else if (layer == 2) outputNodes.push(id)
      }
      this.#addConnectionsBetweenNodes(inputNodes, hiddenNodes, connectionChance)
      this.#addConnectionsBetweenNodes(hiddenNodes, outputNodes, connectionChance)
    } else {
      const inputNodes = []
      const outputNodes = []
      for (let i = 0; i < this.nodes.length; i += 4) {
        const id = this.nodes[i]
        const layer = this.nodes[i + 3]
        if (layer == 0) inputNodes.push(id)
        else if (layer == 1) outputNodes.push(id)
      }
      this.#addConnectionsBetweenNodes(inputNodes, outputNodes, connectionChance)
    }
    this.#sortConnectionsByLayer()
  }

  logNodes() {
    for (let i = 0; i < this.nodes.length; i += 4) {
      const id = this.nodes[i]
      const bias = this.nodes[i + 1]
      const fn = this.nodes[i + 2]
      const layer = this.nodes[i + 3]
      console.log(`Node<id=${id}, bias=${bias}, fn=${fn}, layer=${layer}>`)
    }
  }

  logConnections() {
    for (let i = 0; i < this.connections.length; i += 5) {
      const input = this.connections[i]
      const output = this.connections[i + 1]
      const enabled = this.connections[i + 2]
      const weight = this.connections[i + 3]
      const innovation = this.connections[i + 4]
      console.log(`Connection<input=${input}, output=${output}, enabled=${enabled == 1 ? 'true' : 'false'}, weight=${weight}, innovation=${innovation}>`)
    }
  }

  #addConnectionsBetweenNodes(a: number[], b: number[], c: number) {
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b.length; j++) {
        if (Math.random() < c) {
          const A = a[i], B = b[j]
          this.connections.push(A, B, 1, randomConnectionWeight(), Innovations.GetInnovationID(A, B))
        }
      }
    }
  }

  #sortNodesByLayer() {
    insertionSortItemsInArr(this.nodes, 4, 3)
  }

  #sortNodesById() {
    insertionSortItemsInArr(this.nodes, 4, 0)
  }

  #topologyModified = false

  #sortConnectionsByLayer() {
    if (this.#topologyModified = true) {
      this.#sortNodesByLayer()

      const t = []
      for (let i = 0; i < this.nodes.length; i += 4) {
        const targetNode = this.nodes[i]
        for (let j = 0; j < this.connections.length; j += 5) {
          const outNode = this.connections[j + 1]
          if (outNode == targetNode) {
            t.push(...this.connections.slice(j, j + 5))
          }
        }
      }
      this.connections = t

      this.#sortNodesById()
    }

    this.#topologyModified = false
  }

  sortConnectionsByInputId() {
    insertionSortItemsInArr(this.connections, 5, 0)
  }

  sortConnectionsByOutputId() {
    insertionSortItemsInArr(this.connections, 5, 1)
  }

  mutateNodeAdd() {
    // const forwardArr = this.connections.filter(x => x.enabled && !x.recurrent)
    // if (forwardArr.length == 0) return
    // const forwardIntercept = forwardArr[Math.floor(Math.random() * forwardArr.length)]
    // forwardIntercept.enabled = false
    // const inputNode = forwardIntercept.inNode
    // const outputNode = forwardIntercept.outNode
    // const newNode = new NNode(this.nodes.length, NNodeType.Hidden, inputNode.layer + 1)
    // this.nodes.push(newNode)
    // this.constructConnection(inputNode, newNode, forwardIntercept.weight)
    // this.constructConnection(newNode, outputNode, Connection.GenerateRandomWeight())
    // if (outputNode.layer > newNode.layer) return
    // outputNode.layer++
    // const potentialConflicts = outputNode.connectionsOut.map(i => this.connections[i]).filter(c => !c.recurrent)
    // while (potentialConflicts.length > 0) {
    //   const connection = potentialConflicts.splice(0, 1)[0]
    //   const outputNode = connection.outNode
    //   if (outputNode.layer > connection.inNode.layer) continue
    //   outputNode.layer++
    //   potentialConflicts.push(...outputNode.connectionsOut.map(i => this.connections[i]).filter(c => !c.recurrent))
    // }
    // this.fixRecurrent()
    // if (Population.Speciation) this.#updateSortedConnections()

    this.#topologyModified = true
  }

  #fixRecurrent() {
    // if (!BrainOOP.AllowRecurrent) return
    // const recurrent = this.connections.filter(c => c.recurrent)
    // if (recurrent.length == 0) return
    // for (const connection of recurrent) {
    //   const inputLayer = connection.inNode.layer
    //   const outputLayer = connection.outNode.layer
    //   if (inputLayer == outputLayer) connection.enabled = false
    //   else if (outputLayer > inputLayer) connection.recurrent = false
    // }
  }

  mutateNodeBias() {
    // if (this.type == NNodeType.Input && NNode.AllowInputBiasMutations
    //   || this.type == NNodeType.Hidden && NNode.AllowHiddenBiasMutations
    //   || this.type == NNodeType.Output && NNode.AllowOutputBiasMutations) { // bias mutation
    //   if (Math.random() < NNode.MutateBiasChance) { // bias weight will be mutated
    //     if (Math.random() < NNode.NudgeBiasChance) { // bias weight will only be nudged by 20%
    //       this.bias += 0.2 * this.bias * (Math.random() > 0.5 ? 1 : -1)
    //     } else { // bias weight will be randomized
    //       this.bias = NNode.GenerateRandomBias()
    //     } // ensure weight is within acceptable bounds
    //     this.clamp()
    //   }
    // }
  }

  mutateNodeActivation() {
    // if (this.type == NNodeType.Input && NNode.AllowInputActivationMutations
    //   || this.type == NNodeType.Hidden && NNode.AllowHiddenActivationMutations
    //   || this.type == NNodeType.Output && NNode.AllowOutputActivationMutations) {
    //   if (Math.random() < NNode.MutateActivationFunctionChance) { // activation function mutation
    //     this.activationFunction = ActivationFunction.Arr[Math.floor(Math.random() * ActivationFunction.Arr.length)]
    //   }
    // }
  }

  mutateConnectionAdd() {
    attempt: for (let i = 0; i < 20; i++) {
      const A = Math.floor(Math.random() * this.nodeN)
      const B = Math.floor(Math.random() * this.nodeN)
      const layerA = this.nodes[A * 4 + 3]
      const layerB = this.nodes[B * 4 + 3]
      if (A == B || layerA == layerB || !AllowRecurrentConnections && layerA > layerB) continue
      for (let j = 0; j < this.connections.length; j += 5) {
        if (A == this.connections[j] && B == this.connections[j + 1]) {
          if (this.connections[j + 2] == 1) continue attempt
          if (Math.random() < ReenableConnectionChance) {
            this.connections[j + 2] = 1
          }
          break attempt
        }
      }
      this.connections.push(A, B, 1, randomConnectionWeight(), Innovations.GetInnovationID(A, B))
      this.#topologyModified = true
    }
  }

  mutateConnectionDisable() {
    for (let i = 0; i < 20; i++) {
      const index = Math.floor(Math.random() * this.connections.length / 5)
      if (this.connections[index + 2] == 0) continue
      this.connections[index + 2] = 1
      break
    }
  }

  mutateConnectionWeight() {

    // if (Connection.AllowWeightMutations
    //   && Math.random() < Connection.MutateWeightChance) { // connection weight will be mutated
    //   if (Math.random() < Connection.NudgeWeightChance) { // weight will only be nudged by 20%
    //     this.weight += 0.2 * this.weight * (Math.random() > 0.5 ? 1 : -1)
    //   } else { // weight will be randomized
    //     this.weight = Connection.GenerateRandomWeight()
    //   } // ensure weight is within acceptable bounds
    //   this.clamp()
    // }
  }

  // nodes array
  // connections array
  // output values array



  // node modification
  // add a node
  // mutate bias
  // mutate activation function

  // connection modification
  // add a connection
  // disable connection
  // enable connection
  // mutate weight
}

const swapItemsInArr = (() => {
  let t: number
  return (arr: number[], a: number, b: number, stride = 1) => {
    if (a == b) return
    for (let i = 0; i < stride; i++) {
      t = arr[a + i]
      arr[a + i] = arr[b + i]
      arr[b + i] = t
    }
  }
})()

const insertionSortItemsInArr = (() => {
  let i: number
  let j: number
  let key: number
  return (arr: number[], stride = 1, sortingIndex = 0) => {
    for (i = stride; i < arr.length; i += stride) {
      key = arr[i + sortingIndex]
      j = i - stride
      while (j >= 0 && arr[j + sortingIndex] > key) {
        swapItemsInArr(arr, j + stride, j, stride)
        j -= stride
      }
    }
  }
})()