function randomNodeBias() {
    return Math.random() * 20 - 10;
}
function randomConnectionWeight() {
    return Math.random() * 20 - 10;
}
const DefaultInputActivationFunction = ActivationFunction.Arr.indexOf(ActivationFunction.Identity);
const DefaultHiddenActivationFunction = ActivationFunction.Arr.indexOf(ActivationFunction.Sigmoid);
const DefaultOutputActivationFunction = ActivationFunction.Arr.indexOf(ActivationFunction.Tanh);
const AllowRecurrentConnections = true;
const ReenableConnectionChance = 0.25;
class BrainQuick {
    nodeN = 0;
    nodes = [];
    connections = [];
    initialize(inputN, hiddenN, outputN, connectionChance = 1) {
        this.nodeN = 0;
        this.nodes.length = 0;
        this.connections.length = 0;
        for (let i = 0; i < inputN; i++) {
            this.nodes.push(this.nodeN++, randomNodeBias(), DefaultInputActivationFunction, 0);
        }
        const outputLayer = hiddenN > 0 ? 2 : 1;
        for (let i = 0; i < outputN; i++) {
            this.nodes.push(this.nodeN++, randomNodeBias(), DefaultOutputActivationFunction, outputLayer);
        }
        if (hiddenN > 0) {
            for (let i = 0; i < outputN; i++) {
                this.nodes.push(this.nodeN++, randomNodeBias(), DefaultHiddenActivationFunction, 1);
            }
            const inputNodes = [];
            const hiddenNodes = [];
            const outputNodes = [];
            for (let i = 0; i < this.nodes.length; i += 4) {
                const id = this.nodes[i];
                const layer = this.nodes[i + 3];
                if (layer == 0)
                    inputNodes.push(id);
                else if (layer == 1)
                    hiddenNodes.push(id);
                else if (layer == 2)
                    outputNodes.push(id);
            }
            this.#addConnectionsBetweenNodes(inputNodes, hiddenNodes, connectionChance);
            this.#addConnectionsBetweenNodes(hiddenNodes, outputNodes, connectionChance);
        }
        else {
            const inputNodes = [];
            const outputNodes = [];
            for (let i = 0; i < this.nodes.length; i += 4) {
                const id = this.nodes[i];
                const layer = this.nodes[i + 3];
                if (layer == 0)
                    inputNodes.push(id);
                else if (layer == 1)
                    outputNodes.push(id);
            }
            this.#addConnectionsBetweenNodes(inputNodes, outputNodes, connectionChance);
        }
        this.#sortConnectionsByLayer();
    }
    logNodes() {
        for (let i = 0; i < this.nodes.length; i += 4) {
            const id = this.nodes[i];
            const bias = this.nodes[i + 1];
            const fn = this.nodes[i + 2];
            const layer = this.nodes[i + 3];
            console.log(`Node<id=${id}, bias=${bias}, fn=${fn}, layer=${layer}>`);
        }
    }
    logConnections() {
        for (let i = 0; i < this.connections.length; i += 5) {
            const input = this.connections[i];
            const output = this.connections[i + 1];
            const enabled = this.connections[i + 2];
            const weight = this.connections[i + 3];
            const innovation = this.connections[i + 4];
            console.log(`Connection<input=${input}, output=${output}, enabled=${enabled == 1 ? 'true' : 'false'}, weight=${weight}, innovation=${innovation}>`);
        }
    }
    #addConnectionsBetweenNodes(a, b, c) {
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < b.length; j++) {
                if (Math.random() < c) {
                    const A = a[i], B = b[j];
                    this.connections.push(A, B, 1, randomConnectionWeight(), Innovations.GetInnovationID(A, B));
                }
            }
        }
    }
    #sortNodesByLayer() {
        insertionSortItemsInArr(this.nodes, 4, 3);
    }
    #sortNodesById() {
        insertionSortItemsInArr(this.nodes, 4, 0);
    }
    #topologyModified = false;
    #sortConnectionsByLayer() {
        if (this.#topologyModified = true) {
            this.#sortNodesByLayer();
            const t = [];
            for (let i = 0; i < this.nodes.length; i += 4) {
                const targetNode = this.nodes[i];
                for (let j = 0; j < this.connections.length; j += 5) {
                    const outNode = this.connections[j + 1];
                    if (outNode == targetNode) {
                        t.push(...this.connections.slice(j, j + 5));
                    }
                }
            }
            this.connections = t;
            this.#sortNodesById();
        }
        this.#topologyModified = false;
    }
    sortConnectionsByInputId() {
        insertionSortItemsInArr(this.connections, 5, 0);
    }
    sortConnectionsByOutputId() {
        insertionSortItemsInArr(this.connections, 5, 1);
    }
    mutateNodeAdd() {
        this.#topologyModified = true;
    }
    #fixRecurrent() {
    }
    mutateNodeBias() {
    }
    mutateNodeActivation() {
    }
    mutateConnectionAdd() {
        attempt: for (let i = 0; i < 20; i++) {
            const A = Math.floor(Math.random() * this.nodeN);
            const B = Math.floor(Math.random() * this.nodeN);
            const layerA = this.nodes[A * 4 + 3];
            const layerB = this.nodes[B * 4 + 3];
            if (A == B || layerA == layerB || !AllowRecurrentConnections && layerA > layerB)
                continue;
            for (let j = 0; j < this.connections.length; j += 5) {
                if (A == this.connections[j] && B == this.connections[j + 1]) {
                    if (this.connections[j + 2] == 1)
                        continue attempt;
                    if (Math.random() < ReenableConnectionChance) {
                        this.connections[j + 2] = 1;
                    }
                    break attempt;
                }
            }
            this.connections.push(A, B, 1, randomConnectionWeight(), Innovations.GetInnovationID(A, B));
            this.#topologyModified = true;
        }
    }
    mutateConnectionDisable() {
        for (let i = 0; i < 20; i++) {
            const index = Math.floor(Math.random() * this.connections.length / 5);
            if (this.connections[index + 2] == 0)
                continue;
            this.connections[index + 2] = 1;
            break;
        }
    }
    mutateConnectionWeight() {
    }
}
const swapItemsInArr = (() => {
    let t;
    return (arr, a, b, stride = 1) => {
        if (a == b)
            return;
        for (let i = 0; i < stride; i++) {
            t = arr[a + i];
            arr[a + i] = arr[b + i];
            arr[b + i] = t;
        }
    };
})();
const insertionSortItemsInArr = (() => {
    let i;
    let j;
    let key;
    return (arr, stride = 1, sortingIndex = 0) => {
        for (i = stride; i < arr.length; i += stride) {
            key = arr[i + sortingIndex];
            j = i - stride;
            while (j >= 0 && arr[j + sortingIndex] > key) {
                swapItemsInArr(arr, j + stride, j, stride);
                j -= stride;
            }
        }
    };
})();
//# sourceMappingURL=quick-brain.js.map