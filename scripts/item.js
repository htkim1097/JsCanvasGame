// 캔버스 크기. 임시로 하드코딩 함.
const canvasWidth = 450;
const canvasHeight = 600;

// 아이템 객체 배열
const itemArray = new Array();

// 폭발 이펙트 객체 -> 아이템 객체
// 1. 폭탄, 아이템 공통 객체를 만들고 객체 변수로 구분하기?
// 2. 따로 프로토타입 객체 만들기
function explosionAnim(x, y) {
    // 아이템 위치
    this.x = x;
    this.y = y;

    // 아이템 크기
    this.w = 20;
    this.h = 20;

    // 이미지 전환 간격
    this.interval = 2;

    // 업데이트 횟수
    this.updateCnt = 0;

    // 전환할 이미지 배열
    this.imgArr = new Array();

    // 전환 이미지 초기화
    for (let i = 0; i < 10; i++){
        let img = new Image();
        img.src = `../images/PNG/Image${81 + i}.png`;
        this.imgArr.push(img);
    }
}

// 아이템 생성
export function createEnemy(movePattern, img) {
    enemies.push(new SmallEnemy(movePattern, img));
}

// 위치, 상태 업데이트 함수
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

// 그리기 함수
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

// 아이템 이동. (맵 테두리에 부딪히면 튕겨나가게)
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

// 특정 x, y 좌표에 아이템 생성하기