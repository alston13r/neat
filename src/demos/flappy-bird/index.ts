/// <reference path="../../utils/drawing/graphics.ts" />
/// <reference path="../../games/flappy-bird/bird.ts" />
/// <reference path="../../games/flappy-bird/ga.ts" />
/// <reference path="../../games/flappy-bird/pipe.ts" />

// const TOTAL = 300
// let birds: Bird[] = []
// let savedBirds: Bird[] = []
// let pipes: Pipe[] = []
// let counter: number = 0
// let cycles: number = 1

const flappyBirdGraphics: Graphics = new Graphics().setSize(400, 600).appendTo(document.body)
const sliderDiv = document.createElement('div')
const slider = document.createElement('input')
slider.type = 'range'
slider.min = '1'
slider.max = '100'
slider.value = '1'
sliderDiv.appendChild(slider)
document.body.appendChild(sliderDiv)
function getSliderValue(slider: HTMLInputElement): number {
  return parseInt(slider.value)
}

const bird = new Bird()
flappyBirdGraphics.bg()
bird.draw(flappyBirdGraphics)

let lastSpaceState: boolean = false
let currSpaceState: boolean = false
let spacePressed: boolean = false

window.addEventListener('keydown', e => {
  if (e.key == ' ') currSpaceState = true
})
window.addEventListener('keyup', e => {
  if (e.key == ' ') currSpaceState = false
})

let pressedCounter = 0

function flappyBirdLoop() {
  spacePressed = currSpaceState && !lastSpaceState
  lastSpaceState = currSpaceState

  flappyBirdGraphics.bg()

  bird.loadInputs(spacePressed ? 1 : 0)

  bird.update()
  bird.draw(flappyBirdGraphics)

  if (bird.alive) window.requestAnimationFrame(flappyBirdLoop)
  else console.log('dead')
}

window.requestAnimationFrame(flappyBirdLoop)

// for (let i = 0; i < TOTAL; i++) {
//   birds[i] = new Bird().setGraphics(xorGraphics)
// }

// function birdLoop(): void {
//   for (let n = 0; n < getSliderValue(); n++) {
//     if (counter % 100 == 0) {
//       pipes.push(new Pipe(xorGraphics))
//     }
//     counter++
//     for (let i = pipes.length - 1; i >= 0; i--) {
//       pipes[i].update()
//       for (let j = birds.length - 1; j >= 0; j--) {
//         if (pipes[i].hits(birds[j])) {
//           savedBirds.push(birds.splice(j, 1)[0])
//         } else if (birds[j].hitBounds) {
//           savedBirds.push(birds.splice(j, 1)[0])
//         }
//       }
//       if (pipes[i].offscreen()) {
//         pipes.splice(i, 1)
//       }
//     }
//     for (let bird of birds) {
//       bird.think(pipes)
//       bird.update()
//     }
//     if (birds.length == 0) {
//       counter = 0
//       nextGeneration()
//       pipes = []
//     }
//   }

//   xorGraphics.bg()
//   for (let bird of birds) {
//     bird.draw()
//   }
//   for (let pipe of pipes) {
//     pipe.draw()
//   }

//   window.requestAnimationFrame(birdLoop)
// }

// window.requestAnimationFrame(birdLoop)