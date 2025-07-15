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
let img_left = new Image();
let img_right = new Image();
let img_die = new Image();
img_player.src = "../images/png/Image45.png";
img_bullet.src = "../images/bullet.png";
img_bomb.src = "../images/bomb.png";
img_gameover.src = "../images/gameover.jpg";
img_left.src = "../images/left.png";
img_right.src = "../images/right.png";

// 플레이어
let player = {
    x: 210,
    y: 550,
    width: 50,
    height: 50,
    attack: 1, // 총알 갯수
    speed: 5,
    isInvincible: false, // 무적 상태
    isVisible: true, // HP 1개 차감후 깜빡이는 효과
    img: img_player
};

let delay = 200;
let bulletTime = 0;
let bombTime = 0;
let life = 10;
let bomb = 5;

var keys = [];
let effects = [];
map.setMap(1);

document.addEventListener("keydown", (e) => {
    keys[e.keyCode] = true;
    // console.log(e.keyCode);
});

document.addEventListener("keyup", (e) => {
    keys[e.keyCode] = false;
});

function update() {
    map.update(canvas);

    // 오른쪽
    if (keys[39]) {
        player.x += player.speed;
        player.img = img_right;
        // 플레이어가 오른쪽 경계를 넘어가지 않도록 제한(구글)
        if (player.x + player.width / 2 > canvas.width) {
            // 오른쪽 경계 바로 안쪽으로 위치 고정
            player.x = canvas.width - player.width / 2;
        }
    }
    // 왼쪽
    else if (keys[37]) {
        player.x -= player.speed;
        player.img = img_left;
        // 왼쪽 경계 밖으로 나가지 않도록 제한
        if (player.x - player.width / 2 < 0) {
            // 왼쪽 경계 바로 안쪽으로 위치 고정
            player.x = player.width / 2;
        }
    }
    else {
        player.img = img_player;
    }
    // 위
    if (keys[38]) {
        player.y -= player.speed;
        // 위쪽 경계 밖으로 나가지 않도록 제한
        if (player.y - player.height / 2 < 0) {
            // 위쪽 경계 바로 안쪽으로 위치 고정
            player.y = player.height / 2;
        }
    }
    // 아래
    if (keys[40]) {
        player.y += player.speed;
        // 아래쪽 경계 밖으로 나가지 않도록 제한
        if (player.y + player.height / 2 > canvas.height) {
            // 아래쪽 경계 바로 안쪽으로 위치 고정
            player.y = canvas.height - player.height / 2;
        }
    }

    // 스페이스 = 공격
    bulletTime += 1000 / delay;
    if (bulletTime >= 100) {
        if (keys[32]) {
            shootBullet();
            bulletTime = 0; // 발사후 시간 초기화
        }
    }

    // b = 폭탄
    bombTime += 1000 / delay;
    if (bombTime >= 100) {
        if (keys[66]) {
            shootBomb();
            bombTime = 0; // 발사후 시간 초기화
        }
    }

    item.update(canvas);
    enemy.update(canvas, [player.x, player.y]);
}

// ####### 총알 함수 ##########
let playerBullets = [];

// 총알 발사 함수
function shootBullet() {
    let space = 15; // 총알 사이의 간격
    let totalWidth = (player.attack - 1) * space;
    for (let i = 0; i < player.attack; i++) {
        let bullet = {
            x: player.x + player.width / 2 - 46 - totalWidth / 2 + i * space,// 비행기 중앙에서 발사
            y: player.y - 100, // 비행기 조정석 위치에서 발사
            width: 40, // 총알 너비
            height: 80, // 총알 높이
            speed: 20 // 총알 속도
        };
        playerBullets.push(bullet);
    }
}

