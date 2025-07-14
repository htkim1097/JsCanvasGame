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
    this.width = 20;
    this.height = 20;
    this.type = type;  // 타입 설정
    this.interval = 2;  // 이미지 전환 간격
    this.updateCnt = 0;  // 업데이트 횟수
    this.speed = 1;  // 속도
 
const directions = [-1, 1]; // 왼쪽.오른쪽 / 위,아래
const dirX = directions[Math.floor(Math.random() * 2)];
const dirY = directions[Math.floor(Math.random() * 2)];

//방향 설정
this.dx = dirX * this.speed;
this.dy = dirY * this.speed;
}


// 아이템 생성할 때
// 적 파괴 위치
// 플레이어 파괴 위치
//export function createItem(x, y, type) {
//    items.push(new Item(x, y, type));
//}

// 테스트용
createItem(100, 100, itemType.power);
createItem(100, 100, itemType.boom);
createItem(100, 100, itemType.boom);

export function createItem(x, y, type) {
    items.push(new Item(x, y, type));
}

function bounceRandom(item) {
    const speed = Math.sqrt(item.dx ** 2 + item.dy ** 2);
    const angle = Math.random() * 2 * Math.PI;
    item.dx = Math.cos(angle) * speed;
    item.dy = Math.sin(angle) * speed;
}


// 아이템 위치, 상태 업데이트 함수 >> 아이템 이동
export function update(canvas) {
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        // 아이템 이동
        item.x += item.dx;
        item.y += item.dy;
        
        if(item.x + item.width + item.dx > canvas.width - item.height || item.x + item.dx <0) {
            //item.dx = - item.dx; //방향 반전
            bounceRandom(item);
    }
        if(item.y + item.height + item.dy > canvas.height - item.height || item.y + item.dy <0) {
            //item.dy = - item.dy;
            bounceRandom(item);
        
    }
}
}



//function handleItemCollision(player, items) {
//    for (let i = items.length - 1; i>=0; i--) {
//        const item = items[i];
//    
//        if(checkCollision(item, player)) {
//            items.splice(i, 1); //충돌 시 아이템 제거
//            
//            
//        }
//    }
//}     
//function checkCollision(item, player){
//    return(
//        item.x < player.x + player.width && 
//        item.x + item.width > player.x &&
//        item.y < player.y + player.height &&
//        item.y + item.height > player.y
//    );
//}









// 아이템 캔버스 그리기 함수
export function draw(ctx) {
    for (let i = 0; i < items.length; i++) {
        let item = items[i];

        if (item.type == itemType.power){
            ctx.drawImage(img_poweritem, item.x, item.y, 30, 35);
        }
        else {
            ctx.drawImage(img_bombitem, item.x, item.y, 40, 40);
        }
        
    }
}
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
//}

