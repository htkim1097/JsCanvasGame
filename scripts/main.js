import * as enemy from './enemy.js';
import * as map from './map.js';
import * as item from './item.js';

// 캔버스 객체 생성
//450 x 600
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

// 플레이어 이미지 
let img_player = new Image();
let img_bullet = new Image();
let img_bomb = new Image();
let img_left = new Image();
let img_right = new Image();
let img_life = new Image();
let img_bomb2 = new Image();
let startImg = new Image();
let keyGuideImg = new Image();
let gameOverImg = new Image();
let gameWinImg = new Image();

gameWinImg.src = "../images/game_clear.png";
gameOverImg.src = "../images/ending_Image.png";
keyGuideImg.src = "../images/key.png";
img_player.src = "../images/png/Image45.png";
img_bullet.src = "../images/bullet.png";
img_bomb.src = "../images/bomb.png";
img_left.src = "../images/left.png";
img_right.src = "../images/right.png";
img_life.src = "../images/life.png";
img_bomb2.src = "../images/bomb2.png";
startImg.src = "../images/GameStart Image.png";

let delay = 200; // 발사 딜레이
let bulletDelayTime = 0;
let bombDelayTime = 0;
let life = 3;
let bomb = 3;
let isGameOver = false;
let win = false;

var keys = []; // 입력된 키의 배열
let effects = []; // 이펙트 배열
let playerBullets = [];
let bombs = [];

document.addEventListener("keydown", (e) => {
    keys[e.keyCode] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.keyCode] = false;
});

// ########## 플레이어 객체 ##########
let player = {
    width: 10, // 플레이어 히트박스 너비
    height: 10, // 플레이어 히트박스 높이
    imgWidth: 50, // 플레이어 너비
    imgHeight: 50, // 플레이어 높이
    x: 210, // 시작 위치 x축 좌표
    y: 550, // 시작 위치 y축 좌표
    attack: 1, // 총알 갯수
    speed: 5,
    isInvincible: false, // 무적 상태
    isVisible: true, // HP 1개 차감후 깜빡이는 효과
    img: img_player
};

// ########## 폭탄 클래스 ##########
function BombEffect(x, y) {
    this.x = x;
    this.y = y;
    this.width = 350;
    this.height = 350;
    this.interval = 3;
    this.updateCnt = 0;
    this.animFrames = new Array();
    this.currentFrame = 0;

    for (let i = 0; i < 4; i++) {
        let img = new Image();
        img.src = `../images/PNG/Image${189 + i}.png`;
        this.animFrames.push(img);
        // 189~192번 이미지 4장 로드 후 배열에 추가
    }
    for (let i = 0; i < 7; i++) {
        for (let j = 1; j < 5; j++) {
            let img = new Image();
            img.src = `../images/PNG/Image193_${j}.png`;
            this.animFrames.push(img);
            // 193_1.png ~ 193_4.png 이미지 7세트(총 28장) 로드 후 배열에 추가
        }
    }
}

// ########## 플레이어 사망 이펙트 클래스 ##########
function dieEffect(x, y) {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;
    this.interval = 5;
    this.updateCnt = 0;
    this.animFrames = new Array();
    this.currentFrame = 0;

    for (let i = 0; i < 3; i++) {
        let img = new Image();
        img.src = `../images/PNG/Image${47 + i}.png`;
        this.animFrames.push(img);
        // 47~49번 이미지 3장 로드 후 배열에 추가
    }
}

// ########## 적 피격 이펙트 클래스 ##########
function damagedEffect(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.interval = 2;
    this.updateCnt = 0;
    this.animFrames = new Array();
    this.currentFrame = 0;

    for (let i = 0; i < 5; i++) {
        let img = new Image();
        img.src = `../images/PNG/Image${63 + i}.png`;
        this.animFrames.push(img);
        // 63~67번 이미지 5장 로드 후 배열에 추가
    }
}

