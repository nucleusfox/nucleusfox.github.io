var canvas = document.getElementById("canvas_web_dots");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 2;
var width = canvas.width/3;
var width_com = canvas.width*2/3;
var height = canvas.height/2;

var ctx = canvas.getContext("2d");

var TAU = 2 * Math.PI;

// times = [];
// function loop() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     update();
//     draw();
//     requestAnimationFrame(loop);
// }

function Ball (startX, startY, startVelX, startVelY, k, p) {
    this.x = startX * p + startY * k || Math.random() * width;
    this.y = startY || Math.random() * height;
    this.vel = {
        x: startVelX || Math.random() * 2 - 1,
        y: startVelY || Math.random() * 2 - 1
    };

    this.draw = function(ctx) {
        ctx.beginPath();
        ctx.globalAlpha = .4;
        ctx.fillStyle = '#448fda';
        ctx.arc((0.5 + this.x) | 0, (0.5 + this.y) | 0, 3, 0, TAU, false);
        ctx.fill();
    }
}

var balls_right = [];
var k, p;
for (var i = 0; i < width * height / (65*65); i++) {
    k = 3/5;
    p = 1;
    balls_right.push(new Ball(Math.random() * width + width_com, Math.random() * height, 0, 0, k, p));
}

var balls_left_t = [];
for (var i = 0; i < width * height / (65*65*4); i++) {
    k = -1;
    p = 2/3;
    balls_left_t.push(new Ball(Math.random() * width, Math.random() * height/3, 0, 0, k, p));
}

var balls_left_b = [];
for (var i = 0; i < width * height / (65*65*20); i++) {
    k = 1/5;
    p = -2;
    balls_left_b.push(new Ball(Math.random() * width/5, Math.random() * height/5 + height*9/10 + 10, 0, 0, k, p));
}


var balls_right_b_b = [];
for (var i = 0; i < width * height / (65*65*5); i++) {
    k = -1;
    p = 2/3;
    balls_right_b_b.push(new Ball(Math.random() * width * 3 + 7 * width, Math.random() * height/5 + height*9/5, 0, 0, k, p));
}

function draw() {
    ctx.globalAlpha=1;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,width, height);
    for (var index = 0; index < balls_right.length; index++) {
        var ball = balls_right[index];
        ball.draw(ctx);
        ctx.beginPath();
        for (var index2 = balls_right.length - 1; index2 > index; index2 += -1) {
            var ball2 = balls_right[index2];
            var dist = Math.hypot(ball.x - ball2.x, ball.y - ball2.y);
            if (dist < 110) {
                ctx.strokeStyle = "#448fda";
                ctx.globalAlpha = 1 - (dist > 100 ? .8 : dist / 700 * (Math.random()*100));//150);
                ctx.lineWidth = "2px";
                ctx.moveTo((0.5 + ball.x) | 0, (0.5 + ball.y) | 0);
                ctx.lineTo((0.5 + ball2.x) | 0, (0.5 + ball2.y) | 0);
            }
        }
        ctx.stroke();
    }

    for (var index = 0; index < balls_left_t.length; index++) {
        var ball = balls_left_t[index];
        ball.draw(ctx);
        ctx.beginPath();
        for (var index2 = balls_left_t.length - 1; index2 > index; index2 += -1) {
            var ball2 = balls_left_t[index2];
            var dist = Math.hypot(ball.x - ball2.x, ball.y - ball2.y);
            if (dist < 120) {
                ctx.strokeStyle = "#448fda";
                ctx.globalAlpha = 1 - (dist > 100 ? .8 : dist / 600 * (Math.random()*50));
                ctx.lineWidth = "2px";
                ctx.moveTo((0.5 + ball.x) | 0, (0.5 + ball.y) | 0);
                ctx.lineTo((0.5 + ball2.x) | 0, (0.5 + ball2.y) | 0);
            }
        }
        ctx.stroke();
    }

    for (var index = 0; index < balls_left_b.length; index++) {
        var ball = balls_left_b[index];
        ball.draw(ctx);
        ctx.beginPath();
        for (var index2 = balls_left_b.length - 1; index2 > index; index2 += -1) {
            var ball2 = balls_left_b[index2];
            var dist = Math.hypot(ball.x - ball2.x, ball.y - ball2.y);
            if (dist < 120) {
                ctx.strokeStyle = "#448fda";
                ctx.globalAlpha = 1 - (dist > 100 ? .8 : dist / 100 * (Math.random()*100));
                ctx.lineWidth = "2px";
                ctx.moveTo((0.5 + ball.x) | 0, (0.5 + ball.y) | 0);
                ctx.lineTo((0.5 + ball2.x) | 0, (0.5 + ball2.y) | 0);
            }
        }
        ctx.stroke();
    }

    for (var index = 0; index < balls_right_b_b.length; index++) {
        var ball = balls_right_b_b[index];
        ball.draw(ctx);
        ctx.beginPath();
        for (var index2 = balls_right_b_b.length - 1; index2 > index; index2 += -1) {
            var ball2 = balls_right_b_b[index2];
            var dist = Math.hypot(ball.x - ball2.x, ball.y - ball2.y);
            if (dist < 130) {
                ctx.strokeStyle = "#448fda";
                ctx.globalAlpha = 1 - (dist > 100 ? .8 : dist / 100 * (Math.random()*100));
                ctx.lineWidth = "2px";
                ctx.moveTo((0.5 + ball.x) | 0, (0.5 + ball.y) | 0);
                ctx.lineTo((0.5 + ball2.x) | 0, (0.5 + ball2.y) | 0);
            }
        }
        ctx.stroke();
    }
}

draw();