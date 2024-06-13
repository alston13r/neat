const xorGraphics = new Graphics().setSize(800, 600).appendTo(document.body);
const xorTrainingValues = TrainingValues.XOR;
const xorNeat = new Neat().setGraphics(xorGraphics);
xorNeat.findSolution(xorTrainingValues, 0.05).then(solution => {
    xorGraphics.bg();
    solution.setGraphics(xorGraphics).draw();
});
//# sourceMappingURL=index.js.map