function processKeyInput() {
    // 오른쪽
    if (keys[39]) {
        player.x += player.speed;
        player.img = img_right;
        // 플레이어가 오른쪽 경계를 넘어가지 않도록 제한
        if (player.x + player.imgWidth / 2 > canvas.width) {
            // 오른쪽 경계 바로 안쪽으로 위치 고정
            player.x = canvas.width - player.imgWidth / 2;
        }
    }

    // 왼쪽
    else if (keys[37]) {
        player.x -= player.speed;
        player.img = img_left;
        // 플레이어가 왼쪽 경계 밖으로 나가지 않도록 제한
        if (player.x - player.imgWidth / 2 < 0) {
            // 왼쪽 경계 바로 안쪽으로 위치 고정
            player.x = player.imgWidth / 2;
        }
    }
    else {
        // 방향키 안 눌렀을 때 기본 플레이어 이미지로 복원
        player.img = img_player;
    }

    // 위
    if (keys[38]) {
        player.y -= player.speed;
        // 위쪽 경계 밖으로 나가지 않도록 제한
        if (player.y - player.imgHeight / 2 < 0) {
            // 위쪽 경계 바로 안쪽으로 위치 고정
            player.y = player.imgHeight / 2;
        }
    }

    // 아래
    if (keys[40]) {
        player.y += player.speed;
        // 아래쪽 경계 밖으로 나가지 않도록 제한
        if (player.y + player.imgHeight / 2 > canvas.height) {
            // 아래쪽 경계 바로 안쪽으로 위치 고정
            player.y = canvas.height - player.imgHeight / 2;
        }
    }

    // 스페이스 = 공격
    bulletDelayTime += 1000 / delay;
    if (bulletDelayTime >= 100) {
        if (keys[32]) {
            shootBullet();
            bulletDelayTime = 0; // 발사 후 타이머 초기화
        }
    }

    // c = 폭탄
    bombDelayTime += 1000 / delay;
    if (bombDelayTime >= 100) {
        if (keys[67]) {
            shootBomb();
            bombDelayTime = 0; // 발사 후 타이머 초기화
        }
    }
}

// ########## 총알 함수 ##########
function shootBullet() {
    let space = 15; // 총알 사이의 간격
    let totalWidth = (player.attack - 1) * space;
    for (let i = 0; i < player.attack; i++) {
        let bullet = {
            x: player.x + player.imgWidth / 2 - 46 - totalWidth / 2 + i * space,// 비행기 중앙에서 발사
            y: player.y - player.imgHeight / 2 - 60, // 비행기 조정석 위치에서 발사
            width: 40, // 총알 너비
            height: 80, // 총알 높이
            speed: 30 // 총알 속도
        };
        playerBullets.push(bullet);
    }
}

// 총알 그리기 함수
function drawBullets() {
    for (let i = 0; i < playerBullets.length; i++) {
        let b = playerBullets[i];
        ctx.drawImage(img_bullet, b.x, b.y, b.width, b.height);
    }
}

function updateBullets() {
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        playerBullets[i].y -= playerBullets[i].speed;

        // 캔버스 위로 넘어갔을 때
        if (playerBullets[i].y < -50) {
            playerBullets.splice(i, 1);
        }
    }
}

// 이펙트를 그리는 함수
function drawEffect() {
    for (let i = 0; i < effects.length; i++) {
        let eff = effects[i];
        let frame = eff.animFrames[eff.currentFrame % eff.animFrames.length]

        ctx.drawImage(frame, eff.x, eff.y, eff.width, eff.height);
        eff.updateCnt++;

        // 프레임 간격마다 새로운 프레임으로 전환
        if (eff.updateCnt % eff.interval == 0) {
            eff.currentFrame++;
        }

        // 현재 프레임이 마지막 프레임을 초과하면 해당 이펙트는 제거
        if (eff.animFrames.length < eff.currentFrame) {
            effects.splice(i, 1);
            continue;
        }
    }
}

// 폭탄 발사 함수
function shootBomb() {
    if (bomb > 0) {
        bomb -= 1;

        let bombobj = {
            width: 30,
            height: 30,
            x: player.x - 30 / 2, // 플레이어 중앙 정렬(폭탄의 width / 2)
            y: player.y + player.imgHeight / 2 - 30,
            speed: 100,
            targetY: player.y - 100, // 폭탄이 플레이어 y축 위로 올라가서 터짐
            exploded: false, // 폭발 여부 체크
            explosionDuration: 120, // 120 프레임동안 폭발 유지
            explosionTimer: 0,
        };

        bombs.push(bombobj);
    }
}

// 폭탄 그리기 함수
function drawBombs() {
    for (let i = 0; i < bombs.length; i++) {
        let bomb = bombs[i];
        if (!bomb.exploded) { // 아직 터지지 않은 폭탄만 그리기
            ctx.drawImage(img_bomb, bomb.x, bomb.y, bomb.width, bomb.height);
        }
    }
}

