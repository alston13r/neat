class FakeBrain {
    constructor() {
        this.fitnessAdjusted = Math.random() * 2 - 1;
        this.species = FakeSpecies.TempList[Math.floor(Math.random() * 3)];
        this.species.members.push(this);
    }
}
class FakeSpecies {
    constructor() {
        this.members = [];
    }
    getAverageFitnessAdjusted() {
        let sum = 0;
        this.members.forEach(member => sum += member.fitnessAdjusted);
        return sum / this.members.length;
    }
}
FakeSpecies.TempList = [new FakeSpecies(), new FakeSpecies(), new FakeSpecies()];
class FakePopulation {
    constructor(size) {
        this.popSize = size;
        this.members = new Array(size).fill(0).map(() => new FakeBrain());
    }
    get speciesList() {
        const arr = [];
        this.members.forEach(member => {
            if (member.species != null && !arr.includes(member.species))
                arr.push(member.species);
        });
        return arr;
    }
    getAverageFitnessAdjusted() {
        let sum = 0;
        this.members.forEach(member => sum += member.fitnessAdjusted);
        return sum / this.popSize;
    }
    calculateAllowedOffspring() {
        const max = this.popSize;
        const avg = this.getAverageFitnessAdjusted();
        console.log(`Population: Average fitness <${avg}>`);
        const list = [...this.speciesList];
        list.forEach(species => species.allowedOffspring = species.getAverageFitnessAdjusted() / (avg == 0 ? 1 : avg) * species.members.length);
        list.forEach(species => {
            console.log(`Species: Average fitness <${species.getAverageFitnessAdjusted()}> Allowed offspring, <${species.allowedOffspring}>`);
        });
        list.sort((a, b) => {
            const c = a.allowedOffspring - Math.floor(a.allowedOffspring);
            const d = b.allowedOffspring - Math.floor(b.allowedOffspring);
            if (c == d)
                return b.allowedOffspring - a.allowedOffspring;
            return d - c;
        });
        const min = list.reduce((sum, curr) => sum + Math.floor(curr.allowedOffspring), 0);
        const roundUpCount = Math.min(max - min, list.length);
        console.log(`Min <${min}>, Round up count <${roundUpCount}>`);
        for (let i = 0; i < roundUpCount; i++) {
            const species = list.shift();
            species.allowedOffspring = Math.ceil(species.allowedOffspring);
        }
        for (let species of list) {
            species.allowedOffspring = Math.floor(species.allowedOffspring);
        }
    }
}
let fakePop = new FakePopulation(100);
fakePop.calculateAllowedOffspring();
fakePop.speciesList.forEach(species => console.log(species.allowedOffspring));
// const graphics = new Graphics().setSize(800, 1200).appendTo(document.body)
// const population: Population = new Population(100, 2, 0, 1).setGraphics(graphics)
// graphics.bg()
// setInterval(() => {
//   graphics.bg()
//   population.nextGeneration()
//   population.members.forEach(member => member.fitness = Math.random() * 2 - 1)
//   population.speciate()
//   population.draw()
// }, 500)
// const graphics = new Graphics().setSize(800, 1500).appendTo(document.body)
// const desired = TrainingValues.XOR
// const neat = new Neat().setGraphics(graphics)
// neat.findSolution(desired, desired.length * desired.outputSize - 0.05, 100).then(solution => {
//   graphics.bg()
//   solution.setGraphics(graphics).draw()
// })
//# sourceMappingURL=index.js.map