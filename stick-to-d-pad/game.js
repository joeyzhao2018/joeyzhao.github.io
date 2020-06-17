// Frank Poth 08/04/2017

const display = document.getElementById("display").getContext("2d")
const message = document.querySelector("p")

display.canvas.height = 300
display.canvas.width = 400

display.fillStyle = "#008000"
display.fillRect(0, 0, 400, 300)

display.strokeStyle = "#ffffff"
display.lineJoin = "round"
display.lineWidth = 4

var stickCenterX=100
var stickCenterY=150
var currentStickX=stickCenterX
var currentStickY=stickCenterY
var limitRadius=40
var mouseOnStick= false



var lastRenderTime = 0 

function drawStickBackground(){
    display.fillStyle = "#2222FF"
    display.beginPath()
    display.arc(stickCenterX, stickCenterY, 40, 0, Math.PI*2)
    display.fill()
    display.stroke()
}

function drawInnerStick(x, y){
    display.fillStyle = "#ff0000";
    display.beginPath()
    display.arc(x, y, 20, 0, Math.PI*2)
    display.fill()
    display.stroke()
}


window.addEventListener('mousedown', function(e){
    const dx=e.layerX-currentStickX
    const dy=e.layerY-currentStickY
    if(dx*dx+dy*dy<400){
        mouseOnStick=true
        currentStickX=e.layerX
        currentStickY=e.layerY
    }
})
window.addEventListener('mouseup', function(e){
    mouseOnStick=false
    currentStickX=stickCenterX
    currentStickY=stickCenterY
})

function moveStick(x, y){
    const dx=x-stickCenterX
    const dy=y-stickCenterY
    const norm =dx*dx+dy*dy
    if ( norm > 400){
        let shrinkFactor=Math.sqrt(400/norm)
        x=stickCenterX+dx*shrinkFactor
        y=stickCenterY+dy*shrinkFactor
    }
    currentStickX=x
    currentStickY=y
}

window.addEventListener('mousemove', function(e){
    if(mouseOnStick)moveStick(e.layerX, e.layerY);
})


function drawDPadFrame(){
    display.fillStyle = "yellow";
    display.beginPath()
    display.moveTo(270,140)
    display.lineTo(290,140)
    display.lineTo(290,120)
    display.lineTo(310,120)
    display.lineTo(310,140)
    display.lineTo(330,140)
    display.lineTo(330,160)
    display.lineTo(310,160)
    display.lineTo(310,180)
    display.lineTo(290,180)
    display.lineTo(290,160)
    display.lineTo(270,160)
    display.lineTo(270,140)
    display.closePath()
    display.fill()
    display.stroke()
}

function lightUp(x, y){
    display.lineWidth = 0
    display.fillStyle = "#ff2222";
    display.beginPath()
    display.moveTo(x,y)
    display.lineTo(x+20,y)
    display.lineTo(x+20,y+20)
    display.lineTo(x,y+20)
    display.lineTo(x,y)
    display.closePath()
    display.fill()
    display.stroke()
}


const lightUpRef={
    up:[290,120],
    left:[270,140],
    down:[290,160],
    right:[310,140],
    nodirection:[]
}
var currentDpad='nodirection';

function convertStickToUpdateDpad(){
    let ux = currentStickX-stickCenterX
    let uy = currentStickY-stickCenterY
    if (ux==0 && uy==0) {currentDpad='nodirection';return}
    let cross_product_1=ux-uy 
    let cross_product_2=ux+uy 
    if (cross_product_1>0 && cross_product_2>0) {currentDpad='right';return;}
    if (cross_product_1>0 && cross_product_2<0) {currentDpad='up';return;}
    if (cross_product_1<0 && cross_product_2>0) {currentDpad='down';return;}
    if (cross_product_1<0 && cross_product_2<0) {currentDpad='left';return;}

}

function showMessage(){
    message.innerHTML=" Stick's input: (" + (currentStickX-stickCenterX) +" , "+ (currentStickY-stickCenterY) +")<br>"+" this maps to: <br> D-pad input :"+currentDpad 
}

function main(currentTime){
    window.requestAnimationFrame(main)
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
    drawStickBackground()
    drawInnerStick(currentStickX, currentStickY)
    drawDPadFrame()
    convertStickToUpdateDpad()
    lightUp(...lightUpRef[currentDpad])
    showMessage()
}

window.requestAnimationFrame(main)