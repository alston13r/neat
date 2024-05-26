function dealWith(x: number | number[], fn: (a: number) => number): number | number[] {
  if (x instanceof Array) {
    return x.map(y => fn(y))
  } else {
    return fn(x)
  }
}

function tanh(x: number | number[]): number | number[] {
  return dealWith(x, Math.tanh)
}
function relu(x: number | number[]): number | number[] {
	return dealWith(x,a=>Math.max(0,a))
}
function lrelu(x: number | number[]): number | number[] {
	return dealWith(x,a=>Math.max(0.1*a,a))
}
function sigmoid(x: number | number[]): number | number[] {
	return dealWith(x,a=>-1+2/(1+Math.exp(-a)))
}
function linear(x: number | number[]): number | number[] {
	return dealWith(x,a=>a)
}
function dtanh(x: number | number[]): number | number[] {
	return dealWith(x,a=>1-(a**2))
}
function drelu(x: number | number[]): number | number[] {
	return dealWith(x,a=>a<0?0:1)
}
function dlrelu(x: number | number[]): number | number[] {
	return dealWith(x,a=>a<0?0.1:1)
}
function dsigmoid(x: number | number[]): number | number[] {
	return dealWith(x,a=>2*a*(1-a))
}
function dlinear(x: number | number[]): number | number[] {
	return dealWith(x,a=>1)
}
function randGaussian(): number {
	let t = 0
	for (let i=0;i<6;i++) t += Math.random()
	return t / 6
}
function floor(x: number | number[]): number | number[] {
	return dealWith(x,Math.floor)
}
function rand(a: number = 0, b: number = 1, c: number = 0): number | number[] {
  if (c == 0) return Math.random()*(b-a)+a
  return new Array(c).fill(0).map(() => rand(a, b) as number)
}
function basicMutation(x: number | number[]): number | number[] {
  return dealWith(x, a => {
    if (rand() as number < 0.05) return a + randGaussian()*0.5
    return a
  })
}