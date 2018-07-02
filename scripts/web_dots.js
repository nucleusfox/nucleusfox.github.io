var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 1.1;
var width = canvas.width/3;
var width_com = canvas.width*2/3;
var height = canvas.height;

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
var k;
for (var i = 0; i < width * height / (65*65); i++) {
    k = 3/5;
    balls_right.push(new Ball(Math.random() * width + width_com, Math.random() * height, 0, 0, k, 1));
}

var balls_left_t = [];
for (var i = 0; i < width * height / (65*65*4); i++) {
    k = -1;
    balls_left_t.push(new Ball(Math.random() * width, Math.random() * height/3, 0, 0, k, 2/3));
}

var balls_left_b = [];
for (var i = 0; i < width * height / (65*65*32); i++) {
    k = 1/5;
    balls_left_b.push(new Ball(Math.random() * width/5, Math.random() * height/5 + height*4/5, 0, 0, k, -2));
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
            if (dist < 100) {
                ctx.strokeStyle = "#448fda";
                ctx.globalAlpha = 1 - (dist > 100 ? .8 : dist / 150);
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
            if (dist < 100) {
                ctx.strokeStyle = "#448fda";
                ctx.globalAlpha = 1 - (dist > 100 ? .8 : dist / 150);
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
            if (dist < 100) {
                ctx.strokeStyle = "#448fda";
                ctx.globalAlpha = 1 - (dist > 100 ? .8 : dist / 150);
                ctx.lineWidth = "2px";
                ctx.moveTo((0.5 + ball.x) | 0, (0.5 + ball.y) | 0);
                ctx.lineTo((0.5 + ball2.x) | 0, (0.5 + ball2.y) | 0);
            }
        }
        ctx.stroke();
    }
}

draw();