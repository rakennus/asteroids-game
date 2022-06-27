"use strict";
// global variable declaration
let canvas;
let responsiveContainers;
let ctx;
let rect = null;

let secondsPassed = 0;
let oldTimeStamp = 0;
let fps = 0;

let ratio = 0;
let clientRatio = 0;

let controls = {
    left: false,
    right: false,
    up: false,
    down: false,
    touchControls: false,
    touchStarted: false,
    end: { x: 0, y: 0 },
    start: { x: 0, y: 0 },
}

let bullets = [];
let asteroids = [];

window.onload = (event) => {
    canvas = document.getElementById('canvas');
    responsiveContainers = document.querySelectorAll('.responsive_box');
    ctx = canvas.getContext('2d', { alpha: false });

    canvas.width = 640;
    canvas.height = 480;

    ratio = canvas.width / canvas.height;

    myGameArea.canvasStyle();

    window.addEventListener('resize', () => {
        myGameArea.canvasStyle();
    });

    rect = canvas.getBoundingClientRect();

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    canvas.addEventListener("touchstart", TouchHandleStart, false);
    canvas.addEventListener("touchmove", TouchHandleMove, false);
    canvas.addEventListener("touchend", TouchHandleEnd, false);

    // loads game area
    myGameArea.load();
}

let myGameArea = {
    load: function () {
        // set ctx colors to white
        ctx.fillStyle = 'white';
        ctx.strokeStyle = "white";

        // Start the first frame request
        window.requestAnimationFrame(gameLoop);

        let amount = 8;
        let perEdge = amount / 4;

        for (let k = 0; k < perEdge; k++) {
            asteroids.push(new Asteroid({ x: -Asteroid.maxRadius + Math.random() * (Asteroid.maxRadius * 2 + canvas.width), y: -Asteroid.maxRadius }, { x: 200, y: 200 }))
        }
    },
    canvasStyle: function () {
        clientRatio = document.documentElement.clientWidth / document.documentElement.clientHeight;

        if (clientRatio < ratio) {
            responsiveContainers.forEach(responsiveContainer => {
                responsiveContainer.style.width = "100%";
                responsiveContainer.style.height = "auto";
            });
        } else if (clientRatio > ratio) {
            responsiveContainers.forEach(responsiveContainer => {
                responsiveContainer.style.width = "auto";
                responsiveContainer.style.height = "100%";
            });
        }

        ctx.imageSmoothingEnabled = false;
    }
}

function gameLoop(timeStamp) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    if (secondsPassed > 0.1) secondsPassed = 0.1;
    oldTimeStamp = timeStamp;

    // Calculate fps
    fps = Math.round(1 / secondsPassed);

    if (!document.hidden) {
        // Update game objects in the loop
        update();
        // Perform the drawing operation
        draw();
    }

    // The loop function has reached it's end. Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function update() {
    player.update();
    if (controls.touchControls) joyStick.update();

    for (let i = 0; i < bullets.length; i++) {
        bullets[i].update();
        if (bullets[i].lifeTiem <= 0) bullets.splice(bullets.indexOf(bullets[i]), 1);
    }

    for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].update();
        if (asteroids[i].lifeTiem <= 0) asteroids.splice(asteroids.indexOf(asteroids[i]), 1);
    }
}

function draw() {
    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw player
    player.draw();
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].draw();
    }
    for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].draw();
    }
    if (controls.touchControls) joyStick.draw();

    // draw fps
    ctx.font = '8px Arial';
    ctx.fillText("FPS: " + fps, 10, 16);
}

function keyDownHandler(e) {
    controls.touchControls = false;

    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d" || e.key == "D") controls.right = true;
    if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a" || e.key == "A") controls.left = true;
    if (e.key == "Up" || e.key == "ArrowUp" || e.key == "w" || e.key == "W") controls.up = true;
    if (e.key == "Down" || e.key == "ArrowDown" || e.key == "s" || e.key == "S") controls.down = true;

    if (e.key == "Spacebar" || e.key == " ") player.shoot();
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d" || e.key == "D") controls.right = false;
    if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a" || e.key == "A") controls.left = false;
    if (e.key == "Up" || e.key == "ArrowUp" || e.key == "w" || e.key == "W") controls.up = false;
    if (e.key == "Down" || e.key == "ArrowDown" || e.key == "s" || e.key == "S") controls.down = false;
}

function TouchHandleStart(e) {
    e.preventDefault();
    controls.touchControls = true;

    controls.touchStarted = true;
    controls.start.x = (e.changedTouches[0].pageX - rect.left) * ratio;
    controls.start.y = (e.changedTouches[0].pageY - rect.top) * ratio;

    controls.end.x = (e.changedTouches[0].pageX - rect.left) * ratio;
    controls.end.y = (e.changedTouches[0].pageY - rect.top) * ratio;
};

function TouchHandleMove(e) {
    e.preventDefault();

    controls.end.x = (e.changedTouches[0].pageX - rect.left) * ratio;
    controls.end.y = (e.changedTouches[0].pageY - rect.top) * ratio;
};

function TouchHandleEnd(e) {
    e.preventDefault();

    controls.start.x = 0;
    controls.start.y = 0;

    controls.end.x = 0;
    controls.end.y = 0;

    controls.touchStarted = false;
};

let point = function (x, y) {
    this.x = x;
    this.y = y;
}