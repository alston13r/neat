class NeatSolutionValues {
  static XOR = new NeatSolutionValues([
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
  ])
  static OR = new NeatSolutionValues([
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
  ])
  static AND = new NeatSolutionValues([
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
  ])

  constructor(values) {
    this.values = values || []
  }

  /**
   * @param {number[]} inputs 
   * @param {number[]} outputs 
   * @returns {NeatSolutionValues}
   */
  addValue(inputs, outputs) {
    this.values.push({ inputs, outputs })
    return this
  }

  *ordered() {
    for (let i = 0; i < this.values.length; i++) {
      yield this.values[i]
    }
  }

  *random() {
    let t = [...this.values]
    let m = t.length
    for (let i = 0; i < m; i++) {
      yield t.splice(Math.floor(Math.random() * t.length), 1)[0]
    }
  }

  maxLinearFitnessValue() {
    return this.values.length * this.values[0].outputs.length
  }
}

class Neat {
  /**
   * @param {Graphics} graphics 
   */
  constructor(graphics) {
    this.graphics = graphics
  }

  fragmentGame(Game, population) {
    return population.members.map(member => {
      return {
        member,
        game: new Game(this.graphics.width, this.graphics.height)
      }
    })
  }

  runOnGame(Game) {
    // curr position (x and y)
    // curr velocity (x and y)
    // curr heading
    // can fire
    // position of nearest asteroid (x and y)
    // velocity of nearest asteroid (x and y)
    // angle to nearest asteroid

    // thrusters
    // steering
    // fire
    let population = new Population(50, 7, 0, 3, 1)
    population.generation()
    let fragments = this.fragmentGame(Game, population)
    this.runThroughFragments(fragments)
    population.step2()

    while (population.generationCounter < 1000) {
      population.step1()
      population.generation()
      fragments = this.fragmentGame(Game, population)
      this.runThroughFragments(fragments)
      let fittest = population.getFittest()
      // fittest.draw(this.graphics)
      population.step2()
    }


    console.log(population.getFittest())
  }

  runThroughFragments(fragments) {
    let stillAlive = true
    while (fragments.length > 0 && stillAlive) {
      stillAlive = false
      for (let fragment of [...fragments].reverse()) {
        let member = fragment.member
        let game = fragment.game
        game.update()
        game.collisions()
        if (game.ship.alive) stillAlive = true
        else {
          member.fitness = game.asteroidCounter * 10 + game.updateCounter / 100
          fragments.splice(fragments.indexOf(fragment), 1)
        }
      }
    }
  }

  /**
   * @param {NeatSolutionValues | {inputs: number[], outputs: number[]}[]} values 
   * @param {number} desiredFitness 
   */
  findSolution(values, desiredFitness, updateInterval = 10) {
    let solutionValues = values instanceof NeatSolutionValues ? values : new NeatSolutionValues(values)

    let fitnessFunction = brain => {
      brain.fitness = solutionValues.maxLinearFitnessValue()
      for (let v of solutionValues.random()) {
        brain.loadInputs(v.inputs)
        brain.runTheNetwork()
        let o = brain.getOutput()
        let d = v.outputs.map((exp, i) => Math.abs(exp - o[i]))
        brain.fitness -= d.reduce((sum, curr) => sum + curr, 0)
      }
    }

    let population = new Population(1000, values.values[0].inputs.length, 0, values.values[0].outputs.length, 1)
    population.generation(fitnessFunction)
    population.step2()

    return new Promise((resolve) => {
      let iterate = () => {
        this.graphics.bg()
        // population.draw(this.graphics)
        if (population.fittest != null) {
          population.fittest.draw(this.graphics)
        }
        // this.graphics.circle(200, 200, 50, '#fff', false, 2)
        if (population.fittestEver == null || population.fittestEver.fitness >= desiredFitness) {
          let solution = population.fittestEver
          console.log(`Solution found`)
          solution.loadInputs([0, 0])
          solution.runTheNetwork()
          console.log(`[0, 0] -> [${solution.getOutput().join(', ')}]`)
          solution.loadInputs([0, 1])
          solution.runTheNetwork()
          console.log(`[0, 1] -> [${solution.getOutput().join(', ')}]`)
          solution.loadInputs([1, 0])
          solution.runTheNetwork()
          console.log(`[1, 0] -> [${solution.getOutput().join(', ')}]`)
          solution.loadInputs([1, 1])
          solution.runTheNetwork()
          console.log(`[1, 1] -> [${solution.getOutput().join(', ')}]`)
          return resolve(solution)
        } else {
          population.step1()
          population.generation(fitnessFunction)
          population.step2()

          setTimeout(iterate, updateInterval)
        }
      }
      iterate()
    })
  }

  /**
   * @param {Brain} b 
   * @param {NeatSolutionValues} values 
   */
  calculateLinearFitness(b, values) {
    b.fitness = values.maxLinearFitnessValue()
    for (let v of values.random()) {
      b.loadInputs(v.inputs)
      b.runTheNetwork()
      let o = b.getOutput()
      let d = v.outputs.map((exp, i) => Math.abs(exp - o[i]))
      b.fitness -= d.reduce((sum, curr) => sum + curr, 0)
    }
  }
}