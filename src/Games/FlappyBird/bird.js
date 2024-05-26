function mutate(x) {
	if (random(1) < 0.1) {
		let offset = randomGaussian() * 0.5;
		let newx = x + offset;
		return newx;
	} else {
		return x;
	}
}

class Bird {
	constructor(brain) {
		this.size = 32;
		this.x = 64;
		this.y = height/2;
		
		this.gravity = 0.6;
		this.lift = -15;
		this.velocity = 0;
		
		this.score = 0;
		this.fitness = 0;
		
		if (brain) {
			this.brain = brain.copy();
		} else {
			this.brain = new NeuralNetwork(6,6,1);
		}
		
		this.hitBounds = false;
}
	
	show() {
		stroke(255)
		fill(255,50);
		ellipse(this.x, this.y, this.size, this.size);
	}
	
	up() {
		this.velocity += this.lift;
	}
	
	mutate() {
		this.brain.mutate(mutate);
	}
	
	think(pipes) {
		let closest = null;
		let closestD = Infinity;
		for (let i=0;i<pipes.length;i++) {
			let d = pipes[i].x - this.x;
			if (d < closestD && d > 0) {
				closest = pipes[i];
				closestD = d;
			}
		}
		
		let inputs = [];
		inputs[0] = this.y / height;
		inputs[1] = this.velocity / 15;
		inputs[2] = closest.top / height;
		inputs[3] = closest.bottom / height;
		inputs[4] = closest.x / width;
		inputs[5] = (closest.x+closest.w) / width;
		
		
		let output = this.brain.predict(inputs);
		if (output[0] > 0.5) {
			this.up();
		}
	}
	
	update() {
		this.score++;
		
		this.velocity += this.gravity;
		this.velocity *= 0.95;
		this.y += this.velocity;
		
		if (this.y > height) {
			this.hitBounds = true;
			//this.velocity = 0;
			//this.y = height;
		}
		if (this.y < 0) {
			this.hitBounds = true;
			//this.velocity = 0;
			//this.y = 0;
		}
	}
}