// 총알 그리기 함수
function drawBullets() {
    if (player.attack == 1 && playerBullets.length >= 1) {
        let b1 = playerBullets[0];
        ctx.drawImage(img_bullet, b1.x, b1.y, b1.width, b1.height);
    }
    else if (player.attack == 3 && playerBullets.length >= 3) {
        let b1 = playerBullets[0];
        let b2 = playerBullets[1];
        let b3 = playerBullets[2];
        ctx.drawImage(img_bullet, b1.x, b1.y + 20, b1.width, b1.height);
        ctx.drawImage(img_bullet, b2.x, b2.y, b2.width, b2.height);
        ctx.drawImage(img_bullet, b3.x, b3.y + 20, b3.width, b3.height); 
    }
    else if (player.attack == 5 && playerBullets.length >= 5) {
        let b1 = playerBullets[0];
        let b2 = playerBullets[1];
        let b3 = playerBullets[2];
        let b4 = playerBullets[3];
        let b5 = playerBullets[4];
        ctx.drawImage(img_bullet, b1.x, b1.y + 40, b1.width, b1.height);
        ctx.drawImage(img_bullet, b2.x, b2.y + 20, b2.width, b2.height);
        ctx.drawImage(img_bullet, b3.x, b3.y, b3.width, b3.height); 
        ctx.drawImage(img_bullet, b4.x, b4.y + 20, b4.width, b4.height);
        ctx.drawImage(img_bullet, b5.x, b5.y + 40, b5.width, b5.height); 
    }
}

// 총알 위치 업데이트 함수
function updateBullets() {
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        playerBullets[i].y -= playerBullets[i].speed;
        if (playerBullets[i].y < -50) {
            playerBullets.splice(i, 1); // 총알 제거
        // if (playerBullets[i].y < -playerBullets[i].height){
        //     playerBullets[i].y = -playerBullets[i].height;        
        }
    }
}

// ####### 폭탄 함수 ##########(오류수정 gpt)
let bombs = [];
BombEffect.images = [];

(function preBombImages() {
    for (let i = 0; i < 4; i++) {
        let img = new Image();
        img.src = `../images/PNG/Image${189 + i}.png`;
        BombEffect.images.push(img);
    }
    for (let i = 0; i < 7; i++) {
        for (let j = 1; j < 5; j++) {
            let img = new Image();
            img.src = `../images/PNG/Image193_${j}.png`;
            BombEffect.images.push(img);
        }
    }
})();

function BombEffect(x, y) {
    this.x = x;
    this.y = y;
    this.width = 350;
    this.height = 350;
    this.interval = 3;
    this.updateCnt = 0;
    this.imgArr = BombEffect.images;
}

// 이펙트 그리기
function drawEffect() {
    for (let i = effects.length - 1; i >= 0; i--) {
        let eff = effects[i];
        eff.updateCnt++;
        let n = Math.floor(eff.updateCnt / eff.interval) - 1;
        if (n < 0) n = 0;

        if (eff.imgArr.length <= n) {
            effects.splice(i, 1);
            continue;
        }

        if (eff.updateCnt % eff.interval == 0) {
            ctx.drawImage(eff.imgArr[n], eff.x, eff.y, eff.width, eff.height);
        }
    }
}

function shootBomb() {
    if (bomb > 0) {
        bomb -= 1;
        let bombobj = {
            x: player.x + player.width / 2 - 40,
            y: player.y - 30,
            width: 30,
            height: 30,
            speed: 10,
            targetY: player.y - 150, // 플레이어 기준 앞으로(y축) 150만큼 올라감
            exploded: false, // 폭발 여부 체크
            explosionDuration: 120, // 120프레임동안 폭발 유지
            explosionTimer: 0,
        };
        bombs.push(bombobj);
    }
}

function drawBombs() {
    for (let i = 0; i < bombs.length; i++) {
        let bomb = bombs[i];
        if (!bomb.exploded) { // 아직 터지지 않은 폭탄만 그리기
            ctx.drawImage(img_bomb, bomb.x, bomb.y, bomb.width, bomb.height);
        }
    }
}

