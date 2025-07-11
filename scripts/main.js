import * as enemy from './enemy.js';
import * as map from './map.js';
import * as item from './item.js';

// 캔버스 객체 생성
//450 x 600
let canvas = document.getElementById("myCanvas");
// 캔버스 그리기 도구 불러오기
let ctx = canvas.getContext("2d");

// 플레이어 이미지 
let img_player = new Image();
let img_bullet = new Image();
let img_bomb = new Image();
img_player.src = "../images/png/Image45.png";
img_bullet.src = "../images/bullet.png";
img_bomb.src = "../images/bomb.png";

//todo
// 총알 개수 늘리기
// 폭탄 화면 안뚫고 비행기 앞에서 폭발하면서 미사일 제거
// 충돌 감지

// 플레이어
let player = {
    x: 210,
    y: 550,
    width: 50,
    height: 50,
    life: 3,
    bomb: 2,
    attack: 1, // 총알 갯수
    speed: 3,
    isInvincible : false, // 무적 상태
    isVisible : true // HP 1개 차감후 깜빡이는 효과
};

//450 x 600
let fps = 200;
let bulletTime = 0;
let bombTime = 0;

var keys = [];

document.addEventListener("keydown", (e) => {
    keys[e.keyCode] = true;
    console.log(e.keyCode);
});

document.addEventListener("keyup", (e) => {
    keys[e.keyCode] = false;
});

function update() {
    map.update(canvas);

    // 오른쪽
    if (keys[39]) {
        player.x += player.speed;
        if(player.x + player.width / 2 > canvas.width){ // 화면 경게 제한
            player.x = canvas.width - player.width / 2;
        }
    }
    // 왼쪽
    if (keys[37]) {
        player.x -= player.speed;
        if(player.x - player.width / 2 < 0){
            player.x = player.width / 2;
        }
    }
    // 위
    if (keys[38]) {
        player.y -= player.speed;
        if(player.y - player.height / 2 < 0) { 
            player.y = player.height / 2;
        }
    }
    // 아래
    if (keys[40]) {
        player.y += player.speed;
        if(player.y + player.height / 2 > canvas.height){
            player.y = canvas.height - player.height / 2;
        }
    }
    // 스페이스 = 공격
    bulletTime += 1000 / fps; 
    if(bulletTime >= 100){
        if (keys[32]) {
            shootBullet();
            bulletTime = 0; // 발사후 시간 초기화
        }    
    }

    // b = 폭탄
    bombTime += 1000 / fps;
    if(bombTime >= 100){
        if (keys[66]) {
            shootBomb();
            bombTime = 0;
            }   
    }

    poweritem.update(canvas);
    bombitem.update(canvas);
    
    // 적 위치 값 업데이트
    enemy.update(canvas);
}

let bullets = [];

// 총알 발사 함수
function shootBullet() {
    let bullet = {
        x : player.x + player.width / 2 - 28, // 비행기 중앙에서 발사
        y : player.y - 30, // 배행기 위치에서 발사
        width : 5, // 총알 너비
        height : 20, // 총알 높이
        speed : 5 // 총알 속도
    };
    bullets.push(bullet);
}

// 총알 그리기 함수
function drawBullets() {
    bullets.forEach((bullet) => {
        ctx.drawImage(img_bullet, bullet.x, bullet.y, bullet.width, bullet.height); // 총알을 비행기 중앙에서 발사
    });
}

// 총알 위치 업데이트 함수
function updateBullets(){
    bullets.forEach((bullet, index) =>{
        bullet.y -= bullet.speed; // 총알이 위로 올라감
        
        // 총알이 화면을 벗어나면 리스트에서 제거
        if (bullet.y < 0) {
            bullets.splice(index, 1); // 총알 제거
        // 총알 발사 딜레이 주기
        }
    });
}

let bombs = [];

function shootBomb() {
    let bomb = {
        x : player.x + player.width / 2 - 40,
        y : player.y - 30,
        width : 30,
        height : 30,
        speed : 10
    };
    bombs.push(bomb);
}

function drawBombs() {
    bombs.forEach((bomb) => {
        ctx.drawImage(img_bomb, bomb.x, bomb.y, bomb.width, bomb.height);
    });
}

function updateBombs() {
    bombs.forEach((bomb, index) => {
        bomb.y -= bomb.speed;
        
        if (bomb.y < 0) {
            bombs.splice(index, 1);
        }
    });
}

function drawPlayer() {
    ctx.clearRect(0, 0, 450, 600);
    
    item.draw(ctx);
    // 플레이어 그리기
    ctx.drawImage(img_player, player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);

    // 적 그리기
    enemy.draw(ctx);
}

function gameloop() {
    update(); // 키보드 입력
    drawPlayer(); // 플레이어 및 적 그리기
    
    drawBullets(); // 총알 그리기
    updateBullets(); // 총알 위치 업데이트
    
    drawBombs();
    updateBombs();
    
    requestAnimationFrame(gameloop);
}

// 적 생성 테스트
enemy.createEnemy(enemy.MovePattern.LEFT, "../images/PNG/Image79.png");
enemy.createEnemy(enemy.MovePattern.RIGHT, "../images/PNG/Image79.png");
enemy.createEnemy(enemy.MovePattern.FORWARD, "../images/PNG/Image79.png");

gameloop();