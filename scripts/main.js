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
    // Space
    if (keys[32] && !player.isJumping) {
        player.velocityY = jumpPower;
        player.isJumping = true;
    }
    // 오른쪽
    if (keys[39]) {
        player.x += 10;
    }
    // 왼쪽
    if (keys[37]) {
        player.x -= 10;
    }

    player.velocityY += gravity;
    player.y += player.velocityY;

    if (player.y >= groundY) {
        player.y = groundY;
        player.velocityY = 0;
        player.isJumping = false;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, groundY + player.height, canvas.width, 10);
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function gameloop() {
    update();
    draw();
    requestAnimationFrame(gameloop);
}
gameloop();
