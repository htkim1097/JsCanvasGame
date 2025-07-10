import enemy from 'enemy.js';

// 캔버스 객체 생성
let canvas = document.getElementById("myCanvas");
// 캔버스 그리기 도구 불러오기
let ctx = canvas.getContext("2d");

// 플레이어
let player = {
    x: 100,
    y: 100,
    life: 3,
    bomb: 2,
};
// 450 x 600

var keys = [];

document.addEventListener("keydown", (e) => {
    keys[e.keyCode] = true;
    //console.log(e.keyCode);
});

document.addEventListener("keyup", (e) => {
    keys[e.keyCode] = false;
});

function update() {
    
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameloop() {
    update();
    draw();
    requestAnimationFrame(gameloop);
}
gameloop();
