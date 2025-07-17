// 아이템 객체 배열
export const items = [];
// 폭발 이펙트 객체 -> 아이템 객체

let img_poweritem = new Image();
let img_bombitem = new Image();
img_poweritem.src = "../images/png/Image144.png";
img_bombitem.src = "../images/png/Image259.png";

//폭탄 아이템 텍스트 이펙트 이미지 
const img_bombtext1 = new Image();
const img_bombtext2 = new Image();

img_bombtext1.src = "../images/png/Image260.png";
img_bombtext2.src = "../images/png/Image264.png";

const img_powertext1 = new Image();
const img_powertext2 = new Image();

img_powertext1.src = "../images/png/Image261.png";
img_powertext2.src = "../images/png/Image263.png";

//텍스트 효과 배열
const effects = []; 


function Item(x, y, type) {
    this.x = x;
    this.y = y;
    this.width = 25;
    this.height = 36;
    this.type = type;  // 타입 설정
    this.interval = 2;  // 이미지 전환 간격
    this.updateCnt = 0;  // 업데이트 횟수
    this.speed = 1.7;  // 속도

    const directions = [-1, 1]; // 왼쪽/오른쪽 , 위/아래
    const dirX = directions[Math.floor(Math.random() * 2)];
    const dirY = directions[Math.floor(Math.random() * 2)];

    //방향 설정
    this.dx = dirX * this.speed;
    this.dy = dirY * this.speed;
}

export function createItem(x, y, type) {
    items.push(new Item(x, y, type));
}

export function createGetItemEffect(x, y, type) {
    effects.push(new ItemGetEffect(x, y, type));
}

// 아이템 위치 업데이트 함수
export function update(canvas) {
    for (let i = 0; i < items.length; i++) {
        let item = items[i];

        // 아이템 위치를 속도만큼 이동
        item.x += item.dx; //x좌표 이동
        item.y += item.dy; //y좌표 이동

        //양 옆 벽 충돌 감지
        if (item.x + item.width >= canvas.width || item.x < 0) {
            item.x = Math.max(0, Math.min(canvas.width - item.width, item.x)); //화면 밖으로 나가지 않게 위치 보정
            item.dx *= -item.dx; //x 축 방향 반전(좌, 우)

            const directions = [-1, 1]; //벽 충돌 시 방향 재설정
            item.dx = directions[Math.floor(Math.random() * 2)] * item.speed;
            item.dy = directions[Math.floor(Math.random() * 2)] * item.speed;
        }
        // 위아래 벽 충돌 감지
        if (item.y + item.height >= canvas.height || item.y < 0) {
            item.y = Math.max(0, Math.min(canvas.height - item.height, item.y));
            item.dy *= -item.dy; //y축 방향 반전(위, 아래)

            const directions = [-1, 1];
            item.dy = directions[Math.floor(Math.random() * 2)] * item.speed;
            item.dx = directions[Math.floor(Math.random() * 2)] * item.speed;

        }
    }
    //텍스트 이펙트 업데이트 
    for (let i = effects.length - 1; i >= 0; i--) {
        const effect = effects[i];
        effect.update();
        
        // 최대 프레임 넘으면 제거(텍스트 효과 사라지기)
        if (effect.updateCnt >= effect.maxFrame) {
            effects.splice(i, 1);
        }
    }
}

// 아이템 캔버스 그리기 함수
export function draw(ctx) {
    for (let i = 0; i < items.length; i++) {
        let item = items[i];

        if (item.type == "power") {
            ctx.drawImage(img_poweritem, item.x, item.y, item.width, item.height);
        }
        else {
            ctx.drawImage(img_bombitem, item.x, item.y, item.width, item.height);
        }
    }
    for (let i = 0; i < effects.length; i++) {
        effects[i].draw(ctx);
    }
}
// bomb 아이템 텍스트 이펙트 객체 생성 함수
export function ItemGetEffect(x, y, type) {
    this.x = x;
    this.y = y;
    
    this.width = 110;
    this.height = 50;
    
    this.updateCnt = 0;
    this.interval = 3;
    this.currentFrame = 0;
    this.maxFrame = 20; //이펙트 총 지속 프레임 수
    this.slideSpeed = 1; // 슬라이드 이동 속도
    this.animFrames = [type == "bomb" ? img_bombtext1 : img_powertext1, type == "bomb" ? img_bombtext2 : img_powertext2];

    this.update = function () {
        this.y -= this.slideSpeed;
        this.updateCnt++;
        
        //이미지 교체 - interval마다 프레임 변경
        if (this.updateCnt % this.interval === 0) {
            this.currentFrame++;
        }
    };
    
    //이벤트 그리기 함수
    this.draw = function (ctx) {
        const frame = this.animFrames[this.currentFrame % this.animFrames.length];
        ctx.drawImage(frame, this.x, this.y, this.width, this.height);
    };
}
