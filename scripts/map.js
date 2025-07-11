// 캔버스 크기. 임시로 하드코딩 함.
const canvasWidth = 450;
const canvasHeight = 600;

let mapSrcArr = new Array("../images/PNG/Image44.png");
let mapScroll = 0;
let nowMap;

function Map(src, hOffset){
    this.img = new Image();
    this.img.src = src;
    this.x = 0;
    this.y = hOffset;
}

export function setMap(stageNum) {
    nowMap = new Map(mapSrcArr[stageNum - 1], -3650);
}

export function draw(ctx) {
    ctx.drawImage(nowMap.img, nowMap.x, nowMap.y + mapScroll);
}

export function update(canvas) {
    mapScroll += 1;
    if (mapScroll >= nowMap.img.height - canvasHeight){
        mapScroll = 0;
    }
}