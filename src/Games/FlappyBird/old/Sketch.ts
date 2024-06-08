const TOTAL = 300
let birds: Bird[] = []
let savedBirds: Bird[] = []
let pipes: Pipe[] = []
let counter: number = 0
let cycles: number = 1

const graphics: Graphics = new Graphics().setSize(400, 600).appendTo(document.body)
const slider = document.createElement('input')
slider.type = 'range'
slider.min = '1'
slider.max = '100'
slider.value = '1'
document.body.appendChild(slider)

function getSliderValue(): number {
  return parseInt(slider.value)
}

for (let i = 0; i < TOTAL; i++) {
  birds[i] = new Bird().setGraphics(graphics)
}

function loop(): void {
  for (let n = 0; n < getSliderValue(); n++) {
    if (counter % 100 == 0) {
      pipes.push(new Pipe(graphics))
    }
    counter++
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update()
      for (let j = birds.length - 1; j >= 0; j--) {
        if (pipes[i].hits(birds[j])) {
          savedBirds.push(birds.splice(j, 1)[0])
        } else if (birds[j].hitBounds) {
          savedBirds.push(birds.splice(j, 1)[0])
        }
      }
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1)
      }
    }
    for (let bird of birds) {
      bird.think(pipes)
      bird.update()
    }
    if (birds.length == 0) {
      counter = 0
      nextGeneration()
      pipes = []
    }
  }

  graphics.bg()
  for (let bird of birds) {
    bird.draw()
  }
  for (let pipe of pipes) {
    pipe.draw()
  }

  window.requestAnimationFrame(loop)
}

window.requestAnimationFrame(loop)