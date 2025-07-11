let map1 = new Image();
map1.src = "../images/PNG/Image44.png";

let maps = new Array(map1);

export function draw(ctx){
    ctx.drawImage(map1, 0, -map1.height - 1220, 450, 3652);
}

export function update(canvas){

}