// class MockBrain {
//   constructor() {
//     this.fitness = Math.random() * 5
//   }
// }




// class MockPopulation {
//   members = []

//   constructor(popSize) {
//     this.popSize = popSize
//     for (let i = 0; i < popSize; i++) {
//       this.members.push(new MockBrain())
//     }
//   }

//   getAverageFitnessAdjusted() {
//     return this.members.reduce((sum, curr) => sum + curr.fitnessAdjusted, 0) / this.members.length
//   }

//   calculateAllowedOffspring() {
//     const avg = this.getAverageFitnessAdjusted()
//     const max = this.popSize

//     let list = [...mockSpeciesList]

//     list.forEach(species => {
//       species.temp = species.getAverageFitnessAdjusted() / avg * species.members.length
//     })

//     list.sort((a, b) => {
//       const aDecimal = a.temp - Math.floor(a.temp)
//       const bDecimal = b.temp - Math.floor(b.temp)
//       if (aDecimal == bDecimal) return b.temp - a.temp
//       return bDecimal - aDecimal
//     })

//     const min = list.reduce((sum, curr) => sum + Math.floor(curr.temp), 0)
//     let roundUpCount = max - min


//     for (let i = 0; i < roundUpCount; i++) {
//       let species = list.shift()
//       species.allowedOffspring = Math.ceil(species.temp)
//       delete species.temp
//     }
//     for (let species of list) {
//       species.allowedOffspring = Math.floor(species.temp)
//       delete species.temp
//     }


//     // function MockCalculate() {
//     //   const globalAvg = this.getAverageFitnessAdjusted()

//     //   const max = this.popSize

//     //   let arr = this.speciesList.map(species => {
//     //     return { species, temp: species.getAverageFitnessAdjusted() / globalAvg * species.members.length }
//     //   })
//     //   let maxCalculated = arr.reduce((sum, curr) => sum + curr.temp, 0)
//     //   arr.forEach(x => {
//     //     x.temp = max * x.temp / maxCalculated
//     //   })
//     //   arr.sort((a, b) => {
//     //     let c = a.temp - Math.floor(a.temp)
//     //     let d = b.temp - Math.floor(b.temp)
//     //     if (c == d) return a.temp - b.temp
//     //     return c - d
//     //   })

//     //   const min = arr.reduce((sum, curr) => sum + Math.floor(curr.temp), 0)
//     //   const diff = max - min
//     //   for (let i = 0; i < diff && arr.length > 0; i++) {
//     //     let t = arr.pop()
//     //     t.species.allowedOffspring = Math.ceil(t.temp)
//     //   }
//     //   arr.forEach(t => t.species.allowedOffspring = Math.floor(t.temp))

//     //   let sumCalculated = arr.reduce((sum, curr) => sum + curr.species.allowedOffspring, 0)
//     //   for (let i = max; i < sumCalculated; i++) {
//     //     let largest = arr.reduce((largest, curr) => curr.species.allowedOffspring > largest.species.allowedOffspring ? curr : largest)
//     //     largest.species.allowedOffspring--
//     //   }
//     // }
//   }
// }


// class MockSpecies {
//   members = []

//   addMember(mockBrain) {
//     this.members.push(mockBrain)
//   }

//   adjustFitness() {
//     let N = this.members.length
//     for (let m of this.members) {
//       m.fitnessAdjusted = m.fitness / N
//     }
//   }

//   getAverageFitnessAdjusted() {
//     return this.members.reduce((sum, curr) => sum + curr.fitnessAdjusted, 0) / this.members.length
//   }
// }

// let mockPopulation = new MockPopulation(500)
// let mockSpeciesList = [new MockSpecies(), new MockSpecies(), new MockSpecies(), new MockSpecies(), new MockSpecies()]

// let S1 = 200
// let S2 = 200
// let S3 = 50
// let S4 = 25
// let S5 = 25

// for (let i = 0; i < S1; i++) {
//   mockSpeciesList[0].addMember(mockPopulation.members[i])
// }
// for (let i = S1; i < S1 + S2; i++) {
//   mockSpeciesList[1].addMember(mockPopulation.members[i])
// }
// for (let i = S1 + S2; i < S1 + S2 + S3; i++) {
//   mockSpeciesList[2].addMember(mockPopulation.members[i])
// }
// for (let i = S1 + S2 + S3; i < S1 + S2 + S3 + S4; i++) {
//   mockSpeciesList[3].addMember(mockPopulation.members[i])
// }
// for (let i = S1 + S2 + S3 + S4; i < S1 + S2 + S3 + S4 + S5; i++) {
//   mockSpeciesList[4].addMember(mockPopulation.members[i])
// }

// for (let s of mockSpeciesList) {
//   s.adjustFitness()
// }

// mockPopulation.calculateAllowedOffspring()