const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const width = canvas.width; const height = canvas.height

const preloaderSprites = [
    "img/bg_night.png","img/bg.png","img/base.png",
    "img/pipe-green.png","img/australian-pipe.png",
    "img/numbers/0.png","img/numbers/1.png","img/numbers/2.png","img/numbers/3.png","img/numbers/4.png","img/numbers/5.png","img/numbers/6.png","img/numbers/7.png","img/numbers/8.png","img/numbers/9.png",
    "img/gameover.png",
    "img/bird/frame1.png","img/bird/frame2.png","img/bird/frame3.png","img/bird/frame4.png",
    "img/bird_yellow/frame1.png","img/bird_yellow/frame2.png","img/bird_yellow/frame3.png","img/bird_yellow/frame4.png",
    "img/bird_red/frame1.png","img/bird_red/frame2.png","img/bird_red/frame3.png","img/bird_red/frame4.png",
]

var frame = 0

var loadedImages = {}

function loadAndGrabImage(url) {
    if (loadedImages[url]) {
        return loadedImages[url]
    } else {
        var image = document.createElement("img")
        image.src = url
        loadedImages[url] = image
        return image
    }
}

function resetGame() {
    gameState = {
        running: true,
        position: 200,
        x: 0,
        score: 0,
        pipes: [],
        momentum: 0,
        bgSprite: Math.random() < 0.75 ? "img/bg.png" : "img/bg_night.png",
        birdSpriteSet: "img/bird_yellow/",
    }    
    var rand = Math.random()
    if (rand > 0.5) {
        gameState.birdSpriteSet = "img/bird_red/"
    } 
    if (rand > 0.75) {
        gameState.birdSpriteSet = "img/bird/"
    } 
}

var gameState = {}

resetGame()

function botFrame() {
    if (!botEnabled) {return}
    
    var pipe = 0
    if (gameState.pipes[pipe][0] < gameState.x + 50) {
        pipe = 1
    }
    if (gameState.position > gameState.pipes[pipe][1] || gameState.position - gameState.momentum > 380 ) {
        tap()
    }
}
var botEnabled = false;

function tap(e) {
    if (gameState.running) {
        gameState.momentum = 50
        gameState.running = true
        document.querySelector("#wingSFX").play()
    } else {
        resetGame()
    }
    try { checkCheats(e.key) } catch(e) {console.error(e)}
}

function loseState() {
    if (!gameState.running || invincible) { return }
    document.querySelector("#hitSFX").play()
    var stored = (localStorage.getItem("flappyHighScore"))
    console.log(stored, gameState.score.toString())
    if (!stored || parseInt(stored) < gameState.score) {
        console.log("high score")
        localStorage.setItem("flappyHighScore", gameState.score.toString())   
    }
    gameState.running = false
}
var diffOffset = 50

function render() {
    frame += 1
    ctx.clearRect(0,0,width,height)

    // tile bg
    ctx.drawImage(loadAndGrabImage(gameState.bgSprite),-(gameState.x * 0.5) % 288,0)
    ctx.drawImage(loadAndGrabImage(gameState.bgSprite),(-(gameState.x * 0.5) % 288) + 285,0)
    ctx.drawImage(loadAndGrabImage(gameState.bgSprite),(-(gameState.x * 0.5) % 288) + 574,0)

    // create pipe every 100 frames
    if (gameState.x % 300 == 0) {
        gameState.pipes.push([gameState.x + width, Math.floor(Math.random() * 250) + 75])
    }
    // scoring
    if (gameState.x % 300 == 162) {
        gameState.score += 1
        document.querySelector("#pointSFX").play()
        console.log(gameState.score)
    }

    //remove past pipes
    while (gameState.pipes[0] && gameState.pipes[0][0] - gameState.x < -52) {
        gameState.pipes.shift()
    }

    // pipes
    for (var p of gameState.pipes) {
        ctx.drawImage(loadAndGrabImage(`img/pipe-green.png`),p[0] - gameState.x,p[1] + diffOffset)
        ctx.drawImage(loadAndGrabImage(`img/australian-pipe.png`),p[0] - gameState.x,p[1] - (diffOffset + 320))

        // collision
        //console.log(p[0] - gameState.x)
        if ((p[0] - gameState.x < 132 && p[0] - gameState.x > 55) && // x axis collision
            (
                (gameState.position > p[1] + diffOffset) || // upper x axis collision
                (gameState.position < p[1] - diffOffset)    // lower y axis collision
        ) && gameState.running)  {
            document.querySelector("#dieSFX").play()
            loseState()

        }
    }

    // tile flooring
    ctx.drawImage(loadAndGrabImage("img/base.png"),(-gameState.x % 336),400)
    ctx.drawImage(loadAndGrabImage("img/base.png"),(-gameState.x % 336) + 336,400)
    ctx.drawImage(loadAndGrabImage("img/base.png"),(-gameState.x % 336) + 672,400)

    // gravity
    gameState.momentum -= 2
    // move flappy up and down
    gameState.position -= Math.floor(gameState.momentum / 10)

    // move stage to the left
    if (gameState.running) {
        gameState.x += 3
    }
    // collisions
    if (gameState.position < 0 && !noclip) {
        gameState.position = 0
    } else if (gameState.position < 0) {
        gameState.position = 512
    }
    if (gameState.position > 376 && !noclip) {
        gameState.position = 376
        loseState()
    }
    if (gameState.position > 512) {
        gameState.position = -24
    }
    
    // draw flappy
    ctx.drawImage(loadAndGrabImage(gameState.birdSpriteSet + `frame${(Math.floor(gameState.x / 12) % 4) + 1}.png`),100,gameState.position)

    // game over text
    if (!gameState.running) {
        ctx.drawImage(loadAndGrabImage(`img/gameover.png`),width / 2 - (192 / 2),height / 2 - 41)
    }

    // score
    var str = gameState.score.toString().split("")
    var x = 0
    while (str.length > 0) {
        var i = str.shift()
        ctx.drawImage(loadAndGrabImage(`img/numbers/${i}.png`),x,0)
        if (i == "1") {
            x += 16
        } else {
            x += 24
        }
    }
    
    var str = (localStorage.flappyHighScore || 0).toString().split("")
    var x = 0
    while (str.length > 0) {
        var i = str.shift()
        ctx.drawImage(loadAndGrabImage(`img/numbers/${i}.png`),x,36)
        if (i == "1") {
            x += 16
        } else {
            x += 24
        }
    }

    // preloader
    var i = 0
    for (var sprite of preloaderSprites) {
        i += 24
        ctx.drawImage(loadAndGrabImage(sprite),width + i ,0)
    }


    animFrame = requestAnimationFrame(render)
}
var animFrame = requestAnimationFrame(render)

setInterval(botFrame,50)

window.onkeydown = tap
canvas.onclick = tap
