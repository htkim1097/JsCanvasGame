// 캔버스 크기. 임시로 하드코딩 함.
const canvasWidth = 450;
const canvasHeight = 600;

const redBulletSize = 17;
const blueBulletSize = 15;

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

const BulletType = {
    BLUE: 0,
    RED: 1,
}

// 소형 적 비행기1
// 상단에서 출현 -> 직진 공격, 히트앤런, 종열 대형 공격
function RedSmallPlane(x, pattern, isHoming) {
    this.x = x;
    this.y = -100;
    this.width = 44;
    this.height = 44;
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
            bullets.push(new RedBullet(this.gunX, this.y + this.height, isHoming));
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
// 상단에서 출현 -> 좌우 선회 공격, 직진 공격
function BlueSmallPlane(x, pattern, isHoming) {
    this.x = x;
    this.y = -100;
    this.width = 44;
    this.height = 44;
    this.life = 1;
    this.speed = 5;
    this.updateCnt = 0;
    this.movePattern = pattern;
    this.img = new Image(this.width, this.height);
    this.img.src = "../images/PNG/Image104.png";
    this.gunX = this.x + (this.width / 2) - (redBulletSize / 2);
    this.isDestroyed = false;

    this.fire = async (num, intervalMs) => {
        await sleep(500);
        for (let i = 0; i < num; i++) {
            if (this.isDestroyed) {
                return;
            }

            if (isHoming) {
                bullets.push(new BlueBullet(this.gunX, this.y + this.height, playerPos[0], playerPos[1]));
            }
            else {
                bullets.push(new BlueBullet(this.gunX, this.y + this.height));
            }

            await sleep(intervalMs);
        }
    }
}

// 중형 적 비행기
// 상단 출현 -> 체류 공격 -> 좌우 이탈
function MiddlePlane(x, y, destX, destY, isHoming) {
    this.x = x;
    this.y = y;
    this.destX = destX;
    this.destY = destY;
    this.width = 60;
    this.height = 60;
    this.life = 8;
    this.speed = 3;
    this.updateCnt = 0;
    this.img = new Image();
    this.img.src = "../images/PNG/Image110.png";
    this.isDestroyed = false;

    this.fire = async (num, intervalMs) => {
        await sleep(500);
        for (let i = 0; i < num; i++) {
            if (this.isDestroyed) {
                return;
            }

            if (isHoming) {
                bullets.push(new BlueBullet(this.x + 14, this.y + this.height, playerPos[0], playerPos[1]));
            }
            else {
                bullets.push(new BlueBullet(this.x + 14, this.y + this.height));
            }

            await sleep(intervalMs);
        }
    }
}

// 대형 적 비행기
// 상단에서 출현 -> 체류 공격 -> 저속으로 하단 이탈
function LargePlane(x, y, destX, destY) {
    this.x = x;
    this.y = y;
    this.destX = destX;
    this.destY = destY;
    this.width = 130;
    this.height = 95;
    this.life = 25;
    this.speed = 2;
    this.updateCnt = 0;
    this.img = new Image(this.width, this.height);
    this.img.src = "../images/PNG/Image96.png";
    this.gunX = this.x + (this.width / 2) - (redBulletSize / 2)
    this.isDestroyed = false;

    this.fire = async (bullet, num, intervalMs) => {
        await sleep(500);
        if (bullet == BulletType.RED) {
            for (let i = 0; i < num; i++) {
                if (this.isDestroyed) {
                    return;
                }
                bullets.push(new RedBullet(this.x + 10, this.y + 35, ));
                bullets.push(new RedBullet(this.x + 10, this.y + 35));
                bullets.push(new RedBullet(this.x + 10, this.y + 35));

                bullets.push(new RedBullet(this.x + 100, this.y + 35, 100, this.y + Math.cos(10), this.x + Math.sin(30)));
                bullets.push(new RedBullet(this.x + 100, this.y + 35));
                bullets.push(new RedBullet(this.x + 100, this.y + 35));
                await sleep(intervalMs);
            }
        }
        else {
            for (let i = 0; i < num; i++) {
                if (this.isDestroyed) {
                    return;
                }
                bullets.push(new BlueBullet(this.x + 57, this.y + 70));
                await sleep(50);
                bullets.push(new BlueBullet(this.x + 56, this.y + 70));
                await sleep(50);
                bullets.push(new BlueBullet(this.x + 57, this.y + 70));
                await sleep(intervalMs);
            }
        }

    }
}

// 적색 저속탄
function RedBullet(x, y, destX, destY) {
    this.x = x;
    this.y = y;
    this.destX = destX;
    this.destY = destY;
    this.width = redBulletSize;
    this.height = redBulletSize;
    this.speed = 5;
    this.img = new Image();
    this.img.src = "../images/enemy_bullet1.png";
    this.updateCnt = 0;
    this.vx = 0;
    this.vy = 1;

    this.move = () => {
        this.updateCnt++;
        // 추적 목표가 있고, 일정 업데이트 횟수 미만일 때 목표를 향하는 벡터 계산.
        if ((this.destX != undefined || this.destY != undefined) && this.updateCnt < 10) {
            let dx = this.destX - this.x;
            let dy = this.destY - this.y;
            let len = Math.sqrt(dx * dx + dy * dy);
            this.vx = dx / len;
            this.vy = dy / len;
        }

        this.x += this.vx * this.speed;
        this.y += this.vy * this.speed;
    }
}

// 청색 고속탄
function BlueBullet(x, y, destX, destY) {
    this.x = x;
    this.y = y;
    this.destX = destX;
    this.destY = destY;
    this.width = blueBulletSize;
    this.height = blueBulletSize;
    this.speed = 7;
    this.img = new Image(this.width, this.height);
    this.img.src = "../images/enemy_bullet2.png";
    this.updateCnt = 0;
    this.vx = 0;
    this.vy = 1;

    this.move = () => {
        this.updateCnt++;
        // 추적 목표가 있고, 일정 업데이트 횟수 미만일 때 목표를 향하는 벡터 계산.
        if ((this.destX != undefined || this.destY != undefined) && this.updateCnt < 10) {
            let dx = this.destX - this.x;
            let dy = this.destY - this.y;
            let len = Math.sqrt(dx * dx + dy * dy);
            this.vx = dx / len;
            this.vy = dy / len;
        }

        this.x += this.vx * this.speed;
        this.y += this.vy * this.speed;
    }
}

// 폭발 이펙트 객체
function ExplosionAnim(x, y, w, h) {
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

    // 탄 그리기
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

    if (frameCnt % 100 == 0) {
        // console.log(bullets);
        console.log(enemies);
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
                if (enemy.updateCnt < 80) {
                    enemy.y += enemy.speed;
                }
                else {
                    enemy.y -= enemy.speed;
                }
        }
    }
    else if (enemy instanceof BlueSmallPlane) {
        switch (enemy.movePattern) {
            case BlueSmallPattern.FORWARD:
                enemy.y += enemy.speed;
                break;
            case BlueSmallPattern.LEFT:
                if (enemy.updateCnt < 30) {
                    enemy.y += enemy.speed;

                }
                else {
                    enemy.y += enemy.speed;
                    enemy.x -= enemy.speed / 3;
                }

                break;
            case BlueSmallPattern.RIGHT:
                if (enemy.updateCnt < 30) {
                    enemy.y += enemy.speed;
                }
                else {
                    enemy.y += enemy.speed;
                    enemy.x += enemy.speed / 3;
                }
        }
    }
    else if (enemy instanceof MiddlePlane) {
        // 상단 출현
        if (enemy.updateCnt < 400) {
            let dx = enemy.destX - enemy.x;
            let dy = enemy.destY - enemy.y;
            let len = Math.sqrt(dx * dx + dy * dy);
            let vx = dx / len;
            let vy = dy / len;

            if (enemy.destX - 10 > enemy.x || enemy.x > enemy.destX + 10) {
                enemy.x += vx * enemy.speed;
            }

            if (enemy.y < enemy.destY - 10 || enemy.destY + 10 < enemy.y) {
                enemy.y += vy * enemy.speed;
            }
        }
        // 좌우 이탈
        else {
            // 좌측 이탈
            if (enemy.x < canvasWidth / 2) {
                enemy.x -= 1;
                enemy.y += 0.5;
            }
            // 우측 이탈
            else {
                enemy.x += 1;
                enemy.y += 0.5;
            }
        }
    }
    else if (enemy instanceof LargePlane) {
        // 상단 출현
        if (enemy.updateCnt < 300) {
            let dx = enemy.destX - enemy.x;
            let dy = enemy.destY - enemy.y;
            let len = Math.sqrt(dx * dx + dy * dy);
            let vx = dx / len;
            let vy = dy / len;

            if (enemy.destX - 10 > enemy.x || enemy.x > enemy.destX + 10) {
                enemy.x += vx * enemy.speed;
            }

            if (enemy.y < enemy.destY - 10 || enemy.destY + 10 < enemy.y) {
                enemy.y += vy * enemy.speed;
            }
        }
    }
}

