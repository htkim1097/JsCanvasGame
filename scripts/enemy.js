// 캔버스 크기. 임시로 하드코딩 함.
const canvasWidth = 450;
const canvasHeight = 600;

let totalUpdateCnt = 0;

export const enemies = new Array();  // 적 비행기 객체 배열
export const bullets = new Array();  // 탄 객체 배열
const effects = new Array();  // 효과 객체 배열

// 이동 패턴
export const RedSmallPattern = {
    FORWARD: 0,
    RETURN: 1
};

// 소형 적 비행기1
// 상단에서 출현 -> 직진 공격
function RedSmallPlane(x, pattern) {
    this.x = x;
    this.y = -100;
    this.width = 38;
    this.height = 38;
    this.life = 1;
    this.speed = 3;
    this.updateCnt = 0;
    this.movePattern = pattern;
    this.img = new Image(this.width, this.height);
    this.img.src = "../images/PNG/Image79.png";
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
}

// 적색 저속탄
function RedBullet(x, y) {
    this.x = x;
    this.y = y;
    this.width = 17;
    this.height = 17;
    this.speed = 1;
    this.img = new Image();
    this.img.src = "../images/enemy_bullet1.png";
}

// 청색 고속탄
function BlueBullet(x, y) {
    this.x = x;
    this.y = y;
    this.width = 17;
    this.height = 17;
    this.speed = 2;
    this.img = new Image(this.width, this.height);
    this.img.src = "../images/enemy_bullet2.png";
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
            ctx.drawImage(bullet.img, bullet.x, bullet.y);
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

export function update(canvas) {
    createEnemy();

    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        enemy.updateCnt++;

        // 적의 이동
        moveEnemy(enemy);

        // 체력이 0 이하일 때만 폭발 이펙트
        if (enemy.life <= 0) {
            // 현재 위치에 폭발 이펙트 생성
            effects.push(new explosionAnim(enemy.x, enemy.y, enemy.width, enemy.height));
            enemies.splice(i, 1);
        }

        // 캔버스 바깥으로 넘어가면
        if (enemy.y > canvas.height) {
            enemies.splice(i, 1);   // 적 삭제; i번째 아이템부터 1개 삭제한다는 의미
        }
    }

    for (let i = 0; i < bullets.length; i++) {
        let b = bullets[i];

        b.y += 5;
        if (b.y > canvasHeight || b.y < 0 || b.x > canvasWidth || b.x < 0) {
            bullets.splice(i, 1);
        }
    }
}

// 적의 이동 패턴에 따라 좌표값을 수정한다
function moveEnemy(enemy) {
    switch (typeof enemy) {
        case RedSmallPlane:
            if (enemy.pattern == RedSmallPattern.FORWARD){

            }
            else{

            }

            break;

        case BlueSmallPlane:
            if (enemy.pattern == BlueSmallPattern.FORWARD) {
                enemy.y += enemy.speed;
            }
            else if (enemy.pattern == BlueSmallPattern.LEFT) {

            }
            else if (enemy.pattern == BlueSmallPattern.RIGHT) {
                enemy.y += enemy.speed;
                enemy.x -= 1;
            }

            break;

        case MiddlePlane:
            if (enemy.updateCnt < rangeRandom(40, 70)) {

            }
            else {
            
            }

            break;
        case LargePlane:
            
            break;
    }

    if (enemy.updateCnt > rangeRandom(30, 70) && enemy.updateCnt % 25 == 0) {
        bullets.push(new RedBullet(enemy.x, enemy.y));
    }
}

// 최소, 최대 값 사이의 정수를 랜덤 반환한다
function rangeRandom(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
}

// 적 항공기 생성
function createEnemy() {
    totalUpdateCnt++;
    console.log(totalUpdateCnt);

    if (totalUpdateCnt == 100) {
        enemies.push(new RedSmallPlane(100, RedSmallPattern.FORWARD));

    }
}