class Bird {
  size: number = 32
  x: number = 64
  y: number = graphics.height / 2
  gravity: number = 0.6
  lift: number = -15
  velocity: number = 0
  score: number = 0
  fitness: number = 0
  brain: NeuralNetwork
  hitBounds: boolean = false
  graphics: Graphics

  constructor(brain?: NeuralNetwork) {
    this.brain = brain ? brain.copy() : new NeuralNetwork(6, 6, 1)
  }

  setGraphics(graphics: Graphics): Bird {
    this.graphics = graphics
    return this
  }

  draw(): void {
    this.graphics.createCircle(this.x, this.y, this.size / 2, false, 'rgba(255, 255, 255, 50)', true).draw()
  }

  up(): void {
    this.velocity += this.lift;
  }

  mutate(): void {
    this.brain.mutateWeights()
    this.brain.mutateBiases()
    // this.brain.mutateActivationFunctions()
  }

  think(pipes: Pipe[]): void {
    let closest: Pipe = null;
    let closestD: number = Infinity;
    for (let i in pipes) {
      const d: number = pipes[i].x - this.x
      if (d < closestD && d > 0) {
        closest = pipes[i]
        closestD = d
      }
    }

    const inputs: number[] = []
    inputs[0] = this.y / this.graphics.height
    inputs[1] = this.velocity / 15
    inputs[2] = closest.top / this.graphics.height
    inputs[3] = closest.bottom / this.graphics.height
    inputs[4] = closest.x / this.graphics.width
    inputs[5] = (closest.x + closest.width) / this.graphics.width

    const output: number[] = this.brain.feedForward(inputs)
    if (output[0] > 0.5) this.up()
  }

  update(): void {
    this.score++

    this.velocity += this.gravity
    this.velocity *= 0.95
    this.y += this.velocity

    if (this.y > this.graphics.height) {
      this.hitBounds = true
    }
    if (this.y < 0) {
      this.hitBounds = true
    }
  }
}