function updateBombs() {
    for (let i = bombs.length - 1; i >= 0; i--) {
        let bomb = bombs[i];

        if (!bomb.exploded) {
            bomb.y -= bomb.speed;

            if (bomb.y <= bomb.targetY) {
                bomb.exploded = true;
                bomb.explosionTimer = 0;
                bomb.bombArea = {
                    x: bomb.x - 175 + bomb.width,
                    y: bomb.y - 175,
                    width: 350,
                    height: 350,
                };

                effects.push(new BombEffect(bomb.bombArea.x, bomb.bombArea.y));
            }
        } else {
            bomb.explosionTimer++;

            // 폭발 중 적 총알 제거 처리
            if (enemy.bullets && enemy.bullets.length) {
                for (let j = enemy.bullets.length - 1; j >= 0; j--) {
                    if (checkCollision(enemy.bullets[j], bomb.bombArea)) {
                        enemy.bullets.splice(j, 1);
                    }
                }
            }

            if (bomb.explosionTimer > bomb.explosionDuration) {
                bombs.splice(i, 1);
            }
        }
    }
}

// ########## 충돌 처리 ##########
// 두 객체의 충돌 여부를 판별하는 함수 (AABB 충돌 처리)
function checkCollision(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width && // obj1 왼쪽이 obj2 오른쪽보다 왼쪽에 있고
        obj1.x + obj1.width > obj2.x && // obj1 오른쪽이 obj2 왼쪽보다 오른쪽에 있고
        obj1.y < obj2.y + obj2.height && // obj1 위쪽이 obj2 아래쪽보다 위에 있고
        obj1.y + obj1.height > obj2.y // obj1 아래쪽이 obj2 위쪽보다 아래에 있으면 충돌
    );
}

// 충돌 상태를 처리하는 함수
function handleCollision() {
    // 플레이어 총알과 적 충돌 처리
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        let bullet = playerBullets[i];
        for (let j = enemy.enemies.length - 1; j >= 0; j--) {
            let oneEnemy = enemy.enemies[j];

            let collision = (bullet.x < oneEnemy.x + oneEnemy.width) && (bullet.x + bullet.width > oneEnemy.x) &&
                (bullet.y < oneEnemy.y + oneEnemy.height * 0.5) && (bullet.y + bullet.height > oneEnemy.y);

            if (collision) {
                effects.push(new damagedEffect(bullet.x + 20, bullet.y, 10, 15));

                playerBullets.splice(i, 1);

                let itemArr = enemy.damaged(oneEnemy, 1);

                // 적 드랍 아이템
                if (itemArr != undefined && itemArr[2] > 0) {
                    for (let k = 0; k < itemArr[2]; k++) {
                        item.createItem(itemArr[0], itemArr[1], "power");
                    }
                }

                if (itemArr != undefined && itemArr[3] > 0) {
                    for (let k = 0; k < itemArr[3]; k++) {
                        item.createItem(itemArr[0], itemArr[1], "bomb");
                    }
                }
                break;
            }
        }
    }

    // 플레이어 폭탄과 적 충돌 처리
    for (let i = bombs.length - 1; i >= 0; i--) {
        let bomb = bombs[i];
        for (let j = enemy.enemies.length - 1; j >= 0; j--) {
            let oneEnemy = enemy.enemies[j];

            if (checkCollision(bomb, oneEnemy)) {
                // 폭탄 제거
                bombs.splice(i, 1);
                enemy.damaged(oneEnemy, 50);
                break;
            }
        }
    }

    // 플레이어와 아이템 충돌 처리
    for (let i = item.items.length - 1; i >= 0; i--) {
        let oneItem = item.items[i];
        let collision = (player.x < oneItem.x + oneItem.width) && (player.x + player.imgWidth > oneItem.x) &&
            (player.y < oneItem.y + oneItem.height) && (player.y + player.imgHeight > oneItem.y);
        if (collision) {
            addItem(oneItem);

            if (oneItem.type == "bomb") {
                item.createGetItemEffect(oneItem.x, oneItem.y, "bomb");
            }
            else {
                item.createGetItemEffect(oneItem.x, oneItem.y, "power");
            }

            item.items.splice(i, 1);
        }
    }

    // 플레이어와 적 총알 충돌 처리
    for (let i = enemy.bullets.length - 1; i >= 0; i--) {
        let bullet = enemy.bullets[i];
        if (checkCollision(bullet, player) && !player.isInvincible) {
            // 플레이어 생명 1 감소
            life -= 1;

            // 이전 업그레이드 수만큼 아이템 드랍
            if (player.attack == 1) {
                item.createItem(player.x, player.y - 20, "power");
            }
            else if (player.attack == 3) {
                item.createItem(player.x, player.y - 20, "power");
                item.createItem(player.x, player.y - 20, "power");
            }
            else if (player.attack == 5) {
                item.createItem(player.x, player.y - 20, "power");
                item.createItem(player.x, player.y - 20, "power");
                item.createItem(player.x, player.y - 20, "power");
            }

            // 폭탄 2개 드랍
            item.createItem(player.x, player.y - 20, "bomb");
            item.createItem(player.x, player.y - 20, "bomb");

            player.attack = 1;

            // 플레이어 죽었을때 폭발 이펙트
            const effectWidth = 100; // 이펙트 좌표
            const effectHeight = 100;
            const effectX = player.x - effectWidth / 2; // 플레이어 x축 폭발 이펙트
            const effectY = player.y - effectHeight / 2; // 플레이어 y축 폭발 이펙트
            effects.push(new dieEffect(effectX, effectY));

            // 사망시 플레이어 위치 초기화
            player.x = 210;
            player.y = 550;

            // 무적 상태 시작
            player.isInvincible = true;

            // 플레이어가 맞았을때 깜빡임
            let blinkCount = 0;
            let blinkInterval = setInterval(() => {
                player.isVisible = !player.isVisible;
                blinkCount++;

                // blinkCount가 초과하면 setInterval 작업을 종료, 플레이어의 무적 상태를 해제
                if (blinkCount > 20) {
                    clearInterval(blinkInterval);
                    player.isVisible = true;
                    player.isInvincible = false;
                }
            }, 200);

            // 생명이 0 이하면 게임 종료
            if (life <= 0) {
                isGameOver = true;
            }

            // 충돌한 적 총알 제거
            enemy.bullets.splice(i, 1);
        }
    }
}

