// 캔버스 크기. 임시로 하드코딩 함.
const canvasWidth = 450;
const canvasHeight = 600;

const redBulletSize = 17;
const blueBulletSize = 15;

let playerPos = [];
let frameCnt = 0;
export let isGameOver = false;

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

            if (isHoming) {
                bullets.push(new RedBullet(this.gunX, this.y + this.height, playerPos[0], playerPos[1]));
            }
            else {
                bullets.push(new RedBullet(this.gunX, this.y + this.height));
            }

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
    this.width = 70;
    this.height = 70;
    this.life = 12;
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
    this.life = 45;
    this.speed = 2;
    this.updateCnt = 0;
    this.img = new Image(this.width, this.height);
    this.img.src = "../images/PNG/Image96.png";
    this.isDestroyed = false;

    this.fire = async (bullet, num, intervalMs) => {
        await sleep(1500);
        if (bullet == BulletType.RED) {
            for (let i = 0; i < num; i++) {
                if (this.isDestroyed) {
                    return;
                }

                let startAng = 60;
                for (let j = 0; j < 5; j++) {
                    bullets.push(new RedBullet(this.x + 10, this.y + 35, this.x + 10 + 100 * Math.cos(degToRad(startAng + (15 * j))), this.y + 35 + 100 * Math.sin(degToRad(startAng + (15 * j)))));
                }

                for (let j = 0; j < 5; j++) {
                    bullets.push(new RedBullet(this.x + 100, this.y + 35, this.x + 100 + 100 * Math.cos(degToRad(startAng + (15 * j))), this.y + 35 + 100 * Math.sin(degToRad(startAng + (15 * j)))));
                }


                await sleep(intervalMs);
            }
        }
        else {
            for (let i = 0; i < num; i++) {
                if (this.isDestroyed) {
                    return;
                }
                bullets.push(new BlueBullet(this.x + 57, this.y + 70, playerPos[0], playerPos[1]));
                await sleep(50);
                bullets.push(new BlueBullet(this.x + 56, this.y + 70, playerPos[0], playerPos[1]));
                await sleep(50);
                bullets.push(new BlueBullet(this.x + 57, this.y + 70, playerPos[0], playerPos[1]));
                await sleep(intervalMs);
            }
        }

    }
}

// 보스 Phase 1
function BossPlane(x, y) {
    this.x = x;
    this.y = y;
    this.destXs = [0, 135];
    this.destYs = [100, 100];
    this.width = 320;
    this.height = 160;
    this.life = 1;
    this.speed = 1;
    this.updateCnt = 0;
    this.img = new Image(this.width, this.height);
    this.img.src = "../images/PNG/Image94.png";
    this.isDestroyed = false;
    this.nextMove = 0;
    this.lw = [];
    this.rw = [];
    this.tw = [];

    this.changeNextMove = async () => {
        while (!this.isDestroyed) {
            await sleep(3200);
            if (this.nextMove == 0) {
                this.nextMove = 1;
            }
            else {
                this.nextMove = 0;
            }
        }
    }

    this.fire = async () => {
        // 출현할 때는 공격 안함.
        await sleep(2500);

        // 발사 각
        let startAng = 60;

        while (true) {
            // 공격 패턴 A 
            // 하단 호 모양으로 5x3연발 공격
            for (let j = 0; j < 3; j++) {
                for (let i = 0; i < 5; i++) {
                    this.updateXY();
                    let destX = this.x + 1000 * Math.cos(degToRad(startAng + (15 * i)));
                    let destY = this.y + 1000 * Math.sin(degToRad(startAng + (15 * i)));
                    bullets.push(new RedBullet(this.tw[0], this.tw[1], destX + 150, destY));
                }
                if (this.isDestroyed) {
                    this.onDestroyed();
                    return;
                }
                await sleep(200);
            }

            await sleep(300);

            // 공격 패턴 B
            // 랜덤으로 탄을 난사하는 공격
            for (let i = 0; i < 20; i++) {
                this.updateXY();
                bullets.push(new BlueBullet(this.rw[0], this.rw[1], rangeRandom(0, canvasWidth), rangeRandom(0, canvasHeight)));
                bullets.push(new BlueBullet(this.lw[0], this.lw[1], rangeRandom(0, canvasWidth), rangeRandom(0, canvasHeight)));
                bullets.push(new BlueBullet(this.rw[0], this.rw[1], rangeRandom(0, canvasWidth), rangeRandom(0, canvasHeight)));
                bullets.push(new BlueBullet(this.lw[0], this.lw[1], rangeRandom(0, canvasWidth), rangeRandom(0, canvasHeight)));
                if (this.isDestroyed) {
                    this.onDestroyed();
                    return;
                }
                await sleep(250);
            }

            await sleep(300);

            // 공격 패턴 C
            // 유도 공격
            for (let j = 0; j < 3; j++) {
                for (let i = 0; i < 3; i++) {
                    this.updateXY();
                    bullets.push(new BlueBullet(this.lw[0], this.lw[1], playerPos[0], playerPos[1]));
                    bullets.push(new BlueBullet(this.rw[0], this.rw[1], playerPos[0], playerPos[1]));
                    await sleep(50);
                }
                if (this.isDestroyed) {
                    this.onDestroyed();
                    return;
                }
                await sleep(300);
            }

            await sleep(300);
        }
    }

    this.updateXY = () => {
        // 발사 위치
        this.lw = [this.x + this.width / 3, this.y + 68];  // 왼쪽 날개
        this.rw = [this.x + this.width / 3 + 100, this.y + 68];  // 오른쪽 날개
        this.tw = [this.x + this.width / 2 - 10, this.y + this.height];  // 꼬리 날개
    }

    this.onDestroyed = async () => {
        await sleep(1000);

        effects.push(new RealBossFirstAnim(this.x + 50, this.y, 200, 120));

        await sleep(1200);

        let enemy = new RealBossPlane(this.x + 50, this.y);
        enemy.changeNextMove();
        enemy.fire();
        enemies.push(enemy);
    }
}

