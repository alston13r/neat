/**
 * The brain is the main class in the neat algorithm. From the neat algorithm, a brain
 * differs from the ordinary fulley connected neural networks in that its topology, or
 * the number of nodes and which connections between them exist, can change. This class
 * houses the necessary methods and fields needed to augment its topology and process
 * data.
 */
class Brain {
    constructor(population) {
        /** The current fitness of the brain */
        this.fitness = 0;
        /** The adjusted fitness of the brain, this is the fitness normalized by its species */
        this.fitnessAdjusted = 0;
        /** The current species this brain belongs to, null if none assigned */
        this.species = null;
        /** Boolean indicating if the brain is an elite from the prior generation */
        this.isElite = false;
        this.population = population;
    }
    initialize(inputN, hiddenN, outputN, enabledChance = 1) {
        this.nodes = [];
        this.inputNodes = [];
        this.outputNodes = [];
        const toConnect = [[], []];
        for (let i = 0; i < inputN; i++) {
            const node = new NNode(this.nodes.length + 1, NNodeType.Input, 0);
            this.nodes.push(node);
            this.inputNodes.push(node);
            toConnect[0].push(node);
        }
        for (let i = 0; i < outputN; i++) {
            let node = new NNode(this.nodes.length + 1, NNodeType.Output, 0);
            this.nodes.push(node);
            this.outputNodes.push(node);
            toConnect[1].push(node);
        }
        if (hiddenN > 0) {
            toConnect[2] = toConnect[1];
            toConnect[1] = [];
            for (let i = 0; i < hiddenN; i++) {
                let node = new NNode(this.nodes.length + 1, NNodeType.Hidden, 0);
                this.nodes.push(node);
                toConnect[1].push(node);
            }
        }
        this.connections = [];
        for (let i = 1; i < toConnect.length; i++) {
            const layerA = toConnect[i - 1];
            const layerB = toConnect[i];
            for (let inNode of layerA) {
                for (let outNode of layerB) {
                    this.connections.push(new Connection(inNode, outNode, Connection.GenerateRandomWeight(), Math.random() < enabledChance, false));
                }
            }
        }
        this.fixLayers();
        return this;
    }
    /**
     * This is a helper method to reassign layer numbers to the brain's nodes. This goes through
     * the array of nodes and checks for all nodes with no incoming connections, these nodes go into
     * the first layer. Then, it removes all outgoing connections from these first layer nodes and
     * repeats the process by looking at all the nodes with no incoming connections. These nodes will
     * belong to the second layer and the process repeats. This method also fixes any recurrent
     * connections that may be affected by the restructuring of the Brain's topology. Recurrent
     * connections between nodes on the same layer are not allowed so they will be disabled, and
     * recurrent connections where the incoming node's layer is less than the outgoing is no longer
     * a recurrent connection.
     */
    fixLayers() {
        const tNodeArr = this.nodes.map(node => {
            return {
                node,
                connectionsIn: node.connectionsIn.filter(connection => !connection.recurrent),
                connectionsOut: node.connectionsOut.filter(connection => !connection.recurrent)
            };
        });
        let layer = 1;
        let toProcess = tNodeArr.filter(tNode => tNode.connectionsIn.length == 0);
        while (toProcess.length > 0) {
            for (let tNode of toProcess) {
                tNode.node.layer = layer;
                tNodeArr.splice(tNodeArr.indexOf(tNode), 1);
                for (let connectionOut of tNode.connectionsOut) {
                    for (let outNode of tNodeArr) {
                        const index = outNode.connectionsIn.indexOf(connectionOut);
                        if (index >= 0) {
                            outNode.connectionsIn.splice(index, 1);
                        }
                    }
                }
            }
            toProcess = tNodeArr.filter(tNode => tNode.connectionsIn.length == 0);
            layer++;
        }
        if (Brain.AllowRecurrent) {
            for (let connection of this.connections.filter(c => c.recurrent)) {
                const aLayer = connection.inNode.layer;
                const bLayer = connection.outNode.layer;
                if (aLayer == bLayer) {
                    connection.enabled = false;
                }
                else if (aLayer < bLayer) {
                    connection.recurrent = false;
                }
            }
        }
    }
    /**
     * Helper method to add a new node to the brain's topology during the mutation process. This
     * method takens a random enabled forward (non-recurrent) connection and inserts a node
     * in the middle. The original connection is disabled, with a connection forming between
     * from the first node to the new node as well as from the new node to the second node.
     * The first connection inherits the weight of the original while the second is randomized.
     * A call to the brain's fixLayers() method is made to ensure proper topology is maintained.
     */
    addANode() {
        let forward = this.connections.filter(x => x.enabled && !x.recurrent);
        if (forward.length == 0)
            return;
        let chosen = forward[Math.floor(Math.random() * forward.length)];
        chosen.enabled = false;
        let newNode = new NNode(this.nodes.length + 1, NNodeType.Hidden, chosen.outNode.layer);
        let connectionIn = new Connection(chosen.inNode, newNode, chosen.weight, true, false);
        let connectionOut = new Connection(newNode, chosen.outNode, Math.random() * 20 - 10, true, false);
        this.connections.push(connectionIn, connectionOut);
        this.nodes.push(newNode);
        this.fixLayers();
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
                this.connections.push(new Connection(node1, node2, Math.random() * 20 - 10, true, node1.layer > node2.layer));
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
        this.inputNodes.map((node, i) => node.sumOutput = inputs[i]);
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
        for (let currLayerI = 2; currLayerI <= this.outputNodes[0].layer; currLayerI++) {
            const currLayer = this.nodes.filter(node => node.layer == currLayerI);
            for (let node of currLayer) {
                node.sumInput = 0;
                for (let connectionIn of node.connectionsIn) {
                    if (connectionIn.enabled)
                        node.sumInput += connectionIn.inNode.sumOutput * connectionIn.weight;
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
     * Clones this brain's topology and returns the clone.
     * @returns the clone
     */
    clone() {
        const clone = new Brain(this.population);
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
            return new Connection(tNodeArr[connection.inNode.id], tNodeArr[connection.outNode.id], connection.weight, connection.enabled, connection.recurrent);
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
     * Sets the local reference for graphics to the specified object.
     * @param graphics the graphics to set
     * @returns a refrence to this population
     */
    setGraphics(graphics) {
        this.graphics = graphics;
        return this;
    }
    /**
     * Draws this brain to the local graphics.
     * @param options the options to draw the brain with
     */
    draw(options = {}) {
        options.xOffset || (options.xOffset = 0);
        options.yOffset || (options.yOffset = 0);
        options.maxWidth || (options.maxWidth = this.graphics.width);
        options.maxHeight || (options.maxHeight = this.graphics.height);
        options.outline || (options.outline = false);
        const nodePositions = new Map();
        const maxLayer = this.outputNodes[0].layer;
        const dx = options.maxWidth / (maxLayer + 1);
        for (let i = 1; i <= maxLayer; i++) {
            const currNodes = this.nodes.filter(n => n.layer == i);
            const dy = options.maxHeight / (currNodes.length + 1);
            for (let j = 1; j <= currNodes.length; j++) {
                nodePositions.set(currNodes[j - 1], new Vector(i * dx + options.xOffset, j * dy + options.yOffset));
            }
        }
        const circleArray = [];
        const textArray = [];
        for (let [node, pos] of nodePositions) {
            circleArray.push(this.graphics.createCircle(pos.x, pos.y, 10, true, '#fff')); // base
            circleArray.push(this.graphics.createCircle(pos.x + 7, pos.y, 3, true, '#f00')); // input
            circleArray.push(this.graphics.createCircle(pos.x - 7, pos.y, 3, true, '#00f')); // output
            textArray.push(this.graphics.createText(node.layer.toString(), pos.x, pos.y + 17));
            textArray.push(this.graphics.createText(`${node.id} (${node.activationFunction.name})`, pos.x, pos.y - 15));
        }
        const connectionArray = [];
        for (let connection of this.connections) {
            const inputNodePos = nodePositions.get(connection.inNode);
            const outputNodePos = nodePositions.get(connection.outNode);
            let color = '#0f0';
            if (!connection.enabled)
                color = '#f00';
            else if (connection.recurrent)
                color = '#22f';
            const point1 = inputNodePos.add(new Vector(7, 0));
            const point2 = outputNodePos.sub(new Vector(7, 0));
            connectionArray.push(this.graphics.createLine(point1.x, point1.y, point2.x, point2.y, color));
        }
        circleArray.forEach(circle => circle.draw());
        connectionArray.forEach(line => line.draw());
        textArray.forEach(text => text.draw());
        this.graphics.createText(this.fitness.toString(), 10, 10, '#fff', 10, 'left', 'top').draw();
        if (options.outline) {
            this.graphics.createRectangle(options.xOffset, options.yOffset, options.maxWidth, options.maxHeight, false, '#fff', true, 1).draw();
        }
    }
}
/** Toggle for new connections */
Brain.AllowNewConnections = true;
/** Toggle for connection disabling */
Brain.AllowDisablingConnections = false;
/** Toggle for allowing recurrent connections */
Brain.AllowRecurrent = false;
/** The chance for a new connection to be made */
Brain.AddConnectionChance = 0.4;
/** The chance for a connection to be disabled */
Brain.DisableConnectionChance = 0.05;
/** The chance for a connection to be reenabled */
Brain.ReenableConnectionChance = 0.25;
/** Toggle for new nodes */
Brain.AllowNewNodes = true;
/** The chance for a new node to be made */
Brain.AddANodeChance = 0.03;
//# sourceMappingURL=Brain.js.map