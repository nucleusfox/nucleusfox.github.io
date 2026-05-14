var canvas = document.getElementById("canvas_web_dots");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 2;
var width = canvas.width/3;
var width_com = canvas.width*2/3;
var height = canvas.height/2;

var ctx = canvas.getContext("2d");

var TAU = 2 * Math.PI;

let lastTime = 0;
const delay = 1; // 1000 ms = 1 second
let globalTime = 0; // for line fade-in/out

function loop(timestamp) {
  if (timestamp - lastTime >= delay) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    draw(globalTime);
    lastTime = timestamp;
  }

  requestAnimationFrame(loop);
}

// -------------------- Ball Constructor --------------------
function Ball (startX, startY, startVelX, startVelY, k, p) {
    this.x = startX * p + startY * k || Math.random() * width;
    this.y = startY || Math.random() * height;
    this.vx = startVelX; // || (Math.random() * 2 - 1);
    this.vy = startVelY; // || (Math.random() * 2 - 1);
    this.opacity = 0;
    this.targetOpacity = 0.4;
    // this.targetAlpha = 0.4;
  
    this.draw = function(ctx) {
      ctx.beginPath();
      ctx.globalAlpha = this.opacity; //0.4;
      ctx.fillStyle = '#448fda';
      ctx.arc((0.5 + this.x) | 0, (0.5 + this.y) | 0, 3, 0, TAU, false);
      ctx.fill();
    };
}

// -------------------- Ball Groups --------------------
var k, p;
var balls_right = [];
var balls_left_t = [];
var balls_left_b = [];
var balls_right_b_b = [];

function initBalls() {
    // let k, p;
  
    function initGroup(arr, count, xFn, yFn, k, p) {
      for (let i = 0; i < count; i++) {
        const x = xFn();
        const y = yFn();
        const vx = (Math.random() - 0.5) * 0.5;
        const vy = (Math.random() - 0.5) * 0.5;
        arr.push(new Ball(x, y, vx, vy, k, p));
      }
    }
  
    initGroup(
      balls_right,
      width * height / (65 * 65),
      () => Math.random() * width + width_com,
      () => Math.random() * height,
      3 / 5,
      1
    );
  
    initGroup(
      balls_left_t,
      width * height / (65 * 65 * 4),
      () => Math.random() * width,
      () => Math.random() * height / 3,
      -1,
      2 / 3
    );
  
    initGroup(
      balls_left_b,
      width * height / (65 * 65 * 20),
      () => Math.random() * width / 5,
      () => Math.random() * height / 5 + height * 9 / 10 + 10,
      1 / 5,
      -2
    );
  
    initGroup(
      balls_right_b_b,
      width * height / (65 * 65 * 5),
      () => Math.random() * width * 3 + 7 * width,
      () => Math.random() * height / 5 + height * 9 / 5,
      -1,
      2 / 3
    );
  }
  
function update() {
    const groups = [balls_right, balls_left_t, balls_left_b, balls_right_b_b];
    const speed = 0.5;  // pixels per frame
    const turnChance = 0; //0.0003;
    const maxSpeed = 2.0;
  
    for (const group of groups) {
      for (const b of group) {
        if (b.opacity < b.targetOpacity) {
            b.opacity += (b.targetOpacity - b.opacity) * 0.05;
        }

        // Occasionally change direction a little
        if (Math.random() < turnChance) {
          const angleChange = (Math.random() - 0.5) * 0.2; // radians
          const speedFactor = 0.95 + Math.random() * 0.1;
          const angle = Math.atan2(b.vy, b.vx) + angleChange;
          const newSpeed = Math.min(maxSpeed, Math.hypot(b.vx, b.vy) * speedFactor);
          b.vx = Math.cos(angle) * newSpeed;
          b.vy = Math.sin(angle) * newSpeed;
        }
  
        // Move position
        b.x += b.vx * speed;
        b.y += b.vy * speed;
  
        // Bounce softly off borders
        if (b.x < 0 || b.x > width) b.vx *= -1;
        if (b.y < 0 || b.y > height) b.vy *= -1;
        
      }
    }
}