// 보스 Phase 2
function RealBossPlane(x, y) {
    this.x = x;
    this.y = y;
    this.destXs = [0, 300, 200, 120, 150, 150, 10, 70, 210];
    this.destYs = [100, 180, 30, 100, 20, 250, 200, 40, 60];
    this.width = 200;
    this.height = 120;
    this.life = 300;
    this.speed = 4;
    this.updateCnt = 0;
    this.isDestroyed = false;
    this.nextMove = 0;
    this.lw = [];
    this.rw = [];
    this.tw = [];
    this.img = new Image();
    this.img.src = "../images/PNG/Image161.png";

    this.changeNextMove = async () => {
        while (!this.isDestroyed) {
            await sleep(2000);
            if (this.nextMove >= this.destXs.length) {
                this.nextMove = 0;
            }
            this.nextMove++;
        }
    }

    this.fire = async () => {
        // 출현할 때는 공격 안함.
        await sleep(2500);

        // 발사 각
        let startAng = 60;


        // todo
        // 2페이즈 공격 패턴 짜기

        while (true) {
            // 공격 패턴 A 
            // 하단 호 모양으로 5x3연발 공격
            for (let j = 0; j < 3; j++) {
                for (let i = 0; i < 5; i++) {
                    this.updateXY();
                    let destX = this.x + 1000 * Math.cos(degToRad(startAng + (15 * i)));
                    let destY = this.y + 1000 * Math.sin(degToRad(startAng + (15 * i)));
                    bullets.push(new RedBullet(this.tw[0], this.tw[1], destX + 150, destY));
                }
                if (this.isDestroyed) {
                    await sleep(3000);
                    isGameOver = true;
                    return;
                }
                await sleep(200);
            }

            await sleep(300);

            // 공격 패턴 B
            // 랜덤으로 탄을 난사하는 공격
            for (let i = 0; i < 20; i++) {
                this.updateXY();
                bullets.push(new BlueBullet(this.rw[0], this.rw[1], rangeRandom(0, canvasWidth), rangeRandom(0, canvasHeight)));
                bullets.push(new BlueBullet(this.lw[0], this.lw[1], rangeRandom(0, canvasWidth), rangeRandom(0, canvasHeight)));
                bullets.push(new BlueBullet(this.rw[0], this.rw[1], rangeRandom(0, canvasWidth), rangeRandom(0, canvasHeight)));
                bullets.push(new BlueBullet(this.lw[0], this.lw[1], rangeRandom(0, canvasWidth), rangeRandom(0, canvasHeight)));

                if (this.isDestroyed) {
                    await sleep(3000);
                    isGameOver = true;
                    return;
                }
                await sleep(250);
            }

            await sleep(300);

            // 공격 패턴 C
            // 유도 공격
            for (let j = 0; j < 3; j++) {
                for (let i = 0; i < 3; i++) {
                    this.updateXY();
                    bullets.push(new BlueBullet(this.lw[0], this.lw[1], playerPos[0], playerPos[1]));
                    bullets.push(new BlueBullet(this.rw[0], this.rw[1], playerPos[0], playerPos[1]));
                    await sleep(50);
                }
                if (this.isDestroyed) {
                    await sleep(3000);
                    isGameOver = true;
                    return;
                }
                await sleep(300);
            }

            await sleep(300);
        }
    }

    this.updateXY = () => {
        // 발사 위치
        this.lw = [this.x + this.width / 3 - 25, this.y + 68];  // 왼쪽 날개
        this.rw = [this.x + this.width / 3 + 75, this.y + 68];  // 오른쪽 날개
        this.tw = [this.x + this.width / 2 - 10, this.y + this.height];  // 꼬리 날개
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
    this.interval = 5;
    this.updateCnt = 0;
    this.animFrames = new Array();
    this.currentFrame = 0;

    for (let i = 0; i < 10; i++) {
        let img = new Image();
        img.src = `../images/PNG/Image${81 + i}.png`;
        this.animFrames.push(img);
    }
}

// 보스 로봇 등장 씬
function RealBossFirstAnim(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.interval = 10;
    this.updateCnt = 0;
    this.animFrames = new Array();
    this.currentFrame = 0;

    for (let i = 0; i < 6; i++) {
        let img = new Image();
        img.src = `../images/PNG/Image${156 + i}.png`;
        this.animFrames.push(img);
    }
}

export async function draw(ctx) {
    // 적 그리기
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];

        if (enemy.img.src != undefined) {
            ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
        }
        // else if (enemy instanceof RealBossPlane){
        //     for (let i = 0; i < enemy.mainImgs.length; i++){
        //         ctx.drawImage(enemy.mainImgs[i], 100, 100, 100, 100);
        //     }
        // }
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
    else if (enemy instanceof BossPlane) {
        if (enemy.updateCnt < 200) {
            enemy.y += enemy.speed;
        }
        else if (enemy.updateCnt > 300) {
            let destX = enemy.destXs[enemy.nextMove];
            let destY = enemy.destYs[enemy.nextMove];
            let dx = destX - enemy.x;
            let dy = destY - enemy.y;
            let len = Math.sqrt(dx * dx + dy * dy);
            let vx = dx / len;
            let vy = dy / len;

            if (destX - 10 > enemy.x || enemy.x > destX + 10) {
                enemy.x += vx * enemy.speed;
            }

            if (enemy.y < destY - 10 || destY + 10 < enemy.y) {
                enemy.y += vy * enemy.speed;
            }
        }
    }
    else if (enemy instanceof RealBossPlane) {
        let destX = enemy.destXs[enemy.nextMove];
        let destY = enemy.destYs[enemy.nextMove];
        let dx = destX - enemy.x;
        let dy = destY - enemy.y;
        let len = Math.sqrt(dx * dx + dy * dy);
        let vx = dx / len;
        let vy = dy / len;

        if (destX - 10 > enemy.x || enemy.x > destX + 10) {
            enemy.x += vx * enemy.speed;
        }

        if (enemy.y < destY - 10 || destY + 10 < enemy.y) {
            enemy.y += vy * enemy.speed;
        }
    }
}

