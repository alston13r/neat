class TrainingValues {
    static XOR = new TrainingValues([
        {
            inputs: [0, 0],
            outputs: [0]
        },
        {
            inputs: [0, 1],
            outputs: [1]
        },
        {
            inputs: [1, 0],
            outputs: [1]
        },
        {
            inputs: [1, 1],
            outputs: [0]
        }
    ]);
    static OR = new TrainingValues([
        {
            inputs: [0, 0],
            outputs: [0]
        },
        {
            inputs: [0, 1],
            outputs: [1]
        },
        {
            inputs: [1, 0],
            outputs: [1]
        },
        {
            inputs: [1, 1],
            outputs: [1]
        }
    ]);
    static AND = new TrainingValues([
        {
            inputs: [0, 0],
            outputs: [0]
        },
        {
            inputs: [0, 1],
            outputs: [0]
        },
        {
            inputs: [1, 0],
            outputs: [0]
        },
        {
            inputs: [1, 1],
            outputs: [1]
        }
    ]);
    values;
    inputSize = 0;
    outputSize = 0;
    constructor(values) {
        this.values = values || [];
        if (values != null) {
            this.inputSize = this.values[0].inputs.length;
            this.outputSize = this.values[0].outputs.length;
        }
    }
    addValue(inputs, outputs) {
        if (this.inputSize == 0 || this.outputSize == 0) {
            this.inputSize = inputs.length;
            this.outputSize = outputs.length;
        }
        this.values.push({ inputs, outputs });
        return this;
    }
    size() {
        return this.values.length;
    }
    random() {
        const N = this.values.length;
        const res = new Array(N);
        const temp = this.values.slice();
        for (let i = 0; i < N; i++) {
            res[i] = temp.splice(Math.floor(Math.random() * temp.length), 1)[0];
        }
        return res;
    }
}
//# sourceMappingURL=training-values.js.map