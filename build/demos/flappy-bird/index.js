const flappyBirdGraphics = new Graphics(document.getElementById('mainCanvas')).setSize(400, 600);
const sliderDiv = document.createElement('div');
const slider = document.createElement('input');
slider.type = 'range';
slider.min = '1';
slider.max = '100';
slider.value = '1';
sliderDiv.appendChild(slider);
document.body.appendChild(sliderDiv);
function getSliderValue(slider) {
    return parseInt(slider.value);
}
const bird = new Bird();
flappyBirdGraphics.bg();
bird.draw(flappyBirdGraphics);
let lastSpaceState = false;
let currSpaceState = false;
let spacePressed = false;
window.addEventListener('keydown', e => {
    if (e.key == ' ')
        currSpaceState = true;
});
window.addEventListener('keyup', e => {
    if (e.key == ' ')
        currSpaceState = false;
});
let pressedCounter = 0;
function flappyBirdLoop() {
    spacePressed = currSpaceState && !lastSpaceState;
    lastSpaceState = currSpaceState;
    flappyBirdGraphics.bg();
    bird.loadInputs(spacePressed ? 1 : 0);
    bird.update();
    bird.draw(flappyBirdGraphics);
    if (bird.alive)
        window.requestAnimationFrame(flappyBirdLoop);
    else
        console.log('dead');
}
window.requestAnimationFrame(flappyBirdLoop);
//# sourceMappingURL=index.js.map