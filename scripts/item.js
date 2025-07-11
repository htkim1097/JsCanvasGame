// 캔버스 크기. 임시로 하드코딩 함.
const canvasWidth = 450;
const canvasHeight = 600;

// 아이템 객체 배열
const items = [];
// 폭발 이펙트 객체 -> 아이템 객체
// 폭탄, 아이템 공통 객체를 만들고 객체 변수로 구분하기(power,boom)


let img_poweritem = new Image();
let img_bombitem = new Image();
img_poweritem.src="../images/png/Image144.png";
img_bombitem.src="../images/png/Image259.png";

//아이템 타입 설정
const itemType = { 
    power : 'power',
    bomb : 'bomb'
};

function Item(x, y, type) {
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 20;
    this.type = type;  // 타입 설정
    this.interval = 2;  // 이미지 전환 간격
    this.updateCnt = 0;  // 업데이트 횟수
    this.speed = 3;  // 속도
} 

// 아이템 생성할 때
// 적 파괴 위치
// 플레이어 파괴 위치
// 아이템 생성 => 적 파괴시 or 플레이어 파괴시
//export function createItem(x, y, type) {
//    itemArray.push(new Item(x, y, type));
//}

// 테스트용
createItem(100, 100);

export function createItem(x, y, type = itemType.power) {
    items.push(new Item(x, y, type));
}



// 위치, 상태 업데이트 함수 >> 아이템 이동
export function update(canvas) {
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        // 아이템 이동
        item.x += 1;
    }
}


// 그리기 함수
export function draw(ctx) {
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        ctx.drawImage(img_item, item.x, item.y, 50, 50);
        
    }
}
//
//    // 아이템 그리기
//    for (let i = 0; i < items.length; i++) {
//        let item = items[i];
//
//        if (item.img.src != undefined) {
//            let path ="../images/png/Image144.png";
//            let img = new Image();
//            img.src = path;
//            
//            ctx.drawImage(item.img, item.x, item.y, item.width, item.height);
//        }
//        // 이미지 파일이 없으면 아이템을 박스로 그리기
//        else {
//            ctx.fillStyle = 'green';
//            ctx.fillRect(item.x, item.y, item.width, item.height);
//        }
//    
//}


// 아이템 이동. (맵 테두리에 부딪히면 튕겨나가게 - 충돌 방지)  중요!
function moveItem(item) {
    item.updateCnt++;

    switch (item.movePattern) {
        case MovePattern.FORWARD:
            item.y += item.speed;
            break;
        case MovePattern.LEFT:
            if (item.updateCnt < rangeRandom(40, 70)) {
                item.y += item.speed;
            }
            else {
                item.y += item.speed;
                item.x -= 1;
            }
            break;
        case MovePattern.RIGHT:
            if (item.updateCnt < rangeRandom(40, 70)) {
                item.y += item.speed;
            }
            else {
                item.y += item.speed;
                ITEM.x += 1;
            }
            break;
    }
}