let clearEnemyBullets = false;

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
                    y: bomb.y - 200,
                    width: 350,
                    height: 350
                };
                effects.push(new BombEffect(bomb.bombArea.x, bomb.bombArea.y));
            }
        } else {
            bomb.explosionTimer++;

            // 폭발 중 총알 제거
            if (enemy.bullets && enemy.bullets.length) {
                for (let j = enemy.bullets.length - 1; j >= 0; j--) {
                    if (checkCollision(enemy.bullets[j], bomb.bombArea)) {
                        enemy.bullets.splice(j, 1);
                    }
                }
            }

            // 폭발 지속시간 끝나면 폭탄 제거
            if (bomb.explosionTimer > bomb.explosionDuration) {
                bombs.splice(i, 1);
            }
        }
    }
}

// ####### 충돌 처리 ##########(구글, gpt)
let isGameOver = false;

function checkCollision(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width && // obj1 왼쪽이 obj2 오른쪽보다 왼쪽에 있고
        obj1.x + obj1.width > obj2.x && // obj1 오른쪽이 obj2 왼쪽보다 오른쪽에 있고
        obj1.y < obj2.y + obj2.height * 0.5 && // obj1 위쪽이 obj2 아래쪽보다 위에 있고(obj2.height * 0.5 적 높이 충돌박스 감소)
        obj1.y + obj1.height > obj2.y // obj1 아래쪽이 obj2 위쪽보다 아래에 있으면 충돌
    );
}

function handleCollision() {

    // 플레이어 총알과 적 충돌 처리
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        let bullet = playerBullets[i];
        for (let j = enemy.enemies.length - 1; j >= 0; j--) {
            let oneEnemy = enemy.enemies[j];

            if (checkCollision(bullet, oneEnemy)) {
                playerBullets.splice(i, 1);
                enemy.damaged(oneEnemy, 1);
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
                bombs.splice(i, 1);
                enemy.damaged(oneEnemy, 50);
                break;
            }
        }
    }

    // 플레이어와 아이템 충돌 처리
    for (let i = item.items.length - 1; i >= 0; i--) {
        let oneItem = item.items[i];
        if (checkCollision(player, oneItem)) {
            addItem(oneItem);
            item.items.splice(i, 1);
        }
    }

    // 플레이어와 적 총알 충돌 처리
    for (let i = enemy.bullets.length - 1; i >= 0; i--) {
        let bullet = enemy.bullets[i];
        if (checkCollision(bullet, player) && !player.isInvincible) {
            life -= 1;
            player.isInvincible = true;

            let blinkCount = 0;
            let blinkInterval = setInterval(() => {
                player.isVisible = !player.isVisible;
                blinkCount++;
                if (blinkCount > 5) {
                    clearInterval(blinkInterval);
                    player.isVisible = true;
                    player.isInvincible = false;
                }
            }, 200);

            if (life <= 0) {

                item.items.push({
                    x: player.x - 15,
                    y: player.y - 15,
                    width: 30,
                    height: 3,
                    type: 'power'
                });
                isGameOver = true;
            }

            enemy.bullets.splice(i, 1);
        }
    }

    if (clearEnemyBullets) {
        enemy.bullets = [];
        clearEnemyBullets = false;
    }
}

// # 아이템 획득 처리
function addItem(item) {
    switch (item.type) {
        case 'power':
            // console.log("power");
            if (player.attack < 5) {
                player.attack += 2;
            }
            break;
        case 'bomb':
            // console.log("bomb");
            bomb += 1;
            break;
        default:
    }
}


function gameOver() {
    ctx.drawImage(img_gameover, 0, 0, canvas.width, canvas.height);
}

// ####### 그리기 ##########
function drawMap() {
    map.draw(ctx);
}

function drawPlayer() {
    ctx.drawImage(player.img, player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
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
    ctx.fillStyle = 'red';
    ctx.font = '20px Arial';
    ctx.fillText('life : ' + life, 10, 40);
}

function drawBomb() {
    ctx.fillStyle = 'red';
    ctx.font = '20px Arial';
    ctx.fillText('Bomb : ' + bomb, 10, 70);
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
    drawBomb(); // bomb 그리기

    requestAnimationFrame(gameloop);
}

gameloop();
