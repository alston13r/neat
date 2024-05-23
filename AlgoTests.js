// let listOfSpecies = []

// class MockBrain {
//   constructor() {
//     this.fitness = Math.random() * 5
//   }
// }

// class MockSpecies {
//   constructor() {

//   }
// }



// function MockCalculate() {

// }



// const globalAvg = this.getAverageFitnessAdjusted()

// const max = this.popSize

// let arr = this.speciesList.map(species => {
//   return { species, temp: species.getAverageFitnessAdjusted() / globalAvg * species.members.length }
// })
// let maxCalculated = arr.reduce((sum, curr) => sum + curr.temp, 0)
// arr.forEach(x => {
//   x.temp = max * x.temp / maxCalculated
// })
// arr.sort((a, b) => {
//   let c = a.temp - Math.floor(a.temp)
//   let d = b.temp - Math.floor(b.temp)
//   if (c == d) return a.temp - b.temp
//   return c - d
// })

// const min = arr.reduce((sum, curr) => sum + Math.floor(curr.temp), 0)
// const diff = max - min
// for (let i = 0; i < diff && arr.length > 0; i++) {
//   let t = arr.pop()
//   t.species.allowedOffspring = Math.ceil(t.temp)
// }
// arr.forEach(t => t.species.allowedOffspring = Math.floor(t.temp))

// // let sumCalculated = arr.reduce((sum, curr) => sum + curr.species.allowedOffspring, 0)
// // for (let i = max; i < sumCalculated; i++) {
// //   let largest = arr.reduce((largest, curr) => curr.species.allowedOffspring > largest.species.allowedOffspring ? curr : largest)
// //   largest.species.allowedOffspring--
// // }