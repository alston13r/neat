/* Start of matrix.js file */

class Matrix {
	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;
		this.data = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
	}
	
	static copy(a) {
		let result = new Matrix(a.rows, a.cols);
		result.map((e,i,j) => a.data[i][j]);
		return result;
	}
	
	copy() {
		let result = new Matrix(this.rows, this.cols);
		result.map((e,i,j) => this.data[i][j]);
		return result;
	}
	
	static fromArray(arr) {
		return new Matrix(arr.length, 1).map((e,i) => arr[i]);
	}
	
	toArray() {
		let arr = [];
		for (let i=0;i<this.rows;i++) {
			for (var j=0;j<this.cols;j++) {
				arr.push(this.data[i][j]);
			}
		}
		return arr;
	}
	
	randomize() {
		return this.map(e => Math.random()*2-1);
	}
	
	add(a) {
		if (a instanceof Matrix) {
			if (this.rows !== a.rows || this.cols !== a.cols) {
				return console.log('Add - Cols and Rows must match');
			}
			return this.map((e,i,j) => e + a.data[i][j]);
		} else {
			return this.map(e => e + a);
		}
	}
	
	static subtract(a, b) {
		if (a.rows !== b.rows || a.cols !== b.cols) {
			return console.log('Subtract - Cols and Rows must match');
		}
		let result = new Matrix(a.rows, a.cols);
		result.map((_,i,j) => a.data[i][j] - b.data[i][j]);
		return result;
	}
	
	static transpose(a) {
		let result = new Matrix(a.cols, a.rows);
		result.map((e,i,j) => a.data[j][i]);
		return result;
	}
	
	static multiply(a, b) {
		if (a.cols != b.rows) {
			return console.log('Static Multiply - Cols do not match Rows');
		}
		let result = new Matrix(a.rows, b.cols);
		result.map((e,i,j) => {
			let sum = 0;
			for (let k=0;k<a.cols;k++) {
				sum += a.data[i][k] * b.data[k][j];
			}
			return sum;
		});
		return result;
	}
	
	multiply(n) {
		if (n instanceof Matrix) {
			if (this.rows !== n.rows || this.cols !== n.cols) {
				return console.log('Multiply - Cols do not match Rows');
			}
			return this.map((e,i,j) => e * n.data[i][j]);
		} else {
			return this.map(e => e * n);
		}
	}
	
	map(fn) {
		for (let i=0;i<this.rows;i++) {
			for (let j=0;j<this.cols;j++) {
				let val = this.data[i][j];
				this.data[i][j] = fn(val,i,j);
			}
		}
		return this;
	}
	
	static map(a, fn) {
		let result = new Matrix(a.rows, a.cols);
		result.map((e,i,j) => fn(a.data[i][j], i, j));
		return result;
	}
	
	print() {
		console.table(this.data);
		return this;
	}
}

/* End of matrix.js file */




/* Start of nn.js file */

class ActivationFunction {
	constructor(fn, dfn) {
		this.fn = fn;
		this.dfn = dfn;
	}
}

let sigmoid = new ActivationFunction(
	x => 1 / (1 + Math.exp(-x)),
	y => y * (1 - y)
);

let tanh = new ActivationFunction(
	x => Math.tanh(x),
	y => 1 - (y * y)
);

class NeuralNetwork {
	constructor(input_nodes, hidden_nodes, output_nodes) {
		if (input_nodes instanceof NeuralNetwork) {
			let a = input_nodes;
			this.input_nodes = a.input_nodes;
			this.hidden_nodes = a.hidden_nodes;
			this.output_nodes = a.output_nodes;
			
			this.weights_ih = a.weights_ih.copy();
			this.weights_ho = a.weights_ho.copy();
			this.bias_h = a.bias_h.copy();
			this.bias_o = a.bias_o.copy();
			
			this.setLearningRate(a.learning_rate);
			this.setActivationFunction(a.activation_function);
		} else {
			this.input_nodes = input_nodes;
			this.hidden_nodes = hidden_nodes;
			this.output_nodes = output_nodes;
			
			this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
			this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
			this.weights_ih.randomize();
			this.weights_ho.randomize();
			
			this.bias_h = new Matrix(this.hidden_nodes,1);
			this.bias_o = new Matrix(this.output_nodes,1);
			this.bias_h.randomize();
			this.bias_o.randomize();
			
			this.setLearningRate();
			this.setActivationFunction();
		}
	}
	
	setLearningRate(learning_rate = 0.1) {
		this.learning_rate = learning_rate;
	}
	
	setActivationFunction(fn = sigmoid) {
		this.activation_function = fn;
	}
	
	predict(input_array) {
		let inputs = Matrix.fromArray(input_array);
		let hidden = Matrix.multiply(this.weights_ih, inputs);
		hidden.add(this.bias_h);
		hidden.map(this.activation_function.fn);
		
		let output = Matrix.multiply(this.weights_ho, hidden);
		output.add(this.bias_o);
		output.map(this.activation_function.fn);
		
		return output.toArray();
	}
	
	train(input_array, target_array) {
		let inputs = Matrix.fromArray(input_array);
		let hidden = Matrix.multiply(this.weights_ih, inputs);
		hidden.add(this.bias_h);
		hidden.map(this.activation_function.fn);
		
		let outputs = Matrix.multiply(this.weights_ho, hidden);
		outputs.add(this.bias_o);
		outputs.map(this.activation_function.fn);
		
		let targets = Matrix.fromArray(target_array);
		
		let output_errors = Matrix.subtract(targets, outputs);
		
		let gradients = Matrix.map(outputs, this.activation_function.dfn);
		gradients.multiply(output_errors);
		gradients.multiply(this.learning_rate);
		
		let hidden_T = Matrix.transpose(hidden);
		let weight_ho_deltas = Matrix.multiply(gradients, hidden_T);
		
		this.weights_ho.add(weight_ho_deltas);
		this.bias_o.add(gradients);
		
		let who_t = Matrix.transpose(this.weights_ho);
		let hidden_errors = Matrix.multiply(who_t, output_errors);
		
		let hidden_gradient = Matrix.map(hidden, this.activation_function.dfn);
		hidden_gradient.multiply(hidden_errors);
		hidden_gradient.multiply(this.learning_rate);
		
		let inputs_T = Matrix.transpose(inputs);
		let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);
		
		this.weights_ih.add(weight_ih_deltas);
		this.bias_h.add(hidden_gradient);
	}
	
	mutate(fn) {
		this.weights_ih.map(fn);
		this.weights_ho.map(fn);
		this.bias_h.map(fn);
		this.bias_o.map(fn);
	}
	
	static copy(a) {
		return new NeuralNetwork(a);
	}
	
	copy() {
		return new NeuralNetwork(this);
	}
}

/* End of nn.js file */