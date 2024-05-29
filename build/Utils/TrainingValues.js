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
        this.values = values || [];
    }
    /**
     * Adds the specified given inputs and outputs to the internal array.
     * @param inputs the inputs to add
     * @param outputs the outputs to add
     * @returns a reference to this TrainingValues object
     */
    addValue(inputs, outputs) {
        this.values.push({ inputs, outputs });
        return this;
    }
    /**
     * Returns a generator for the local values in an ordered sequence.
     * @returns the values as a generator
     */
    *ordered() {
        yield* this.values;
    }
    /**
     * Returns a generator for the local values in a random sequence.
     * @returns the values as a generator
     */
    *random() {
        let t = [...this.values];
        let m = t.length;
        for (let i = 0; i < m; i++) {
            yield t.splice(Math.floor(Math.random() * t.length), 1)[0];
        }
    }
    /**
     * Returns the max linear fitness available by these values, simply the number of
     * values multiplies by the size of the output.
     * @returns the max linear fitness
     */
    maxLinearFitnessValue() {
        return this.values.length * this.values[0].outputs.length;
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