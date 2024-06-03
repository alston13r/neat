/**
 * Utility class to help with organizing basic training data. This already includes data
 * for XOR, OR, and AND training.
 */
class TrainingValues {
    /**
     * Constructs a TrainingValues wrapper object for the specified values. If the
     * values are null, then the values are initialized to an empty array.
     * @param values the values
     */
    constructor(values) {
        this.inputSize = 0;
        this.outputSize = 0;
        this.values = values || [];
        if (values != null) {
            this.inputSize = this.values[0].inputs.length;
            this.outputSize = this.values[0].outputs.length;
        }
    }
    /**
     * Adds the specified given inputs and outputs to the internal array.
     * @param inputs the inputs to add
     * @param outputs the outputs to add
     * @returns a reference to this TrainingValues object
     */
    addValue(inputs, outputs) {
        if (this.inputSize == 0 || this.outputSize == 0) {
            this.inputSize = inputs.length;
            this.outputSize = outputs.length;
        }
        this.values.push({ inputs, outputs });
        return this;
    }
    /** The number of training values in this set */
    get length() {
        return this.values.length;
    }
    /**
     * Returns a shalloy copy of the input output values in an ordered sequence.
     * @returns the array values
     */
    get ordered() {
        return [...this.values];
    }
    /**
     * Returns a generator for the local values in a random sequence.
     * @returns the array of values
     */
    get random() {
        const temp = [...this.values];
        const res = [];
        while (temp.length > 0) {
            res.push(temp.splice(Math.floor(Math.random() * temp.length), 1)[0]);
        }
        return res;
    }
}
/** Training data for XOR */
TrainingValues.XOR = new TrainingValues([
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
/** Training data for OR */
TrainingValues.OR = new TrainingValues([
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
/** Training data for AND */
TrainingValues.AND = new TrainingValues([
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
//# sourceMappingURL=TrainingValues.js.map