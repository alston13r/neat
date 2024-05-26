class Pipe {
	constructor() {
		this.gap = 105;
		this.top = random(height-this.gap-50)+25;
		this.bottom = this.top + this.gap;
		this.x = width;
		this.w = 20;
		this.speed = 2;
	}
	
	hits(bird) {
		if (bird.y < this.top || bird.y > this.bottom) {
			if (bird.x > this.x && bird.x < this.x + this.w) {
				this.highlight = true;
				return true;
			}
		}
		this.highlight = false;
	}
	
	show() {
		fill(255);
		rect(this.x, 0, this.w, this.top);
		rect(this.x, this.bottom, this.w, height-this.bottom);
	}
	
	update() {
		this.x -= this.speed;
	}
	
	offscreen() {
		if (this.x < -this.w) {
			return true;
		} else {
			return false;
		}
	}
}