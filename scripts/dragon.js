var canvas = document.getElementById("canvas_dragon");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var width = canvas.width;
var height = canvas.height;

var ctx = canvas.getContext("2d");


//--Rotation-Matrix---------------------------------------------------/
var L = [
    [0, 1],
    [-1, 0]
];
var R = [
    [0, -1],
    [1, 0]
];

var currentVector = [0, -1];

function rotateLeft() {
    var r = [];
    r[0] = L[0][0] * currentVector[0] + L[0][1] * currentVector[1];
    r[1] = L[1][0] * currentVector[0] + L[1][1] * currentVector[1];
    currentVector = r;
}

function rotateRight() {
    var r = [];
    r[0] = R[0][0] * currentVector[0] + R[0][1] * currentVector[1];
    r[1] = R[1][0] * currentVector[0] + R[1][1] * currentVector[1];
    currentVector = r;
}

//--Dragon-Generation---------------------------------------------------/
var dragon = [1];

function bend() {
    var newDragon = [];
    for (var i = 0; i < dragon.length; i++) {
        newDragon[i] = dragon[i];
    }
    newDragon[dragon.length] = 1;
    for (var i = 1; i <= dragon.length; i++) {
        newDragon[dragon.length+i] = dragon[dragon.length-i] == 1 ? 0 : 1;
    }

    dragon = newDragon;
    // var line = newDragon.length + "<br/>";
    // for (var i = 0; i < dragon.length; i++) {
    //     line += dragon[i];
    // }
    // document.getElementById("output").innerHTML = line;
}

//--Graphics------------------------------------------------------------/

var PALETTE = [
    '#7709A7',
    '#E2008A',
    '#EA030E',
    '#E25800',
    '#66CB6F',
    '#66CB6F',
    '#86CB6A',
    '#86CB6A',
    '#86CB6A',
    '#86CB6A',
    '#94DD0B',
    '#B6DD07',
    '#E25800',
    '#94DD0B',
    '#94DD0B',
    '#B6DD07',
    '#B6DD07',
    '#DDD00D',
    '#DDD00D',
    '#DDD00D',
    '#E25800',
    '#E2008A',
    '#7709A7'
];

var GENERATION = 14;
var BEND_STEP = 15;
var SIZE_COEFFICIENT = 2;
var SPEED = 10;
var startX = width*4/7;
var startY = height*4/7;
var currentX = startX;
var currentY = startY;
var shiftX = 0;
var shiftY = 0;
var TERMINATE = false;

function bear(G) {
    for (var i = 0; i < G; i++) {
        bend();
    }

    if (G > 9) if (SIZE_COEFFICIENT < 1.5) SIZE_COEFFICIENT = 1.5;
    if (G > 12) {
        if (SIZE_COEFFICIENT < 4) SIZE_COEFFICIENT = 4;
        shiftX -= width/4.5;
        shiftY -= height/20;
    }
    if (G > 14) {
        if (SIZE_COEFFICIENT < 3.5) SIZE_COEFFICIENT = 3.5;
        shiftX += width/2;
        shiftY += height*1.5;
    }
    if (G > 16) {
        shiftX += width;
        shiftY += height*2;
    }
    if (G > 17) if (SIZE_COEFFICIENT < 5) SIZE_COEFFICIENT = 5;

    currentX += shiftX;
    currentY += shiftY;
}

var index = 0;
var generation = 1;
var k;
var j;

function drawBend(i) {
    if (TERMINATE || dragon.length == 0) {
        terminate();
        return;
    }
    if (dragon[i] == 1) rotateLeft();
    else rotateRight();

    //Set color
    k = generation / PALETTE.length;
    j = index / k;
    if (generation < PALETTE.length*2) j = 5;
    if (j >= PALETTE.length) j = PALETTE.length-1;

    ctx.beginPath();
    ctx.strokeStyle = PALETTE[Math.ceil(j)];

    ctx.moveTo(currentX, currentY);
    ctx.lineTo(currentX + currentVector[0]*BEND_STEP/SIZE_COEFFICIENT,
        currentY + currentVector[1]*BEND_STEP/SIZE_COEFFICIENT);
    ctx.stroke();

    currentX = currentX + currentVector[0]*BEND_STEP/SIZE_COEFFICIENT;
    currentY = currentY + currentVector[1]*BEND_STEP/SIZE_COEFFICIENT;

    index++;
    if (index == generation) {
        generation *= 2;
        index = 0;
    }

    if(i < dragon.length){
        if (SPEED > 20) drawBend(++i);
        else setTimeout(function(){ drawBend(++i) }, 0.5);//20/SPEED);
        if(TERMINATE) {
            terminate();
            return;
        }
    }
}

function drawDragon () {
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.beginPath();
    ctx.strokeStyle = PALETTE[5];
    ctx.globalAlpha = 1;
    ctx.lineWidth = "2px";

    ctx.moveTo(currentX, currentY);
    ctx.lineTo(currentX + currentVector[0]*BEND_STEP/SIZE_COEFFICIENT,
        currentY + currentVector[1]*BEND_STEP/SIZE_COEFFICIENT);
    ctx.stroke();
    currentX = currentX + currentVector[0]*BEND_STEP/SIZE_COEFFICIENT;
    currentY = currentY + currentVector[1]*BEND_STEP/SIZE_COEFFICIENT;

    if (SPEED > 20) drawBend(0);
    else setTimeout(function(){ drawBend(0) }, 20/SPEED);
    if (TERMINATE) {
       terminate();
       return;
    }
}

//-Control--------------------------------------------------------------/

function terminate() {
    TERMINATE = true;
    while(dragon.length > 0) {
        dragon.pop();
    }
    // TERMINATE = false;
}

function redrawDragon() {
    // // Debug
    // var line = dragon.length + "<br/>";
    // for (var i = 0; i < dragon.length; i++) {
    //     line += dragon[i];
    // }
    // document.getElementById("output").innerHTML = line;

    if (dragon.length > 1) {
        terminate();
        TERMINATE = false;
    }

    startX = width*4/7;
    startY = height*3/7;
    currentX = startX;
    currentY = startY;
    currentVector = [0, -1];
    shiftX = 0;
    shiftY = 0;
    index = 0;
    generation = 1;

    if (TERMINATE) {
        while(dragon.length > 0)
            dragon.pop();
        TERMINATE = false;
    }

    dragon = [1];

    var form = document.getElementById('dragonParameters');
    GENERATION = form.elements.generation.value;
    SIZE_COEFFICIENT = form.elements.zoom.value;
    SPEED = form.elements.speed.value;

    canvas.width = window.innerWidth*SIZE_COEFFICIENT;
    canvas.height = window.innerHeight*SIZE_COEFFICIENT;

    draw();
}

function draw() {
    bear(GENERATION);
    drawDragon();
}

draw();