async function addRedSmallPlane(planeNum, intervalMs, isHoming, x = -1, pattern = RedSmallPattern.FORWARD) {
    switch (pattern) {
        case RedSmallPattern.VERTICAL:
            let posX = canvasWidth / 5 + (canvasWidth / 5 * rangeRandom(1, 3));

            for (let i = 1; i <= planeNum; i++) {
                let enemy = new RedSmallPlane(x == -1 ? posX : x, pattern, isHoming);
                enemy.fire(2, 3000);
                enemies.push(enemy);
                await sleep(intervalMs);
            }
            break;

        default:
            for (let i = 1; i <= planeNum; i++) {
                let enemy = new RedSmallPlane(x == -1 ? (canvasWidth / (planeNum + 1) * i) - 19 : x, pattern, isHoming);
                enemy.fire(2, 3000);
                enemies.push(enemy);
                await sleep(intervalMs);
            }
    }
}

async function addBlueSmallPlane(planeNum, intervalMs, isHoming, x = -1, pattern = BlueSmallPattern.FORWARD) {
    switch (pattern) {
        case BlueSmallPattern.LEFT:
            for (let i = 1; i <= planeNum; i++) {
                let enemy = new BlueSmallPlane(x == -1 ? rangeRandom(canvasWidth / 2, canvasWidth - 56) : x, pattern, isHoming);
                enemy.fire(2, 3000);
                enemies.push(enemy);
                await sleep(intervalMs);
            }
            break;
        case BlueSmallPattern.RIGHT:
            for (let i = 1; i <= planeNum; i++) {
                let enemy = new BlueSmallPlane(x == -1 ? rangeRandom(56, canvasWidth / 2) : x, pattern, isHoming);
                enemy.fire(2, 3000);
                enemies.push(enemy);
                await sleep(intervalMs);
            }
            break;
        default:
            for (let i = 1; i <= planeNum; i++) {
                let enemy = new BlueSmallPlane(x == -1 ? rangeRandom(50, canvasWidth - 50) : x, pattern, isHoming);
                enemy.fire(2, 3000);
                enemies.push(enemy);
                await sleep(intervalMs);
            }
    }
}

