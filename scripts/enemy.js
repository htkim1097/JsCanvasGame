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

// 작은 적 항공기 사용자 객체
function EnemySmall(movePattern) {
    this.x;
    this.y = -100;
    this.width = 20,    // hit box 너비
        this.height = 20,   // hit box 높이
        this.life = 1;      // 작은 적은 한 방에 죽도록 체력을 1로 맞춤
    this.speed = 3;    // 이동 속도
    this.updateCnt = 0;
    this.movePattern = movePattern;

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

// 적 항공기 생성(테스트용)
export function createEnemy(movePattern) {
    enemies.push(new EnemySmall(movePattern));
}

export function drawEnemies(ctx) {
    for (let i = 0; i < enemies.length; i++) {
        ctx.fillStyle = 'red';

        let enemy = enemies[i];
        // 임시로 적을 박스로 그리기
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
}

export function updateEnemies(canvas) {
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

function moveToXY(x, y) {

}

// 최소, 최대 값 사이의 정수를 랜덤 반환한다
function rangeRandom(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
}