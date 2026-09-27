
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const retryBtn = document.getElementById("retryBtn")
const retry = document.getElementById("retry")

let boardwidth = 650
let boardheight = 650
let tileHeight = 50
let direction = "ArrowUp"
let x = 200
let y = 200
let queued = "ArrowUp"
let bodylength = 0
let foodExists = false
let foodX = 0
let foodY = 0
let path = []
let speed = 5

function drawBoard(){
    ctx.fillStyle = "grey"
    for(let i = 0; i < boardwidth; i+=tileHeight*2){
        for(let j = 0; j < boardheight; j+=tileHeight*2){
            ctx.fillRect(i, j, tileHeight, tileHeight)
        }
    }

    for(let i = tileHeight; i < boardwidth; i+=tileHeight*2){
        for(let j = tileHeight; j < boardheight; j+=tileHeight*2){
            ctx.fillRect(i, j, tileHeight, tileHeight)
        }
    }


    ctx.fillStyle = "white"
    for(let i = tileHeight; i < boardwidth; i+=tileHeight*2){
        for(let j = 0; j < boardheight; j+=tileHeight*2){
            ctx.fillRect(i, j, tileHeight, tileHeight)
        }
    }

    for(let i = 0; i < boardwidth; i+=tileHeight*2){
        for(let j = tileHeight; j < boardheight; j+=tileHeight*2){
            ctx.fillRect(i, j, tileHeight, tileHeight)
        }
    }
}

function resetGame(){
    direction = "ArrowUp"
    x = 200
    y = 200
    bodylength = 0
    foodExists = false
    foodX = 0
    foodY = 0
    path = []
    queued = "ArrowUp"

    retry.style.display = "none";

    requestAnimationFrame(gameLoop)

}

window.addEventListener("keydown", (event) => {
    if((direction == "ArrowUp" || direction == "ArrowDown") && (event.key == "ArrowUp" || event.key == "ArrowDown")){
        return
    }
    if((direction == "ArrowLeft" || direction == "ArrowRight") && (event.key == "ArrowLeft" || event.key == "ArrowRight")){
        return
    }
    queued = event.key
})

retryBtn.addEventListener("click", () => {
    resetGame()
})

function changePath(){
    path.unshift({"x": x, "y": y})
    if(bodylength < path.length){
        path.pop()
    }
}

function drawPath(){
    path.forEach((posObj) => {
        ctx.fillRect(posObj.x, posObj.y, tileHeight, tileHeight)
    })
}

function isColliding(rect1, rect2){
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function createFood(){
    if(foodExists){
        ctx.fillRect(foodX, foodY, tileHeight*0.4, tileHeight*0.4)
        return
    }

    let randomx = Math.floor(Math.random() * ((boardwidth/tileHeight)-1)) + 1;
    let randomy = Math.floor(Math.random() * ((boardheight/tileHeight)-1)) + 1;

    foodX = (randomx * tileHeight) + (tileHeight*0.3)
    foodY = (randomy * tileHeight) + (tileHeight*0.3)

    foodExists = true
    ctx.fillRect(foodX, foodY, tileHeight*0.4, tileHeight*0.4)

}

function consumeFood(){
    let collision = false
    if(isColliding({"x": x, "y": y, "width": tileHeight, "height": tileHeight}, {"x": foodX, "y": foodY, "width": tileHeight*0.4, "height": tileHeight*0.4})){
        collision = true
    }

    path.forEach((posObj) => {
        if(isColliding({"x": posObj.x, "y": posObj.y, "width": tileHeight, "height": tileHeight}, {"x": foodX, "y": foodY, "width": tileHeight*0.4, "height": tileHeight*0.4})){
            collision = true
        }
    })

    if(collision){
        foodExists = false
        bodylength += tileHeight/speed
    }
}

function move(){
    if(
        ((direction == "ArrowUp" || direction == "ArrowDown") && y%tileHeight == 0) || 
        ((direction == "ArrowLeft" || direction == "ArrowRight") && x%tileHeight == 0)){
        direction = queued
    }

    switch(direction){
        case "ArrowUp":
            y -= speed
            break
        case "ArrowDown":
            y += speed
            break
        case "ArrowLeft":
            x -= speed
            break
        case "ArrowRight":
            x += speed
            break
    }
}

function isDead(){
    let dead = false
    let face = {}
    switch(direction){
        case "ArrowUp":
            face = {"x": x, "y": y, "width": tileHeight, "height": tileHeight*0.1}
            break
        case "ArrowDown":
            face = {"x": x, "y": y+(tileHeight*0.9), "width": tileHeight, "height": tileHeight*0.1}
            break
        case "ArrowLeft":
            face = {"x": x, "y": y, "width": tileHeight*0.1, "height": tileHeight}
            break
        case "ArrowRight":
            face = {"x": x+(tileHeight*0.9), "y": y, "width": tileHeight*0.1, "height": tileHeight}
            break
    }

    if(x < 0 || y < 0 || x + tileHeight > boardwidth || y + tileHeight > boardheight){
        return true
    }

    path.forEach((posObj, index) => {
        if(isColliding({"x": posObj.x, "y": posObj.y, "width": tileHeight, "height": tileHeight}, face)){
            dead = true
        }
    })

    return dead

}


function gameLoop(){
    ctx.clearRect(0, 0, boardwidth, boardheight)
    drawBoard()
    ctx.fillStyle = "red"
    changePath()
    drawPath()
    move()
    ctx.fillRect(x, y, tileHeight, tileHeight)
    consumeFood()
    createFood()
    if(!isDead()){
        requestAnimationFrame(gameLoop)
    }else{
        retry.style.display = "flex"
    }
}

canvas.width = boardwidth
canvas.height = boardheight
gameLoop()

