/**
 * The brain is the main class in the neat algorithm. From the neat algorithm, a brain
 * differs from the ordinary fulley connected neural networks in that its topology, or
 * the number of nodes and which connections between them exist, can change. This class
 * houses the necessary methods and fields needed to augment its topology and process
 * data.
 */
class Brain {
    /** Toggle for new connections */
    static AllowNewConnections = true;
    /** Toggle for connection disabling */
    static AllowDisablingConnections = false;
    /** Toggle for allowing recurrent connections */
    static AllowRecurrent = false;
    /** The chance for a new connection to be made */
    static AddConnectionChance = 0.4;
    /** The chance for a connection to be disabled */
    static DisableConnectionChance = 0.05;
    /** The chance for a connection to be reenabled */
    static ReenableConnectionChance = 0.25;
    /** Toggle for new nodes */
    static AllowNewNodes = true;
    /** The chance for a new node to be made */
    static AddANodeChance = 0.01;
    /** The current fitness of the brain */
    fitness = 0;
    /** The current species this brain belongs to, null if none assigned */
    species = null;
    /** An array of the brain's nodes */
    nodes = [];
    /** An array of the brain's input nodes */
    inputNodes = [];
    /** An array of the brain's output nodes */
    outputNodes = [];
    /** An array of the brain's connections */
    connections = [];
    /** Boolean indicating if the brain is an elite from the prior generation */
    isElite = false;
    /**
     * Initializes the brain's topology to contain the specified number of input nodes,
     * hidden nodes, output nodes, and enabled chance.
     * @param inputN the number of input nodes
     * @param hiddenN the number of hidden nodes
     * @param outputN the number of output nodes
     * @param enabledChance the chance for connections to start enabled, defaults to 100%
     * @returns a reference to this Brain
     */
    initialize(inputN, hiddenN, outputN, enabledChance = 1) {
        this.nodes.length = 0;
        this.inputNodes.length = 0;
        this.outputNodes.length = 0;
        const toConnect = [[], []];
        for (let i = 0; i < inputN; i++) {
            const node = new NNode(this.nodes.length, NNodeType.Input, 0);
            this.nodes.push(node);
            this.inputNodes.push(node);
            toConnect[0].push(node);
        }
        const outputLayer = hiddenN > 0 ? 2 : 1;
        for (let i = 0; i < outputN; i++) {
            let node = new NNode(this.nodes.length, NNodeType.Output, outputLayer);
            this.nodes.push(node);
            this.outputNodes.push(node);
            toConnect[1].push(node);
        }
        if (hiddenN > 0) {
            toConnect[2] = toConnect[1];
            toConnect[1] = [];
            for (let i = 0; i < hiddenN; i++) {
                let node = new NNode(this.nodes.length, NNodeType.Hidden, 1);
                this.nodes.push(node);
                toConnect[1].push(node);
            }
        }
        this.connections.length = 0;
        for (let i = 1; i < toConnect.length; i++) {
            const layerA = toConnect[i - 1];
            const layerB = toConnect[i];
            for (let inNode of layerA) {
                for (let outNode of layerB) {
                    this.connections.push(new Connection(this.connections.length, inNode, outNode, Connection.GenerateRandomWeight(), Math.random() < enabledChance, false));
                }
            }
        }
        return this;
    }
    /**
     * Helper method to fix recurrent connections after modifying the brain's topology.
     * Recurrent connections cannot exist between two nodes on the same layer nor if the
     * output layer is greater than the input layer (that's just a regular connection).
     * Disables recurrent connections between nodes of the same layer and removes the
     * recurrent flag if it's no longer recurrent.
     */
    fixRecurrent() {
        if (!Brain.AllowRecurrent)
            return;
        const recurrent = this.connections.filter(c => c.recurrent);
        if (recurrent.length == 0)
            return;
        for (const connection of recurrent) {
            const inputLayer = connection.inNode.layer;
            const outputLayer = connection.outNode.layer;
            if (inputLayer == outputLayer)
                connection.enabled = false;
            else if (outputLayer > inputLayer)
                connection.recurrent = false;
        }
    }
    /**
     * Helper method to add a new node to the brain's topology during the mutation process. This
     * method takens a random enabled forward connection and inserts a node. The original connection
     * is disabled, with new connections forming accordingly. The first connection is identical to
     * the original and the second is randomized.
     */
    addANode() {
        const forwardArr = this.connections.filter(x => x.enabled && !x.recurrent);
        if (forwardArr.length == 0)
            return;
        const forwardIntercept = forwardArr[Math.floor(Math.random() * forwardArr.length)];
        forwardIntercept.enabled = false;
        const inputNode = forwardIntercept.inNode;
        const outputNode = forwardIntercept.outNode;
        const newNode = new NNode(this.nodes.length, NNodeType.Hidden, inputNode.layer + 1);
        this.nodes.push(newNode);
        this.connections.push(new Connection(this.connections.length, inputNode, newNode, forwardIntercept.weight, true, false));
        this.connections.push(new Connection(this.connections.length, newNode, outputNode, Connection.GenerateRandomWeight(), true, false));
        if (outputNode.layer > newNode.layer)
            return;
        outputNode.layer++;
        const potentialConflicts = outputNode.connectionsOut.map(i => this.connections[i]).filter(c => !c.recurrent);
        while (potentialConflicts.length > 0) {
            const connection = potentialConflicts.splice(0, 1)[0];
            let outputNode = connection.outNode;
            if (outputNode.layer > connection.inNode.layer)
                continue;
            outputNode.layer++;
            potentialConflicts.push(...outputNode.connectionsOut.map(i => this.connections[i]).filter(c => !c.recurrent));
        }
        this.fixRecurrent();
    }
    /**
     * Helper method to add a new connection to the brain's topology during the mutation process.
     * This method takes two random nodes, does some sanity checks, and creates a connection between
     * them. A maximum of 20 iterations are used to find a valid pair of nodes. A valid pair of nodes
     * are nodes not on the same layer and the nodes are not the same. If the first node's layer is
     * less than the second node's, aka the first comes before the second, no additional checks are
     * needed. If the first node comes after the second node, the recurrent connections flag needs
     * to be enabled for the connection to be made. If the nodes are valid, the connection has a
     * random weight, is enabled, and recurrent when appropriate.
     */
    addAConnection() {
        for (let i = 0; i < 20; i++) {
            let node1 = this.nodes[Math.floor(Math.random() * this.nodes.length)];
            let node2 = this.nodes[Math.floor(Math.random() * this.nodes.length)];
            if (node1 == node2
                || node1.layer > node2.layer && !Brain.AllowRecurrent
                || node1.layer == node2.layer)
                continue;
            const innovationID = Innovations.GetInnovationID(node1, node2);
            let c = this.connections.filter(x => x.innovationID == innovationID)[0];
            if (c != undefined) {
                if (c.enabled)
                    continue;
                if (Math.random() < Brain.ReenableConnectionChance) {
                    c.enabled = true;
                    break;
                }
            }
            else {
                this.connections.push(new Connection(this.connections.length, node1, node2, Connection.GenerateRandomWeight(), true, node1.layer > node2.layer));
                break;
            }
        }
    }
    /**
     * Helper method to disable a connection in the brain's topology during the mutation process.
     * This method selects a random enabled connection and disables it. A maximum of 20 iterations
     * are used to find a valid connection.
     */
    disableAConnection() {
        for (let i = 0; i < 20; i++) {
            const connection = this.connections[Math.floor(Math.random() * this.connections.length)];
            if (!connection.enabled)
                continue;
            connection.enabled = false;
            break;
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
        if (this.isElite)
            return;
        // mutate weights
        for (let connection of this.connections) {
            connection.mutate();
        }
        if (Brain.AllowNewConnections && Math.random() < Brain.AddConnectionChance) {
            this.addAConnection(); // add a connection
        }
        else if (Brain.AllowDisablingConnections && Math.random() < Brain.DisableConnectionChance) {
            this.disableAConnection(); // disable a connection
        }
        else if (Brain.AllowNewNodes && Math.random() < Brain.AddANodeChance) {
            this.addANode(); // add a node
        }
        // mutate activation functions and bias
        for (let node of this.nodes) {
            node.mutate();
        }
    }
    /**
     * Loads the specified array of input values to the brain's input nodes.
     * @param inputs the array of inputs
     */
    loadInputs(inputs) {
        inputs.forEach((value, i) => {
            this.inputNodes[i].sumInput = value;
        });
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
        const maxLayer = this.outputNodes[0].layer;
        for (let i = 0; i <= maxLayer; i++) {
            const currentLayer = this.nodes.filter(n => n.layer == i);
            for (const node of currentLayer) {
                if (i > 0) {
                    node.sumInput = 0;
                    for (const connectionInId of node.connectionsIn) {
                        const connectionIn = this.connections[connectionInId];
                        if (connectionIn.enabled)
                            node.sumInput += connectionIn.inNode.sumOutput * connectionIn.weight;
                    }
                }
                node.activate();
            }
        }
    }
    /**
     * Returns an array of the output node layer's values. This is meant to
     * be run after the brain's has propagated values through it.
     * @returns the output node layer's values
     */
    getOutput() {
        return this.outputNodes.map(node => node.sumOutput);
    }
    /**
     * Helper method that will load the specified inputs to the brain's input
     * nodes, run the network, and return the output values.
     * @param inputs an array of inputs
     * @returns the brain's output
     */
    think(inputs) {
        this.loadInputs(inputs);
        this.runTheNetwork();
        return this.getOutput();
    }
    /**
     * Returns the fitter of the two brains.
     * @param brainA the first brain
     * @param brainB the second brain
     */
    static GetFitter(brainA, brainB) {
        return (brainA.fitness > brainB.fitness ? brainA : brainB);
    }
    /**
     * Clones this brain's topology and returns the clone.
     * @returns the clone
     */
    clone() {
        const clone = new Brain();
        // nodes
        clone.nodes = this.nodes.map(node => node.clone());
        // input nodes
        clone.inputNodes = clone.nodes.filter(node => node.type == NNodeType.Input);
        // output nodes
        clone.outputNodes = clone.nodes.filter(node => node.type == NNodeType.Output);
        // connections
        const tNodeArr = [];
        for (let node of clone.nodes) {
            tNodeArr[node.id] = node;
        }
        clone.connections = this.connections.map(connection => {
            return new Connection(connection.id, tNodeArr[connection.inNode.id], tNodeArr[connection.outNode.id], connection.weight, connection.enabled, connection.recurrent);
        });
        return clone;
    }
    /**
     * Creates an offspring of two parent brains. The fitter brain of the two
     * has its topology cloned to the offspring. Any overlapping connections
     * between the parents have an equal chance to be carried over to the offspring.
     * @param brainA the first parent
     * @param brainB the second parent
     * @returns the offspring
     */
    static Crossover(brainA, brainB) {
        if (brainA == brainB)
            return brainA.clone();
        else {
            let offspring;
            let other;
            if (brainA.fitness >= brainB.fitness) {
                offspring = brainA.clone();
                other = brainB;
            }
            else {
                offspring = brainB.clone();
                other = brainA;
            }
            const tConnectionArr = [];
            for (let connection of other.connections) {
                tConnectionArr[connection.innovationID] = connection;
            }
            for (let connection of offspring.connections) {
                const otherConnection = tConnectionArr[connection.innovationID];
                if (otherConnection != undefined) {
                    if (Math.random() > 0.5) {
                        connection.weight = otherConnection.weight;
                    }
                }
            }
            return offspring;
        }
    }
    /**
     * Draws this brain to the local graphics.
     * @param options the options to draw the brain with
     */
    draw(g, maxWidth = 800, maxHeight = 600, xOffset = 0, yOffset = 0) {
        const nodePositions = new Map();
        const maxLayer = this.outputNodes[0].layer;
        const dx = maxWidth / (maxLayer + 2);
        for (let i = 0; i <= maxLayer; i++) {
            const currLayer = this.nodes.filter(n => n.layer == i);
            const dy = maxHeight / (currLayer.length + 1);
            for (let j = 0; j < currLayer.length; j++) {
                nodePositions.set(currLayer[j], vec2.fromValues((i + 1) * dx + xOffset, (j + 1) * dy + yOffset));
            }
        }
        const whiteCircles = [];
        const redCircles = [];
        const blueCircles = [];
        g.fillStyle = '#fff';
        g.font = '10px arial';
        g.textBaseline = 'middle';
        g.textAlign = 'center';
        for (const [node, pos] of nodePositions) {
            const px = pos[0];
            const py = pos[1];
            whiteCircles.push(new Circle(px, py, 10)); // base
            redCircles.push(new Circle(px + 7, py, 3)); // input
            blueCircles.push(new Circle(px - 7, py, 3)); // output
            g.fillText(node.layer.toString(), px, py + 17);
            g.fillText(`${node.id} (${node.activationFunction.name})`, px, py - 15);
        }
        const enabledConnections = [];
        const disabledConnections = [];
        const recurrentConnections = [];
        for (let connection of this.connections) {
            const inputNodePos = nodePositions.get(connection.inNode);
            const outputNodePos = nodePositions.get(connection.outNode);
            const point1 = vec2.create();
            const point2 = vec2.create();
            vec2.add(point1, inputNodePos, vec2.fromValues(7, 0));
            vec2.add(point2, outputNodePos, vec2.fromValues(-7, 0));
            const line = new Line(point1[0], point1[1], point2[0], point2[1]);
            if (connection.enabled) {
                if (connection.recurrent)
                    recurrentConnections.push(line);
                else
                    enabledConnections.push(line);
            }
            else
                disabledConnections.push(line);
        }
        g.fillStyle = '#fff';
        whiteCircles.forEach(circle => circle.fill(g));
        g.fillStyle = '#f00';
        redCircles.forEach(circle => circle.fill(g));
        g.fillStyle = '#00f';
        blueCircles.forEach(circle => circle.fill(g));
        g.lineWidth = 1;
        if (enabledConnections.length > 0) {
            g.strokeStyle = '#0f0';
            enabledConnections.forEach(line => line.stroke(g));
        }
        if (disabledConnections.length > 0) {
            g.strokeStyle = '#f00';
            disabledConnections.forEach(line => line.stroke(g));
        }
        if (recurrentConnections.length > 0) {
            g.strokeStyle = '#22f';
            recurrentConnections.forEach(line => line.stroke(g));
        }
        g.textAlign = 'left';
        g.textBaseline = 'top';
        g.fillStyle = '#fff';
        g.fillText(this.fitness.toString(), xOffset + 10, yOffset + 10);
    }
    static GetPresets() {
        return {
            'AllowNewConnections': Brain.AllowNewConnections,
            'AllowDisablingConnections': Brain.AllowDisablingConnections,
            'AllowRecurrent': Brain.AllowRecurrent,
            'AddConnectionChance': Brain.AddConnectionChance,
            'DisableConnectionChance': Brain.DisableConnectionChance,
            'ReenableConnectionChance': Brain.ReenableConnectionChance,
            'AllowNewNodes': Brain.AllowNewNodes,
            'AddANodeChance': Brain.AddANodeChance
        };
    }
    serialize() {
        return {
            'nodes': this.nodes.map(n => n.serialize()),
            'connections': this.connections.map(c => c.serialize())
        };
    }
    static FromSerial(serial) {
        const brain = new Brain();
        const serialObj = JSON.parse(serial);
        brain.nodes = serialObj.nodes.map(s => NNode.FromSerial(s));
        for (const connection of serialObj.connections) {
            const c = new Connection(connection.id, brain.nodes[connection.inNode], brain.nodes[connection.outNode], connection.weight, connection.enabled, connection.recurrent);
            c.innovationID = connection.innovationID;
            brain.connections.push(c);
        }
        brain.inputNodes = brain.nodes.filter(n => n.type == NNodeType.Input);
        brain.outputNodes = brain.nodes.filter(n => n.type == NNodeType.Output);
        return brain;
    }
}
//# sourceMappingURL=brain.js.map