// 아이템 획득 처리
function addItem(item) {
    switch (item.type) {
        case 'power':
            if (player.attack < 5) {
                player.attack += 2;
            }
            break;
        case 'bomb':
            bomb += 1;
            break;
        default:
    }
}

function drawPlayer() {
    ctx.drawImage(player.img, player.x - player.imgWidth / 2, player.y - player.imgWidth / 2, player.imgWidth, player.imgHeight);
}

function drawLife() {
    ctx.fillStyle = 'yellow';
    ctx.font = '20px Arial';
    ctx.drawImage(img_life, 10, 10, 30, 30);
    ctx.fillText("x " + life, 45, 30);
}

function drawBomb() {
    ctx.fillStyle = 'yellow';
    ctx.font = '20px Arial';
    ctx.drawImage(img_bomb2, 10, 50, 30, 30);
    ctx.fillText('x ' + bomb, 45, 70);
}

// ########## 업데이트 함수 ##########
function update() {
    updateBullets();
    updateBombs();
    handleCollision();

    map.update(canvas);
    enemy.update(canvas, [player.x, player.y]);
    item.update(canvas);

    // 적 모듈에서 게임 오버 상태 체크
    if (enemy.isGameOver) {
        isGameOver = true;
        win = true;
    }
}

// ########## 그리기 함수 ##########
function draw() {
    map.draw(ctx);  // 맵 모듈 그리기
    enemy.draw(ctx);  // 적 모듈 그리기
    item.draw(ctx);  // 아이템 그리기

    drawBombs();
    drawEffect();  // 이펙트 그리기
    drawBullets();

    processKeyInput();

    if (player.isVisible) {
        drawPlayer();
    }

    drawLife();
    drawBomb();
}

const GameState = {
    start: 0,
    play: 1,
    end: 2,
}

let nowState = GameState.start;

// ########## gameloop ##########
function gameloop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (nowState == GameState.start) {
        ctx.drawImage(startImg, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(keyGuideImg, 140, 360, 192, 100);

        if (keys.includes(true)) {
            nowState = GameState.play;
        }
    }
    else if (nowState == GameState.play) {
        if (isGameOver) {
            console.log("3")
            nowState = GameState.end;
        }

        update();
        draw();
    }
    else if (nowState == GameState.end) {
        if (win) {
            ctx.drawImage(gameWinImg, 0, 0, canvas.width, canvas.height);
        }
        else {
            ctx.drawImage(gameOverImg, 0, 0, canvas.width, canvas.height);
        }
    }

    requestAnimationFrame(gameloop);
}

map.setMap(1);
gameloop();