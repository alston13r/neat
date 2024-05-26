let n: BasicNeuralNetwork = new BasicNeuralNetwork(4, [5, 5], 4)

const andData = [
  {input: [0, 0], output: [0]},
  {input: [0, 1], output: [0]},
  {input: [1, 0], output: [0]},
  {input: [1, 1], output: [1]}
]
const orData = [
  {input: [0, 0], output: [0]},
  {input: [0, 1], output: [1]},
  {input: [1, 0], output: [1]},
  {input: [1, 1], output: [1]}
]
const xorData = [
  {input: [0, 0], output: [0]},
  {input: [0, 1], output: [1]},
  {input: [1, 0], output: [1]},
  {input: [1, 1], output: [0]}
]
const funnyData = [
	{
		input: [0,0,0,0],
		output: [1,0,0,0]
	},
	{
		input: [1,1,1,1],
		output: [1,0,0,0]
	},
	{
		input: [1,1,0,0],
		output: [0,1,0,0]
	},
	{
		input: [0,1,0,1],
		output: [0,0,1,0]
	},
	{
		input: [0,0,1,1],
		output: [0,1,0,0]
	},
	{
		input: [1,0,1,0],
		output: [0,0,1,0]
	},
	{
		input: [1,0,0,1],
		output: [0,0,0,1]
	},
	{
		input: [0,1,1,0],
		output: [0,0,0,1]
	},
]

let data = funnyData

for (let d of data) {
  console.log(d, n.feedForward(d.input))
}

for (let i=0; i<50000; i++) {
  let rData = data[floor(rand(0, data.length)) as number]
  n.train(rData.input, rData.output)
}

for (let d of data) {
  console.log(d, n.feedForward(d.input))
}