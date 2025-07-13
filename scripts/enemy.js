// 캔버스 크기. 임시로 하드코딩 함.
const canvasWidth = 450;
const canvasHeight = 600;

const redBulletSize = 10;
const blueBulletSize = 14;

let playerPos = [];

let frameCnt = 0;

export const enemies = new Array();  // 적 비행기 객체 배열
export const bullets = new Array();  // 탄 객체 배열
const effects = new Array();  // 효과 객체 배열

// 이동 패턴
export const RedSmallPattern = {
    FORWARD: 0,
    RETURN: 1,
    VERTICAL: 2,
};

// 소형 적 비행기1
// 상단에서 출현 -> 직진 공격
function RedSmallPlane(x, pattern) {
    this.x = x;
    this.y = -100;
    this.width = 38;
    this.height = 38;
    this.life = 1;
    this.speed = 4;
    this.updateCnt = 0;
    this.movePattern = pattern;
    this.img = new Image(this.width, this.height);
    this.img.src = "../images/PNG/Image79.png";
    this.gunX = this.x + (this.width / 2) - (redBulletSize / 2);
    this.isDestroyed = false;

    this.fire = async (num, intervalMs) => {
        await sleep(500);
        for (let i = 0; i < num; i++) {
            if (this.isDestroyed) {
                return;
            }
            bullets.push(new RedBullet(this.gunX, this.y + this.height));
            await sleep(intervalMs);
        }
    }
}

// 이동 패턴
export const BlueSmallPattern = {
    FORWARD: 0,
    LEFT: 1,
    RIGHT: 2
};

// 소형 적 비행기2
// 상단에서 출현 -> 좌우 선회 공격
function BlueSmallPlane(x, pattern) {
    this.x = x;
    this.y = -100;
    this.width = 40;
    this.height = 40;
    this.life = 1;
    this.speed = 3;
    this.updateCnt = 0;
    this.movePattern = pattern;
    this.img = new Image(this.width, this.height);
    this.img.src = "../images/PNG/Image104.png";
    this.gunX = this.x + (this.width / 2) - (redBulletSize / 2)

    this.fire = async (num, intervalMs) => {
        await sleep(500);
        for (let i = 0; i < num; i++) {
            bullets.push(new RedBullet(this.gunX, this.y));
            await sleep(intervalMs);
        }
    }
}

// 중형 적 비행기
// 좌우에서 출현 -> 체류 공격 -> 상단 이탈
function MiddlePlane(x, y) {
    this.x = x;
    this.y = y;
    this.width = 52;
    this.height = 52;
    this.life = 10;
    this.speed = 2;
    this.updateCnt = 0;
    this.img = new Image(this.width, this.height);
    this.img.src = "../images/PNG/Image110.png";
    this.gunX = this.x + (this.width / 2) - (redBulletSize / 2)

    this.fire = async (num, intervalMs) => {
        await sleep(500);
        for (let i = 0; i < num; i++) {
            bullets.push(new RedBullet(this.gunX, this.y));
            await sleep(intervalMs);
        }
    }
}

// 대형 적 비행기
// 상단에서 출현 -> 체류 공격 -> 저속으로 하단 이탈
function LargePlane(x, y) {
    this.x = x;
    this.y = y;
    this.width = 70;
    this.height = 70;
    this.life = 30;
    this.speed = 1;
    this.updateCnt = 0;
    this.img = new Image(this.width, this.height);
    this.img.src = "../images/PNG/Image96.png";
    this.gunX = this.x + (this.width / 2) - (redBulletSize / 2)

    this.fire = async (num, intervalMs) => {
        await sleep(500);
        for (let i = 0; i < num; i++) {
            bullets.push(new RedBullet(this.gunX, this.y));
            await sleep(intervalMs);
        }
    }
}

// 적색 저속탄
function RedBullet(x, y, isHoming) {
    this.x = x;
    this.y = y;
    this.width = redBulletSize;
    this.height = redBulletSize;
    this.speed = 5;
    this.img = new Image();
    this.img.src = "../images/enemy_bullet1.png";
    this.updateCnt = 0;
    this.isHoming = false;
    this.vx = 0;
    this.vy = 1;

    this.move = () => {
        this.updateCnt++;
        if (this.isHoming && this.updateCnt < 10) {
            let dx = playerPos[0] - this.x;
            let dy = playerPos[1] - this.y;
            let len = Math.sqrt(dx * dx + dy * dy);
            this.vx = dx / len;
            this.vy = dy / len;
        }

        this.x += this.vx * this.speed;
        this.y += this.vy * this.speed;
    }
}

// 청색 고속탄
function BlueBullet(x, y, isHoming) {
    this.x = x;
    this.y = y;
    this.width = blueBulletSize;
    this.height = blueBulletSize;
    this.speed = 8;
    this.img = new Image(this.width, this.height);
    this.img.src = "../images/enemy_bullet2.png";
    this.updateCnt = 0;
    this.isHoming = false;
    this.vx = 0;
    this.vy = 1;

    this.move = () => {
        this.updateCnt++;
        if (this.isHoming && this.updateCnt < 10) {
            let dx = playerPos[0] - this.x;
            let dy = playerPos[1] - this.y;
            let len = Math.sqrt(dx * dx + dy * dy);
            this.vx = dx / len;
            this.vy = dy / len;
        }

        this.x += this.vx * this.speed;
        this.y += this.vy * this.speed;
    }
}

