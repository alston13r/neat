const graphics = new Graphics().setSize(800, 600).appendTo(document.body)
const desired = TrainingValues.XOR
Neat.FindSolution(desired, 0.05).then(solution => {
  graphics.bg()
  solution.setGraphics(graphics).draw()
})