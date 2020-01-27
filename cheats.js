var cheatsVisible = false
var cheatSelected = 0

var invincible = false
var noclip = false


function centerText(text,height) {
    var size = ctx.measureText(text).width
    if (size < width) {
        ctx.fillText(text,(width * 0.5) - size * 0.5, height,width)
    } else {
        ctx.fillText(text,0, height,width)
    }
}


function renderCheatsMenu() {
    ctx.fillStyle = "#0f0"
    ctx.fillRect(106,106,300,300)
    ctx.clearRect(109,109,295,295)

    ctx.font = "20px monospace"
    centerText("CHEATS MENU",130)
    ctx.font = "15px monospace"
    ctx.fillText((invincible ? "* " : "  ") + "Invincibility", 125,145)
    ctx.fillText((diffOffset > 256 ? "* " : "  ") + "No Pipes", 125,165)
    ctx.fillText((noclip ? "* " : "  ") + "Portal Mode", 125,185)
    ctx.fillText((botEnabled ? "* " : "  ") + "Bot", 125,205)
    ctx.fillStyle = "#0f0"
    ctx.fillText(" Go back", 125,245)
    ctx.fillText(">",115,((cheatSelected == 4 ? 5 : cheatSelected)  * 20) + 145)
}

function checkCheats(key) {
    if (key == "c" && !cheatsVisible) {
        cancelAnimationFrame(animFrame)
        cheatsVisible = true
    } else if (cheatsVisible) {
        console.log()
        if (key == "ArrowUp") {
            cheatSelected -= 1
        }
        if (key == "ArrowDown") {
            cheatSelected += 1
        }
        if (key == "Enter") {
            if (cheatSelected == 0) {
                invincible = !invincible
            } else if (cheatSelected == 1) {
                diffOffset = diffOffset > 256 ? 50 : 512
                render()
                cancelAnimationFrame(animFrame)
            } else if (cheatSelected == 2) {
                noclip = !noclip
            } else if (cheatSelected == 3) {
                botEnabled = !botEnabled
            } else {
                cheatsVisible = false
                render()

            }
        }
        if (cheatSelected > 4) { cheatSelected = 0 }
        if (cheatSelected < 0) { cheatSelected = 4 }
    }
    if (cheatsVisible) {
        renderCheatsMenu()
    }
    
}