async function addMiddlePlane(planeNum, intervalMs, x, y, destX, destY, isHoming) {
    for (let i = 1; i <= planeNum; i++) {
        let enemy = new MiddlePlane(x, y, destX - rangeRandom(15, 25) * (i - 1), destY + rangeRandom(80, 90) * (i - 1), isHoming);
        enemy.fire(12, 2000);
        enemies.push(enemy);
        await sleep(intervalMs);
    }
}

async function addLargePlane(planeNum, intervalMs, x, y, destX, destY) {
    for (let i = 1; i <= planeNum; i++) {
        let enemy = new LargePlane(x, y, destX, destY);
        enemy.fire(BulletType.BLUE, 100, 3000);
        enemy.fire(BulletType.RED, 500, 3000);
        enemies.push(enemy);
        await sleep(intervalMs);
    }
}

export function damaged(enemy, damage) {
    enemy.life -= damage;
}

// 적 객체 제거
function checkDelCondition(enemy, canvas) {
    // 체력이 0 이하일 때
    if (enemy.life <= 0) {
        // 현재 위치에 폭발 이펙트 생성
        effects.push(new ExplosionAnim(enemy.x, enemy.y, enemy.width, enemy.height));
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


// 적 항공기 생성
function createEnemy() {
    switch (frameCnt) {
        case 100:
            addLargePlane(1, 0, 0, -100, 200, 170);
            //addRedSmallPlane(5, 200);
            //addBlueSmallPlane(10, 200, true, -1, BlueSmallPattern.RIGHT);
            //addMiddlePlane(3, 300, 150, -50, 100, 100, true);
            //addMiddlePlane(3, 300, 350, -50, 300, 100, true);
            break;
        case 200:
            addLargePlane(1, 0, 0, -100, 300, 170);
            //addBlueSmallPlane(3, 200, true, 100, BlueSmallPattern.RIGHT);
            break;
        case 300:
            addLargePlane(1, 0, 0, -100, 10, 170);
            //addBlueSmallPlane(3, 200, true, 300, BlueSmallPattern.LEFT);
            break;
        case 350:
            //addRedSmallPlane(3, 0);
            break;
        // case 500:
        //     addRedSmallPlane(4, 300, true, canvasWidth / 5 * 1, RedSmallPattern.VERTICAL);
        //     break;
        // case 700:
        //     addRedSmallPlane(4, 300, true, canvasWidth / 5 * 3, RedSmallPattern.VERTICAL);
        //     break;
        // case 900:
        //     addBlueSmallPlane(3, 200, true, -1, BlueSmallPattern.LEFT);
        //     break;
        // case 1100:
        //     addBlueSmallPlane(5, 200, true);
        //     break;
        // case 1200:
        //     addRedSmallPlane(4, 300, true);
        //     addBlueSmallPlane(3, 200, true, -1, BlueSmallPattern.RIGHT);
        //     break;
        // case 1400:
        //     addBlueSmallPlane(3, 200, true);
        //     break;
        // case 1600:
        //     addRedSmallPlane(4, 300, true, canvasWidth / 5 * 3, RedSmallPattern.VERTICAL);
        //     break;
        // case 1800:
        //     break;
        // case 2000:
        //     addBlueSmallPlane(10, 200, true);
        //     break;
        // case 2100:
        //     addRedSmallPlane(4, 300, true, canvasWidth / 5 * 3, RedSmallPattern.VERTICAL);
        //     break;
        // case 2300:
        //     break;
        // case 2500:
        //     addRedSmallPlane(5, 200);
        //     break;
        // case 2700:
        //     break;
        // case 2900:
        //     addRedSmallPlane(4, 300, true, canvasWidth / 5 * 3, RedSmallPattern.VERTICAL);
        //     break;
        // case 3100:
        //     addRedSmallPlane(5, 200);
        //     break;
        // case 3300:
        //     addBlueSmallPlane(8, 200, true);
        //     break;
        // case 3400:
        //     addRedSmallPlane(4, 300, true, canvasWidth / 5 * 1, RedSmallPattern.VERTICAL);
        //     break;
        // case 3600:
        //     break;
        // case 3800:
        //     addRedSmallPlane(4, 300, true, canvasWidth / 5 * 1, RedSmallPattern.VERTICAL);
        //     break;
        // case 3900:
        //     addRedSmallPlane(4, 300, true, canvasWidth / 5 * 3, RedSmallPattern.VERTICAL);
        //     break;
        // case 4100:
        //     addBlueSmallPlane(4, 200, true);
        //     break;
        // case 4300:
        //     addBlueSmallPlane(3, 200, true);
        //     break;
        // case 4500:
        //     addRedSmallPlane(4, 200);
        //     break;
        // case 4700:
        //     break;
        // case 4800:
        //     addBlueSmallPlane(3, 200, true);
        //     break;
        // case 5000:
        //     addRedSmallPlane(7, 200);
        //     break;
        // case 5200:
        //     addBlueSmallPlane(12, 400, true);
        //     break;
        // case 5400:
        //     break;
        // case 5600:
        //     addRedSmallPlane(5, 200);
        //     break;
        // case 5800:
        //     break;
        // case 6000:
        //     break;
        // case 6300:
        //     break;
        // case 6500:
        //     addBlueSmallPlane(3, 200, true);
        //     break;
        // case 6700:
        //     addRedSmallPlane(4, 300, true, canvasWidth / 5 * 1, RedSmallPattern.VERTICAL);
        //     break;
        // case 6900:
        //     addRedSmallPlane(4, 300, true, canvasWidth / 5 * 3, RedSmallPattern.VERTICAL);
        //     break;
        // case 7100:
        //     break;
        // case 7300:
        //     addRedSmallPlane(3, 200);
        //     break;
        // case 7500:
        //     addBlueSmallPlane(3, 200, true);
        //     break;
        // case 7700:
        //     break;
        // case 7900:
        //     addRedSmallPlane(5, 200);
        //     break;
        // case 8100:
        //     addBlueSmallPlane(8, 200, true);
        //     break;
        // case 8200:
        //     break;
        // case 8300:
        //     break;
    }
}