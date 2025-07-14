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
let img_gameover = new Image();
img_player.src = "../images/png/Image45.png";
img_bullet.src = "../images/bullet.png";
img_bomb.src = "../images/bomb.png";
img_gameover.src = "../images/gameover.jpg";

//let img = new Image(); // new 키워드로 빈 이미지 객체 생성
//img.src = 'py.png';
//img.onload = () => ctx.drawImage(img,50,50);


//todo
// 총알 개수 늘리기
// 폭탄 화면 안뚫고 비행기 앞에서 폭발하면서 미사일 제거
// 충돌 감지
// life 이미지 심기(onload)


// 플레이어
let player = {
    x: 210,
    y: 550,
    width: 50,
    height: 50,
    bomb: 2,
    attack: 1, // 총알 갯수
    speed: 3,
    isInvincible: false, // 무적 상태
    isVisible: true // HP 1개 차감후 깜빡이는 효과
};

//450 x 600
let fps = 200;
let bulletTime = 0;
let bombTime = 0;
let life = 3;

var keys = [];
let effects = [];
// map 설정
map.setMap(1);

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
<<<<<<< HEAD
        // 플레이어가 오른쪽 경계를 넘어가지 않도록 제한(구글링)
        if(player.x + player.width / 2 > canvas.width){
            // 오른쪽 경계 바로 안쪽으로 위치 고정
=======
        if (player.x + player.width / 2 > canvas.width) { // 화면 경게 제한(구글링)
>>>>>>> 852015fa91701de0989d2ec9b2ca9d44ec821e2a
            player.x = canvas.width - player.width / 2;
        }
    }
    // 왼쪽
    if (keys[37]) {
        player.x -= player.speed;
<<<<<<< HEAD
        // 왼쪽 경계 밖으로 나가지 않도록 제한
        if(player.x - player.width / 2 < 0){
=======
        if (player.x - player.width / 2 < 0) {
>>>>>>> 852015fa91701de0989d2ec9b2ca9d44ec821e2a
            player.x = player.width / 2;
        }
    }
    // 위
    if (keys[38]) {
        player.y -= player.speed;
<<<<<<< HEAD
        // 위쪽 경계 밖으로 나가지 않도록 제한
        if(player.y - player.height / 2 < 0) { 
=======
        if (player.y - player.height / 2 < 0) {
>>>>>>> 852015fa91701de0989d2ec9b2ca9d44ec821e2a
            player.y = player.height / 2;
        }
    }
    // 아래
    if (keys[40]) {
        player.y += player.speed;
<<<<<<< HEAD
        // 아래쪽 경계 밖으로 나가지 않도록 제한
        if(player.y + player.height / 2 > canvas.height){
=======
        if (player.y + player.height / 2 > canvas.height) {
>>>>>>> 852015fa91701de0989d2ec9b2ca9d44ec821e2a
            player.y = canvas.height - player.height / 2;
        }
    }
    // 스페이스 = 공격
    bulletTime += 1000 / fps;
    if (bulletTime >= 100) {
        if (keys[32]) {
            shootBullet();
            bulletTime = 0; // 발사후 시간 초기화
        }
    }

    // b = 폭탄
    bombTime += 1000 / fps;
    if (bombTime >= 100) {
        if (keys[66]) {
            shootBomb();
            bombTime = 0;
        }
    }

    item.update(canvas);
    item.update(canvas);

    // 적 위치 값 업데이트
    enemy.update(canvas, new Array(player.x, player.y));
}


// ####### 총알 함수 ##########
let bullets = [];

// 총알 발사 함수
function shootBullet() {
    let bullet = {
        x: player.x + player.width / 2 - 32, // 비행기 중앙에서 발사
        y: player.y - 30, // 배행기 위치에서 발사
        width: 15, // 총알 너비
        height: 20, // 총알 높이
        speed: 5 // 총알 속도
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
function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed; // 총알이 위로 올라감

        // 총알이 화면을 벗어나면 리스트에서 제거
        if (bullet.y < 0) {
            bullets.splice(index, 1); // 총알 제거
        }
    });
}


// ####### 폭탄 함수 ##########
let bombs = [];

function BombEffect(x, y) {
    this.x = x;
    this.y = y;
    this.width = 350;
    this.height = 350;
    this.interval = 3;
    this.updateCnt = 0;
    this.imgArr = new Array();

    for (let i = 0; i < 4; i++) {
        let img = new Image();
        img.src = `../images/PNG/Image${189 + i}.png`;
        this.imgArr.push(img);
    }

    for (let i = 0; i < 7; i++) {
        for (let i = 1; i < 5; i++) {
            let img = new Image();
            img.src = `../images/PNG/Image193_${i}.png`;
            this.imgArr.push(img);
        }
    }
}

// 이펙트 그리기
function drawEffect() {
    for (let i = 0; i < effects.length; i++) {
        let eff = effects[i];
        eff.updateCnt++;
        let n = Math.floor(eff.updateCnt / eff.interval) - 1;

        if (eff.imgArr.length <= n) {
            effects.splice(i);
            continue;
        }

        if (eff.updateCnt % eff.interval == 0) {
            ctx.drawImage(eff.imgArr[n], eff.x, eff.y, eff.width, eff.height);
        }
    }
}

function shootBomb() {
    let bomb = {
        x: player.x + player.width / 2 - 40,
        y: player.y - 30,
        width: 30,
        height: 30,
        speed: 10,
        targetY: player.y - 150, // 플레이어 기준 앞으로(y축) 150만큼 올라감
        exploded: false // 폭발 여부 체크
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
        if (!bomb.exploded) {
            bomb.y -= bomb.speed;

            // 목표 y 위치에 도달 했으면 폭발
            if (bomb.y <= bomb.targetY) {
                bomb.exploded = true;

                // 폭발시 적 미사일 제거
                if (enemy.enemiesMissiles) {
                    enemy.enemiesMissiles = [];
                }

                //enemy.enemies = [];

                effects.push(new BombEffect(bomb.x - 175 + bomb.width, bomb.y - 300));

                bombs.splice(index, 1);
            }
        }
    });
}