// -------------------- Draw Balls and Lines --------------------
function draw(time) {
    ctx.globalAlpha=1;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,width, height);

    const groups = [balls_right, balls_left_t, balls_left_b, balls_right_b_b];
    const triangleDistance = 80;

    for (const group of groups) {
        for (let i = 0; i < group.length; i++) {
            const ball = group[i];
            ball.draw(ctx);
            ctx.beginPath();
            for (let j = group.length - 1; j > i; j--) {
                const ball2 = group[j];
                var dist = Math.hypot(ball.x - ball2.x, ball.y - ball2.y);
                if (dist < 100) {

                    // Time-based smooth fade-in/out for lines
                    ctx.strokeStyle = "#448fda";
                    const alphaBase = 0.2;  // minimum alpha
                    const alphaAmp = 0.6;   // variation amplitude
                    ctx.globalAlpha = alphaBase + alphaAmp * 0.5 * (1 + Math.sin(time + i + j));

                    ctx.lineWidth = "2px";
                    ctx.moveTo((0.5 + ball.x) | 0, (0.5 + ball.y) | 0);
                    ctx.lineTo((0.5 + ball2.x) | 0, (0.5 + ball2.y) | 0);
                }
            }
            ctx.stroke();
        }
        // Detect triangles
        for (let i = 0; i < group.length; i++) {
            for (let j = i + 1; j < group.length; j++) {
                for (let k = j + 1; k < group.length; k++) {
                    const a = group[i], b = group[j], c = group[k];
                    const d1 = Math.hypot(a.x - b.x, a.y - b.y);
                    const d2 = Math.hypot(b.x - c.x, b.y - c.y);
                    const d3 = Math.hypot(c.x - a.x, c.y - a.y);

                    if (d1 < triangleDistance && d2 < triangleDistance && d3 < triangleDistance) {
                        if (Math.random() < 1.0) {
                            ctx.beginPath();
                            ctx.moveTo(a.x, a.y);
                            ctx.lineTo(b.x, b.y);
                            ctx.lineTo(c.x, c.y);
                            ctx.closePath();
                            ctx.fillStyle = "rgba(68,143,218,0.2)"; // same color with slight alpha
                            ctx.fill();
                        }
                    }
                }
            }
        }
    }

    // for (var index = 0; index < balls_right.length; index++) {
    //     var ball = balls_right[index];
    //     ball.draw(ctx);
    //     ctx.beginPath();
    //     for (var index2 = balls_right.length - 1; index2 > index; index2 += -1) {
    //         var ball2 = balls_right[index2];
    //         var dist = Math.hypot(ball.x - ball2.x, ball.y - ball2.y);
    //         if (dist < 110) {
    //             ctx.strokeStyle = "#448fda";
    //             ctx.globalAlpha = 1 - (dist > 100 ? .8 : dist / 700 * (Math.random()*100));//150);
    //             ctx.lineWidth = "2px";
    //             ctx.moveTo((0.5 + ball.x) | 0, (0.5 + ball.y) | 0);
    //             ctx.lineTo((0.5 + ball2.x) | 0, (0.5 + ball2.y) | 0);
    //         }
    //     }
    //     ctx.stroke();
    // }

    // for (var index = 0; index < balls_left_t.length; index++) {
    //     var ball = balls_left_t[index];
    //     ball.draw(ctx);
    //     ctx.beginPath();
    //     for (var index2 = balls_left_t.length - 1; index2 > index; index2 += -1) {
    //         var ball2 = balls_left_t[index2];
    //         var dist = Math.hypot(ball.x - ball2.x, ball.y - ball2.y);
    //         if (dist < 120) {
    //             ctx.strokeStyle = "#448fda";
    //             ctx.globalAlpha = 1 - (dist > 100 ? .8 : dist / 600 * (Math.random()*50));
    //             ctx.lineWidth = "2px";
    //             ctx.moveTo((0.5 + ball.x) | 0, (0.5 + ball.y) | 0);
    //             ctx.lineTo((0.5 + ball2.x) | 0, (0.5 + ball2.y) | 0);
    //         }
    //     }
    //     ctx.stroke();
    // }

    // for (var index = 0; index < balls_left_b.length; index++) {
    //     var ball = balls_left_b[index];
    //     ball.draw(ctx);
    //     ctx.beginPath();
    //     for (var index2 = balls_left_b.length - 1; index2 > index; index2 += -1) {
    //         var ball2 = balls_left_b[index2];
    //         var dist = Math.hypot(ball.x - ball2.x, ball.y - ball2.y);
    //         if (dist < 120) {
    //             ctx.strokeStyle = "#448fda";
    //             ctx.globalAlpha = 1 - (dist > 100 ? .8 : dist / 100 * (Math.random()*100));
    //             ctx.lineWidth = "2px";
    //             ctx.moveTo((0.5 + ball.x) | 0, (0.5 + ball.y) | 0);
    //             ctx.lineTo((0.5 + ball2.x) | 0, (0.5 + ball2.y) | 0);
    //         }
    //     }
    //     ctx.stroke();
    // }

    // for (var index = 0; index < balls_right_b_b.length; index++) {
    //     var ball = balls_right_b_b[index];
    //     ball.draw(ctx);
    //     ctx.beginPath();
    //     for (var index2 = balls_right_b_b.length - 1; index2 > index; index2 += -1) {
    //         var ball2 = balls_right_b_b[index2];
    //         var dist = Math.hypot(ball.x - ball2.x, ball.y - ball2.y);
    //         if (dist < 130) {
    //             ctx.strokeStyle = "#448fda";
    //             ctx.globalAlpha = 1 - (dist > 100 ? .8 : dist / 100 * (Math.random()*100));
    //             ctx.lineWidth = "2px";
    //             ctx.moveTo((0.5 + ball.x) | 0, (0.5 + ball.y) | 0);
    //             ctx.lineTo((0.5 + ball2.x) | 0, (0.5 + ball2.y) | 0);
    //         }
    //     }
    //     ctx.stroke();
    // }
}


// -------------------- Initialize and Start --------------------
initBalls();
draw(globalTime);
requestAnimationFrame(loop);