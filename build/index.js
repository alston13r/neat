// const desired = NeatSolutionValues.XOR
// const fitnessFunction = brain => {
//   brain.fitness = desired.maxLinearFitnessValue()
//   for (let v of desired.random()) {
//     brain.loadInputs(v.inputs)
//     brain.runTheNetwork()
//     let o = brain.getOutput()
//     let d = v.outputs.map((exp, i) => Math.abs(exp - o[i]))
//     brain.fitness -= d.reduce((sum, curr) => sum + curr, 0)
//   }
// }
const graphics = new Graphics().setSize(800, 600).appendTo(document.body);
// const population = new Population(1000, 2, 0, 1, 1)
// population.generation(fitnessFunction)
// population.step2()
// population.draw(graphics)
// // let game = new Game(graphics)
// // // // let neat = new Neat(graphics)
// // // // neat.runOnGame(Game)
// // game.addEventListener(GameEvent.ShipDied, () => {
// //   console.log('You died')
// //   wantsToStop = true
// //   console.log(game.asteroidCounter, game.frameCounter)
// // })
// // let keysPressed = {}
// // window.addEventListener('keydown', e => {
// //   keysPressed[e.key] = true
// // })
// // window.addEventListener('keyup', e => {
// //   keysPressed[e.key] = false
// // })
// // let wantsToStop = false
// // function gameLoop() {
// //   graphics.bg()
// //   game.loadInputs(keysPressed)
// //   game.update()
// //   game.draw()
// //   if (!wantsToStop) lastFrame = window.requestAnimationFrame(gameLoop)
// // }
// // let lastFrame = window.requestAnimationFrame(gameLoop)
// // function stopGameLoop() {
// //   wantsToStop = true
// // }
// // GENERATION ZERO
// // create population
// // GENERATION X
// // produce offspring
// // incremement generation counter
// // mutate population
// // OVERLAP
// // fill in any missing spots
// // calculate fitness
// // speciation
// // gens since improved
// // speciation threshold
// // adjust fitness
// // calculate allowed offspring
const desired = TrainingValues.XOR;
// const neat = new Neat().setGraphics(graphics)
// neat.findSolution(desired, desired.maxLinearFitnessValue() - 0.05).then(solution => {
//   graphics.bg()
//   solution.setGraphics(graphics).draw()
// })
const neuralNet = new NeuralNetwork(2, 2, 1);
// for (let pair of desired.ordered()) {
//   console.log('[' + pair.inputs.join(', ') + '] -> [' + neuralNet.feedForward(pair.inputs).join(', ') + ']')
// }
// console.log('Current error: ' + getError())
function getError() {
    let error = 0;
    for (let pair of desired.ordered()) {
        const actual = neuralNet.feedForward(pair.inputs);
        actual.forEach((output, i) => {
            error += Math.abs(pair.outputs[i] - output);
        });
    }
    return error;
}
for (let i = 0; i < 1000000; i++) {
    if (i % 1000 == 0) {
        // if (i != 0 && Math.random() < 0.1) {
        //   neuralNet.mutateWeights()
        // }
        for (let pair of desired.ordered()) {
            console.log('[' + pair.inputs.join(', ') + '] -> [' + neuralNet.feedForward(pair.inputs).join(', ') + ']');
        }
        console.log('Current error: ' + getError());
    }
    neuralNet.backPropagation(desired);
}
// Matrix.Map(new Matrix().numerize(), x => {
//   if (Math.random() < NeuralNetwork.MutateWeightChance) {
//     if (Math.random() < NeuralNetwork.NudgeWeightChance) return x + gauss() * 0.5
//     return NeuralNetwork.GenerateRandomWeight()
//   } return x
// }).print()
// for (let d of data) {
//   console.log(d, n.feedForward(d.input))
// }
// for (let i = 0; i < 50000; i++) {
//   let rData = data[floor(rand(0, data.length)) as number]
//   n.train(rData.input, rData.output)
// }
// for (let d of data) {
//   console.log(d, n.feedForward(d.input))
// }
// let temp: NeuralNetwork = new NeuralNetwork(2, 5)
// console.log(temp.feedForward([1, 2]))
//# sourceMappingURL=index.js.map