<<<<<<< HEAD
// ####### 충돌 처리 ##########(구글링, gpt)
let isGameOver = false; 

function checkCollision(obj1, obj2){
    return(
        obj1.x < obj2.x + obj2.width && // obj1 왼쪽이 obj2 오른쪽보다 왼쪽에 있고
        obj1.x + obj1.width > obj2.x && // obj1 오른쪽이 obj2 왼쪽보다 오른쪽에 있고
        obj1.y < obj2.y + obj2.height && // obj1 위쪽이 obj2 아래쪽보다 위에 있고
        obj1.y + obj1.height > obj2.y // obj1 아래쪽이 obj2 위쪽보다 아래에 있으면 충돌
=======
// ####### 충돌 처리 ##########
let isGameOver = false;

function checkCollision(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
>>>>>>> 852015fa91701de0989d2ec9b2ca9d44ec821e2a
    );
}

function handleCollision() {
    bullets.forEach((bullet, bulletIndex) => {
        enemy.enemies.forEach((oneEnemy, enemyIndex) => {
<<<<<<< HEAD
            // 플레이어 총알과 적의 충돌 처리
            if (checkCollision(bullet, oneEnemy)){
=======
            // 총알과 적의 충돌 처리
            if (checkCollision(bullet, oneEnemy)) {
>>>>>>> 852015fa91701de0989d2ec9b2ca9d44ec821e2a
                // 충돌시 적과 총알을 배열에서 제거
                bullets.splice(bulletIndex, 1); // 총알 제거
                // enemy.enemies.splice(enemyIndex, 1); // 적 제거
                enemy.damaged(oneEnemy, 1);  // damaged(적 객체, 피해량)
            }
        });
    });
<<<<<<< HEAD
        
    bombs.forEach((bomb, bombIndex) => {
        enemy.enemies.forEach((oneEnemy, enemyIndex) => {
            // 플레이어 폭탄과 적의 충돌 처리
            if (checkCollision(bomb, oneEnemy)){
                // 충돌시 적과 폭탄을 배열에서 제거
                bombs.splice(bombIndex, 1); // 총알 제거
                enemy.enemies.splice(enemyIndex, 1); // 적 제거
            }
        });
    });

    enemy.enemies.forEach((oneEnemy) => {
        // 플레이어와 적 미사일 충돌 처리 // 적 미사일이 아니고 적 몸체랑 충돌시 체력감소됨
        if(checkCollision(oneEnemy, player) && !player.isInvincible){
=======

    // bombs.forEach((bomb, bombIndex) => {
    // enemy.enemies.forEach((oneEnemy, enemyIndex) => {
    //     // 폭탄과 적의 충돌 처리
    //     if (checkCollision(bomb, oneEnemy)){
    //         // 충돌시 적과 폭탄을 배열에서 제거
    //         bombs.splice(bombIndex, 1); // 총알 제거
    //         enemy.enemies.splice(enemyIndex, 1); // 적 제거
    //         }
    //     });
    // });

    enemy.enemies.forEach((oneEnemy) => {
        // 적과 비행기의 충돌 처리
        if (checkCollision(oneEnemy, player) && !player.isInvincible) {
>>>>>>> 852015fa91701de0989d2ec9b2ca9d44ec821e2a
            life -= 1;
            player.isInvincible = true; // 무적 상태 전환

            let blinkCount = 0;
            let blinkInterval = setInterval(() => {
                player.isVisible = !player.isVisible; // 깜빡임 효과
                blinkCount++;
                if (blinkCount > 5) { // 깜빡임 횟수
                    clearInterval(blinkInterval);
                    player.isVisible = true; // 원래 상태 복구
                    player.isInvincible = false; // 무적 상태 해제
                }
            }, 200); // 0.2초마다 깜빡임

            if (life <= 0) {
                isGameOver = true;
            }
        }
    });
}


function gameOver() {
    //ctx.fillStyle = 'red';
    //ctx.font = '48px Arial';
    //ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2);
    ctx.drawImage(img_gameover, 0, 0, canvas.width, canvas.height);
}

// ####### 그리기 ##########
function drawMap() {
    map.draw(ctx);
}

function drawPlayer() {
    ctx.drawImage(img_player, player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
}

function drawEtc() {
    drawEffect();
    enemy.draw(ctx);
    item.draw(ctx);
}

function drawAttack() {
    update(); // 키보드 입력

    drawBullets(); // 총알 그리기
    updateBullets(); // 총알 위치 업데이트

    drawBombs(); // 폭탄 그리기
    updateBombs(); // 폭탄 위치 업데이트

    handleCollision(); // 충돌 감지 및 처리
}

function drawLife() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('life : ' + life, 10, 60);
}


// ####### gameloop ##########
function gameloop() {
    if (isGameOver) {
        gameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap(); // 맵 그리기
    drawEtc(); // 적 & 아이템 그리기


    if (player.isVisible) {
        drawPlayer(); // 플레이어 그리기
    }

    drawAttack(); // 키보드, 총알, 폭탄, 충돌 처리
    drawLife(); // life 그리기


    requestAnimationFrame(gameloop);
}

gameloop();