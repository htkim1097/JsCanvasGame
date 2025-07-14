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

// 플레이어
let player = {
    x: 210,
    y: 550,
    width: 50,
    height: 50,
    attack: 1, // 총알 갯수
    speed: 5,
    isInvincible: false, // 무적 상태
    isVisible: true // HP 1개 차감후 깜빡이는 효과
};

let fps = 200;
let bulletTime = 0;
let bombTime = 0;
let life = 3;
let bomb = 5;

var keys = [];
let effects = [];
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
        // 플레이어가 오른쪽 경계를 넘어가지 않도록 제한(구글링)
        if(player.x + player.width / 2 > canvas.width){
            // 오른쪽 경계 바로 안쪽으로 위치 고정
            player.x = canvas.width - player.width / 2;
        }
    }
    // 왼쪽
    if (keys[37]) {
        player.x -= player.speed;
        // 왼쪽 경계 밖으로 나가지 않도록 제한
        if(player.x - player.width / 2 < 0){
            // 왼쪽 경계 바로 안쪽으로 위치 고정
            player.x = player.width / 2;
        }
    }
    // 위
    if (keys[38]) {
        player.y -= player.speed;
        // 위쪽 경계 밖으로 나가지 않도록 제한
        if(player.y - player.height / 2 < 0) { 
            // 위쪽 경계 바로 안쪽으로 위치 고정
            player.y = player.height / 2;
        }
    }
    // 아래
    if (keys[40]) {
        player.y += player.speed;
        // 아래쪽 경계 밖으로 나가지 않도록 제한
        if(player.y + player.height / 2 > canvas.height){
            // 아래쪽 경계 바로 안쪽으로 위치 고정
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
    let bullet = {
        x: player.x + player.width / 2 - 32, // 비행기 중앙에서 발사
        y: player.y - 30, // 비행기 위치에서 발사
        width: 15, // 총알 너비
        height: 20, // 총알 높이
        speed: 5 // 총알 속도
    };
    playerBullets.push(bullet);
}

// 총알 그리기 함수
function drawBullets() {
    for (let i = 0; i < playerBullets.length; i++) {
        let bullet = playerBullets[i];
        ctx.drawImage(img_bullet, bullet.x, bullet.y, bullet.width, bullet.height); // 총알을 비행기 중앙에서 발사
    }
}

// 총알 위치 업데이트 함수
function updateBullets() {
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        playerBullets[i].y -= playerBullets[i].speed;
        if (playerBullets[i].y < 0) {
            playerBullets.splice(i, 1); // 총알 제거
        }
    }
}

// ####### 폭탄 함수 ##########(오류수정 gpt)
let bombs = [];
BombEffect.images = [];

(function preBombImages(){
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
    if(bomb > 0){
        bomb -= 1;
        let bombobj = {
            x: player.x + player.width / 2 - 40,
            y: player.y - 30,
            width: 30,
            height: 30,
            speed: 10,
            targetY: player.y - 150, // 플레이어 기준 앞으로(y축) 150만큼 올라감
            exploded: false, // 폭발 여부 체크
            explosionDuration: 180, // 180프레임동안 폭발 유지
            explosionTimer: 0,
        };
        bombs.push(bombobj);
    }
}

function drawBombs() {
    for (let i = 0; i < bombs.length; i++) {
        let bomb = bombs[i];
        if (!bomb.exploded){ // 아직 터지지 않은 폭탄만 그리기
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
                    y: bomb.y - 300,
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

// ####### 충돌 처리 ##########(구글링, gpt)
let isGameOver = false; 

function checkCollision(obj1, obj2){
    return(
        obj1.x < obj2.x + obj2.width && // obj1 왼쪽이 obj2 오른쪽보다 왼쪽에 있고
        obj1.x + obj1.width > obj2.x && // obj1 오른쪽이 obj2 왼쪽보다 오른쪽에 있고
        obj1.y < obj2.y + obj2.height && // obj1 위쪽이 obj2 아래쪽보다 위에 있고
        obj1.y + obj1.height > obj2.y // obj1 아래쪽이 obj2 위쪽보다 아래에 있으면 충돌
    );
}

function handleCollision() {
    //console.log("item.Items:", item.Items);
    // 플레이어 총알과 적 충돌 처리
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        let bullet = playerBullets[i];
        for (let j = enemy.enemies.length - 1; j >= 0; j--) {
            let oneEnemy = enemy.enemies[j];
            if (checkCollision(bullet, oneEnemy)){
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
            if (checkCollision(bomb, oneEnemy)){
                bombs.splice(i, 1);
                enemy.enemies.splice(j, 1);
                break;
            }
        }
    }

    // 플레이어와 아이템 충돌 처리
    for (let i = item.items.length -1; i >= 0; i--) {
        let oneItem = item.items[i];
        if (checkCollision(player, oneItem)){
            addItem(oneItem);
            item.items.splice(i, 1);
        }
    }

    // 플레이어와 적 총알 충돌 처리
    for (let i = enemy.bullets.length - 1; i >= 0; i--) {
        let bullet = enemy.bullets[i];
        if (checkCollision(bullet, player) && !player.isInvincible){
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
function addItem(item){
    switch(item.type){
        case 'power':
            player.attack += 1;
            break;
        case 'bomb':
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
