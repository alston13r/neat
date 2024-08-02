class Brain {
    static AllowNewConnections = true;
    static AllowDisablingConnections = false;
    static AllowRecurrent = false;
    static AddConnectionChance = 0.4;
    static DisableConnectionChance = 0.05;
    static ReenableConnectionChance = 0.25;
    static AllowNewNodes = true;
    static AddANodeChance = 0.01;
    fitness = 0;
    species;
    nodes = [];
    inputNodes = [];
    outputNodes = [];
    connections = [];
    #connectionsSorted = [];
    isElite = false;
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
                    this.constructConnection(inNode, outNode, Connection.GenerateRandomWeight(), Math.random() < enabledChance);
                }
            }
        }
        this.#updateSortedConnections();
        return this;
    }
    #updateSortedConnections() {
        if (Population.Speciation) {
            this.#connectionsSorted = this.connections.filter(c => c.enabled).sort((a, b) => a.innovationID - b.innovationID);
        }
    }
    getSortedConnections() {
        return this.#connectionsSorted;
    }
    constructConnection(inputNode, outputNode, weight, enabled = true, recurrent = false) {
        const connectionId = this.connections.length;
        const connection = new Connection(connectionId, inputNode.id, outputNode.id, weight, enabled, recurrent);
        inputNode.connectionsOut.push(connectionId);
        outputNode.connectionsIn.push(connectionId);
        this.connections.push(connection);
        return connection;
    }
    fixRecurrent() {
        if (!Brain.AllowRecurrent)
            return;
        const recurrent = this.connections.filter(c => c.recurrent);
        if (recurrent.length == 0)
            return;
        for (const connection of recurrent) {
            const inputLayer = this.nodes[connection.inNode].layer;
            const outputLayer = this.nodes[connection.outNode].layer;
            if (inputLayer == outputLayer)
                connection.enabled = false;
            else if (outputLayer > inputLayer)
                connection.recurrent = false;
        }
    }
    addANode() {
        const forwardArr = this.connections.filter(x => x.enabled && !x.recurrent);
        if (forwardArr.length == 0)
            return;
        const forwardIntercept = forwardArr[Math.floor(Math.random() * forwardArr.length)];
        forwardIntercept.enabled = false;
        const inputNode = this.nodes[forwardIntercept.inNode];
        const outputNode = this.nodes[forwardIntercept.outNode];
        const newNode = new NNode(this.nodes.length, NNodeType.Hidden, inputNode.layer + 1);
        this.nodes.push(newNode);
        this.constructConnection(inputNode, newNode, forwardIntercept.weight);
        this.constructConnection(newNode, outputNode, Connection.GenerateRandomWeight());
        if (outputNode.layer > newNode.layer)
            return;
        outputNode.layer++;
        const potentialConflicts = outputNode.connectionsOut.map(i => this.connections[i]).filter(c => !c.recurrent);
        while (potentialConflicts.length > 0) {
            const connection = potentialConflicts.splice(0, 1)[0];
            const outputNode = this.nodes[connection.outNode];
            if (outputNode.layer > this.nodes[connection.inNode].layer)
                continue;
            outputNode.layer++;
            potentialConflicts.push(...outputNode.connectionsOut.map(i => this.connections[i]).filter(c => !c.recurrent));
        }
        this.fixRecurrent();
        this.#updateSortedConnections();
    }
    addAConnection() {
        attempt: for (let i = 0; i < 20; i++) {
            const A = Math.floor(Math.random() * this.nodes.length);
            const B = Math.floor(Math.random() * this.nodes.length);
            const nodeA = this.nodes[A];
            const nodeB = this.nodes[B];
            if (A == B || nodeA.layer == nodeB.layer
                || nodeA.layer > nodeB.layer && !Brain.AllowRecurrent)
                continue;
            for (const connection of this.connections) {
                if (connection.inNode == A && connection.outNode == B) {
                    if (connection.enabled)
                        continue attempt;
                    if (Math.random() < Brain.ReenableConnectionChance) {
                        connection.enabled = true;
                        break attempt;
                    }
                    else
                        continue attempt;
                }
            }
            this.constructConnection(nodeA, nodeB, Connection.GenerateRandomWeight(), true, nodeA.layer > nodeB.layer);
            this.#updateSortedConnections();
            break attempt;
        }
    }
    disableAConnection() {
        for (let i = 0; i < 20; i++) {
            const connection = this.connections[Math.floor(Math.random() * this.connections.length)];
            if (!connection.enabled)
                continue;
            connection.enabled = false;
            break;
        }
    }
    mutate() {
        if (this.isElite)
            return;
        for (let connection of this.connections) {
            connection.mutate();
        }
        if (Brain.AllowNewConnections && Math.random() < Brain.AddConnectionChance) {
            this.addAConnection();
        }
        else if (Brain.AllowDisablingConnections && Math.random() < Brain.DisableConnectionChance) {
            this.disableAConnection();
        }
        else if (Brain.AllowNewNodes && Math.random() < Brain.AddANodeChance) {
            this.addANode();
        }
        for (let node of this.nodes) {
            node.mutate();
        }
    }
    loadInputs(inputs) {
        inputs.forEach((value, i) => {
            this.inputNodes[i].sumInput = value;
        });
    }
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
                            node.sumInput += this.nodes[connectionIn.inNode].sumOutput * connectionIn.weight;
                    }
                }
                node.activate();
            }
        }
    }
    getOutput() {
        return this.outputNodes.map(node => node.sumOutput);
    }
    think(inputs) {
        this.loadInputs(inputs);
        this.runTheNetwork();
        return this.getOutput();
    }
    static GetFitter(brainA, brainB) {
        return (brainA.fitness > brainB.fitness ? brainA : brainB);
    }
    clone() {
        const clone = new Brain();
        clone.nodes = this.nodes.map(node => node.clone());
        clone.inputNodes = clone.nodes.filter(node => node.type == NNodeType.Input);
        clone.outputNodes = clone.nodes.filter(node => node.type == NNodeType.Output);
        this.connections.forEach(connection => {
            clone.constructConnection(clone.nodes[connection.inNode], clone.nodes[connection.outNode], connection.weight, connection.enabled, connection.recurrent);
        });
        clone.#updateSortedConnections();
        return clone;
    }
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
            for (const connection of other.connections) {
                tConnectionArr[connection.innovationID] = connection;
            }
            for (const connection of offspring.connections) {
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
    static TakeRandomMember(members) {
        return members.splice(Math.floor(Math.random() * members.length), 1)[0];
    }
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
            whiteCircles.push(new Circle(px, py, 10));
            redCircles.push(new Circle(px + 7, py, 3));
            blueCircles.push(new Circle(px - 7, py, 3));
            g.fillText(node.layer.toString(), px, py + 17);
            g.fillText(`${node.id} (${node.activationFunction.name})`, px, py - 15);
        }
        const enabledConnections = [];
        const disabledConnections = [];
        const recurrentConnections = [];
        for (let connection of this.connections) {
            const inputNodePos = nodePositions.get(this.nodes[connection.inNode]);
            const outputNodePos = nodePositions.get(this.nodes[connection.outNode]);
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
}
//# sourceMappingURL=brain.js.map