// 폭발 이펙트 객체
function explosionAnim(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.interval = 2;
    this.updateCnt = 0;
    this.imgArr = new Array();

    for (let i = 0; i < 10; i++) {
        let img = new Image();
        //img.src = this.imgPaths[i];
        img.src = `../images/PNG/Image${81 + i}.png`;
        this.imgArr.push(img);
    }
}

export function draw(ctx) {
    // 적 그리기
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];

        if (enemy.img.src != undefined) {
            ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
        }
        // 이미지 파일이 없으면 적을 박스로 그리기
        else {
            ctx.fillStyle = 'red';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
    }

    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];

        if (bullet.img.src != undefined) {
            ctx.drawImage(bullet.img, bullet.x, bullet.y, bullet.width, bullet.height);
        }
    }

    // 이펙트 그리기
    for (let i = 0; i < effects.length; i++) {
        let eff = effects[i];
        eff.updateCnt++;
        let n = Math.floor(eff.updateCnt / eff.interval) - 1;

        if (eff.imgArr.length <= n) {
            effects.splice(i);
            continue;
        }

        if (eff.updateCnt % eff.interval == 0) {
            ctx.drawImage(eff.imgArr[n], eff.x, eff.y);
        }
    }
}

export function update(canvas, pPos) {
    frameCnt++;
    playerPos[0] = pPos[0];
    playerPos[1] = pPos[1];

    // console.log(frameCnt);
    if (frameCnt % 100 == 0) {
        console.log(bullets);
    }

    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        enemy.updateCnt++;

        // 적의 이동
        moveEnemy(enemy);
        // 적 객체 제거 확인
        checkDelCondition(enemy, canvas);
    }

    // 탄 이동
    for (let i = 0; i < bullets.length; i++) {
        let b = bullets[i];
        b.move();

        if (b.y > canvasHeight || b.y < 0 || b.x > canvasWidth || b.x < 0) {
            bullets.splice(i, 1);
        }
    }

    createEnemy();
}

// 적의 이동 패턴에 따라 좌표값을 수정한다
function moveEnemy(enemy) {
    if (enemy instanceof RedSmallPlane) {
        switch (enemy.movePattern) {
            case RedSmallPattern.FORWARD:
            case RedSmallPattern.VERTICAL:
                enemy.y += enemy.speed;
                break;
            case RedSmallPattern.RETURN:
                if (enemy.updateCnt < 140) {
                    enemy.y += enemy.speed;
                }
                else {
                    enemy.y -= enemy.speed;
                }
        }
    }
    else if (enemy instanceof BlueSmallPlane) {
        if (enemy.movePattern == BlueSmallPattern.FORWARD) {
            enemy.y += enemy.speed;
        }
        else if (enemy.movePattern == BlueSmallPattern.LEFT) {

        }
        else if (enemy.movePattern == BlueSmallPattern.RIGHT) {
            enemy.y += enemy.speed;
            enemy.x -= 1;
        }
    }
    else if (enemy instanceof MiddlePlane) {

    }
    else if (enemy instanceof LargePlane) {

    }
}

// 적 항공기 생성
function createEnemy() {
    switch (frameCnt) {
        case 100:
            addRedSmallPlane(5, 200);
            break;
        case 350:
            addRedSmallPlane(3, 0);
            break;
        case 600:
            addRedSmallPlane(4, 300, canvasWidth / 5 * 1, RedSmallPattern.VERTICAL);
            break;
        case 700:
            addRedSmallPlane(4, 300, canvasWidth / 5 * 3, RedSmallPattern.VERTICAL);
            break;
        case 900:
            break;
        case 1100:
            break;
    }
}

async function addRedSmallPlane(planeNum, intervalMs, x = -1, fireToPlayer = false, pattern = RedSmallPattern.FORWARD) {
    switch (pattern) {
        case RedSmallPattern.VERTICAL:
            let posX = canvasWidth / 5 + (canvasWidth / 5 * rangeRandom(1, 3));

            for (let i = 1; i <= planeNum; i++) {
                let enemy = new RedSmallPlane(x == -1 ? posX : x, pattern);
                enemy.fire(2, 3000);
                enemies.push(enemy);
                await sleep(intervalMs);
            }
            break;

        default:
            for (let i = 1; i <= planeNum; i++) {
                let enemy = new RedSmallPlane(x == -1 ? (canvasWidth / (planeNum + 1) * i) - 19 : x, pattern);
                enemy.fire(2, 3000);
                enemies.push(enemy);
                await sleep(intervalMs);
            }
    }
}

async function addBlueSmallPlane(planeNum, pattern) {

}

async function addMiddlePlane(planeNum, pattern) {

}

async function addLargePlane(planeNum, pattern) {

}

export function damaged(enemy, damage){
    enemy.life -= damage;
}

// 적 객체 제거
function checkDelCondition(enemy, canvas) {
    // 체력이 0 이하일 때
    if (enemy.life <= 0) {
        // 현재 위치에 폭발 이펙트 생성
        effects.push(new explosionAnim(enemy.x, enemy.y, enemy.width, enemy.height));
        enemy.isDestroyed = true;
        enemies.splice(enemies.indexOf(enemy), 1);
    }

    // 캔버스 바깥으로 넘어가면
    if (enemy.y < -100 || enemy.y > canvas.height + 100 || enemy.x < -100 || enemy.x > canvas.width + 100) {
        enemy.isDestroyed = true;
        enemies.splice(enemies.indexOf(enemy), 1);
    }
}

// 비동기 지연시간
async function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

// 최소, 최대 값 사이의 정수를 랜덤 반환한다
function rangeRandom(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
}