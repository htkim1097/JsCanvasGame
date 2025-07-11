// k250710 모듈 생성

// 이동 패턴
export const MovePattern = {
    FORWARD: 0,
    LEFT: 1,
    RIGHT: 2
};

// 캔버스 크기. 임시로 하드코딩 함.
const canvasWidth = 450;
const canvasHeight = 600;

// 적 객체 배열
const enemies = new Array();
const effects = new Array();

// 소형 적 객체
function SmallEnemy(movePattern, imageSrc) {
    this.x;
    this.y = -100;
    this.width = 40;    // hit box 너비
    this.height = 40;   // hit box 높이
    this.life = 1;      // 작은 적은 한 방에 죽도록 체력을 1로 맞춤
    this.speed = 3;    // 이동 속도
    this.updateCnt = 0;
    this.movePattern = movePattern;
    this.img = new Image();
    this.img.src = imageSrc;

    // 이동 패턴에 따라 초기 위치값 설정
    switch (movePattern) {
        case MovePattern.FORWARD:
            this.x = rangeRandom(this.width, canvasWidth - this.width);
            break;
        case MovePattern.LEFT:
            this.x = rangeRandom(canvasWidth / 2, canvasWidth - this.width);
            break;
        case MovePattern.RIGHT:
            this.x = rangeRandom(this.width, canvasWidth / 2);
            break;
    }
}

// 폭발 이펙트 객체
function explosionAnim(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.interval = 2;
    this.updateCnt = 0;
    this.imgArr = new Array();

    for (let i = 0; i < 10; i++){
        let img = new Image();
        //img.src = this.imgPaths[i];
        img.src = `../images/PNG/Image${81 + i}.png`;
        this.imgArr.push(img);
    }
}

effects.push(new explosionAnim(150, 150, 140, 140));

// 적 항공기 생성(테스트용)
export function createEnemy(movePattern, img) {
    enemies.push(new SmallEnemy(movePattern, img));
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

    // 이펙트 그리기
    for (let i = 0; i < effects.length; i++){
        let eff = effects[i];
        eff.updateCnt++;
        let n = Math.floor(eff.updateCnt / eff.interval) - 1;

        if (eff.imgArr.length <= n){
            effects.splice(i);
            continue;
        }

        if (eff.updateCnt % eff.interval == 0) {
            ctx.drawImage(eff.imgArr[n], eff.x, eff.y, eff.w, eff.w);
        }
    }
}

export function update(canvas) {
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];

        // 적의 이동
        moveEnemy(enemy);

        // 캔버스 바깥으로 넘어가면
        if (enemy.y > canvas.height) {
            enemies.splice(i, 1);   // 적 삭제; i번째 아이템부터 1개 삭제한다는 의미
        }
    }
}

// 적의 이동 패턴에 따라 좌표값을 수정한다
function moveEnemy(enemy) {
    enemy.updateCnt++;

    switch (enemy.movePattern) {
        case MovePattern.FORWARD:
            enemy.y += enemy.speed;
            break;
        case MovePattern.LEFT:
            if (enemy.updateCnt < rangeRandom(40, 70)) {
                enemy.y += enemy.speed;
            }
            else {
                enemy.y += enemy.speed;
                enemy.x -= 1;
            }
            break;
        case MovePattern.RIGHT:
            if (enemy.updateCnt < rangeRandom(40, 70)) {
                enemy.y += enemy.speed;
            }
            else {
                enemy.y += enemy.speed;
                enemy.x += 1;
            }
            break;
    }
}

// 적 파괴
function destroy(idx) {
    // 체력이 0 이하일 때만 폭발 이펙트
    if (enemies[idx].life <= 0) {
        let enemy = enemies[0];

        // 현재 위치에 폭발 이펙트 생성
        effects.push(new explosionAnim(enemy.x, enemy.y, enemy.width - 3));
    }

    enemies.splice(idx, 1);
}

// 최소, 최대 값 사이의 정수를 랜덤 반환한다
function rangeRandom(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
}