async function addRedSmallPlane(planeNum, intervalMs, isHoming, x = -1, pattern = RedSmallPattern.FORWARD) {
    switch (pattern) {
        case RedSmallPattern.VERTICAL:
            let posX = canvasWidth / 5 + (canvasWidth / 5 * rangeRandom(1, 3));

            for (let i = 1; i <= planeNum; i++) {
                let enemy = new RedSmallPlane(x == -1 ? posX : x, pattern, isHoming);
                enemy.fire(3, 3000);
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
        enemy.fire(BulletType.BLUE, 100, 2000);
        enemy.fire(BulletType.RED, 500, 3000);
        enemies.push(enemy);
        await sleep(intervalMs);
    }
}

function addBoss() {
    let enemy = new BossPlane(canvasWidth / 2 - 160, -160);
    enemy.changeNextMove();
    enemy.fire();
    enemies.push(enemy);
}

export function damaged(enemy, damage) {
    enemy.life -= damage;

    // x, y, power, bomb
    let itemArr = [];
    if (enemy instanceof MiddlePlane) {
        itemArr = [enemy.x, enemy.y, rangeRandom(-4, 2), rangeRandom(-3, 2)]
    }
    else if (enemy instanceof LargePlane) {
        itemArr = [enemy.x, enemy.y, 1, rangeRandom(0, 2)]
    }
    else if (enemy instanceof BossPlane) {
        itemArr = [enemy.x, enemy.y, 2, 2]
    }

    // 체력이 0 이하일 때
    if (checkLife(enemy)) {
        return itemArr;
    }
}

// 적 객체 제거
function checkDelCondition(enemy, canvas) {
    checkLife(enemy);

    // 캔버스 바깥으로 넘어가면
    if (enemy.y < -180 || enemy.y > canvas.height + 180 || enemy.x < -180 || enemy.x > canvas.width + 180) {
        enemy.isDestroyed = true;
        enemies.splice(enemies.indexOf(enemy), 1);
    }
}

function checkLife(enemy) {
    if (enemy.life <= 0) {
        // 현재 위치에 폭발 이펙트 생성
        effects.push(new ExplosionAnim(enemy.x, enemy.y, enemy.width, enemy.height));
        enemy.isDestroyed = true;
        enemies.splice(enemies.indexOf(enemy), 1);
        return true;
    }
    return false;
}

// 비동기 지연
async function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

// 최소, 최대 값 사이의 정수를 랜덤 반환한다
function rangeRandom(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
}

// 각도를 라디안으로  
function degToRad(deg) {
    return deg * Math.PI / 180;
}

// 적 항공기 생성
function createEnemy() {
    switch (frameCnt) {
        case 100:
            // addBoss();

            addRedSmallPlane(5, 200);
            break;
        case 200:
            addBlueSmallPlane(3, 200, true, 100, BlueSmallPattern.RIGHT);
            break;
        case 300:
            addBlueSmallPlane(3, 200, true, 300, BlueSmallPattern.LEFT);
            break;
        case 350:
            addRedSmallPlane(3, 0);
            addMiddlePlane(3, 300, 150, -50, 100, 100, true);
            break;
        case 500:
            addRedSmallPlane(4, 300, true, canvasWidth / 5 * 1, RedSmallPattern.VERTICAL);
            break;
        case 700:
            addRedSmallPlane(4, 300, true, canvasWidth / 5 * 3, RedSmallPattern.VERTICAL);
            break;
        case 900:
            addBlueSmallPlane(3, 200, true, -1, BlueSmallPattern.LEFT);
            addMiddlePlane(3, 300, 350, -50, 300, 100, true);
            break;
        case 1100:
            addBlueSmallPlane(5, 200, true);
            break;
        case 1200:
            addRedSmallPlane(4, 300, true);
            addBlueSmallPlane(3, 200, true, -1, BlueSmallPattern.RIGHT);
            break;
        case 1400:
            addBlueSmallPlane(3, 200, true);
            addLargePlane(1, 0, 0, -100, 80, 300);
            break;
        case 1600:
            addRedSmallPlane(4, 300, true, canvasWidth / 5 * 3, RedSmallPattern.VERTICAL);
            break;
        case 1800:
            addBlueSmallPlane(4, 200, true, -1, BlueSmallPattern.RIGHT);
            addBlueSmallPlane(4, 200, true, -1, BlueSmallPattern.LEFT);
            break;
        case 2000:
            addBlueSmallPlane(10, 200, true);
            addLargePlane(1, 0, 0, -100, 80, 300);
            break;
        case 2100:
            addRedSmallPlane(4, 300, true, canvasWidth / 5 * 3, RedSmallPattern.VERTICAL);
            break;
        case 2300:
            break;
        case 2500:
            addRedSmallPlane(5, 200);
            break;
        case 2700:
            break;
        case 2900:
            addRedSmallPlane(4, 300, true, canvasWidth / 5 * 3, RedSmallPattern.VERTICAL);
            break;
        case 3100:
            addRedSmallPlane(5, 200);
            addLargePlane(1, 0, 0, -100, 80, 300);
            break;
        case 3300:
            addBlueSmallPlane(8, 200, true);
            break;
        case 3400:
            addRedSmallPlane(4, 300, true, canvasWidth / 5 * 1, RedSmallPattern.VERTICAL);
            break;
        case 3600:
            addLargePlane(1, 0, 0, -100, 80, 300);
            break;
        case 3800:
            addRedSmallPlane(4, 300, true, canvasWidth / 5 * 1, RedSmallPattern.VERTICAL);
            break;
        case 3900:
            addRedSmallPlane(4, 300, true, canvasWidth / 5 * 3, RedSmallPattern.VERTICAL);
            break;
        case 4100:
            addBlueSmallPlane(4, 200, true);
            break;
        case 4300:
            addBlueSmallPlane(3, 200, true);
            break;
        case 4500:
            addRedSmallPlane(4, 200);
            break;
        case 4700:
            break;
        case 4800:
            addBlueSmallPlane(3, 200, true);
            break;
        case 5000:
            addRedSmallPlane(7, 200);
            break;
        case 5200:
            addBlueSmallPlane(12, 400, true);
            break;
        case 5400:
            break;
        case 5600:
            addRedSmallPlane(5, 200);
            break;
        case 5800:
            addLargePlane(1, 0, 0, -100, 80, 300);
            break;
        case 6000:
            break;
        case 6300:
            break;
        case 6500:
            addBlueSmallPlane(3, 200, true);
            break;
        case 6700:
            addRedSmallPlane(4, 300, true, canvasWidth / 5 * 1, RedSmallPattern.VERTICAL);
            break;
        case 6900:
            addRedSmallPlane(4, 300, true, canvasWidth / 5 * 3, RedSmallPattern.VERTICAL);
            break;
        case 7100:
            break;
        case 7300:
            addRedSmallPlane(3, 200);
            break;
        case 7500:
            addBoss();
            break;
    }
}