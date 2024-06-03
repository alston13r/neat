const graphics = new Graphics().setSize(800, 600).appendTo(document.body)
const desired = TrainingValues.XOR
const neat = new Neat().setGraphics(graphics)
neat.findSolution(desired, desired.maxLinearFitnessValue() - 0.05).then(solution => {
  graphics.bg()
  solution.setGraphics(graphics).draw(0, 0, graphics.width, graphics.height)
})