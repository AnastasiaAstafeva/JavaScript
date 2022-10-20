const slider = document.querySelector('.slider');
const before = slider.querySelector('.before');
const beforeImg = before.querySelector('img');
const change = slider.querySelector('.slide');
const body = document.body;

let isActive = false;

document.addEventListener('DOMContentLoaded', () => {
    let width = slider.offsetWidth;
    console.log(width);
    beforeImg.style.width = `${width}px`;
});

body.addEventListener('mousedown', () => {
    isActive = true;
});

body.addEventListener('mouseup', () => {
    isActive = false;
});

body.addEventListener('mouseleave', () => {
    isActive = false;
});

const stopEvent = (e) => {
    e.preventDefault();
    return false;
}

const beforeSlider = (x) => {
    let shift = Math.max(0, Math.min(x, slider.offsetWidth));
    before.style.width = `${shift}px`;
    change.style.left =  `${shift}px`;
}

body.addEventListener('mousemove', (e) => {
    if (!isActive) {
      return;  
    }
    let x = e.pageX;
    x -= slider.getBoundingClientRect().left;
    beforeSlider(x); 
    stopEvent(e);
})