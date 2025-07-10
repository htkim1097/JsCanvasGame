import * as enemy from './enemy.js';

// 캔버스 객체 생성
let canvas = document.getElementById("myCanvas");
// 캔버스 그리기 도구 불러오기
let ctx = canvas.getContext("2d");

let img = new Image();
img.src = "../images/png/Image45.png";

// 플레이어
let player = {
    x: 100,
    y: 100,
    width: 25,
    height: 25,
    life: 3,
    bomb: 2,
    attack: 1,
    speed: 3
};
//450 x 600

var keys = [];

document.addEventListener("keydown", (e) => {
    keys[e.keyCode] = true;
    console.log(e.keyCode);
});

document.addEventListener("keyup", (e) => {
    keys[e.keyCode] = false;
});

function update() {
    // 오른쪽
    if (keys[39]) {
        player.x += player.speed;
    }
    // 왼쪽
    if (keys[37]) {
        player.x -= player.speed;
    }
    // 위
    if (keys[38]) {
        player.y -= player.speed;
    }
    // 아래
    if (keys[40]) {
        player.y += player.speed;
    }

    // // 스페이스 = 공격
    // if (keys[32] && !player.isJumping) {
    //     player.velocityY = jumpPower;
    //     player.isJumping = true;
    // }

    // // 폭탄
    // if (key[66]) {
    //     pass                    // 코드 입력 필요
    // }

    // player.velocityY += gravity;
    // player.y += player.velocityY;

    // if (player.y >= groundY) {
    //     player.y = groundY;
    //     player.velocityY = 0;
    //     player.isJumping = false;
    // }

    // 적 위치 값 업데이트
    enemy.updateEnemies(canvas);
}

function draw() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = "black";
    // ctx.fillRect(0, groundY + player.height, canvas.width, 10);
    // ctx.fillStyle = "blue";
    // ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.clearRect(0, 0, 450, 600);

    ctx.drawImage(img, player.x - player.width / 2, player.y - player.height / 2, player.width * 2, player.height * 2);

    // 적 그리기
    enemy.drawEnemies(ctx);
}

function gameloop() {
    update();
    draw();
    requestAnimationFrame(gameloop);
}

// 적 생성 테스트
enemy.createEnemy(enemy.MovePattern.LEFT);
enemy.createEnemy(enemy.MovePattern.RIGHT);
enemy.createEnemy(enemy.MovePattern.FORWARD);

gameloop();