const startButton = document.querySelector("#start-button");
const intro = document.querySelector(".intro");

let elem = document.getElementById("gameScreen"),
  elemLeft = elem.offsetLeft,
  elemTop = elem.offsetTop,
  ctx = elem.getContext("2d"),
  elements = [];

const success = new Audio("./assets/success.mp3"); //from freesound.org
const soundLoop = new Audio("./assets/epic-orchestra-loop.mp3"); //from freesound.org
const canWidth = window.innerWidth,
  canHeight = window.innerHeight;
let score = document.querySelector(".score");
let points = 0;

// Add event listener for `click` events.
elem.addEventListener(
  "click",
  function (event) {
    let x = event.pageX - elemLeft,
      y = event.pageY - elemTop;
    console.log(`x: ${x} y:${y}`);
    elements.forEach(function (element) {
      if (
        //if mouseclick is inside element.
        y > element.top &&
        y < element.top + element.height &&
        x > element.left &&
        x < element.left + element.width
      ) {
        //change colour of element clicked.
        if (element.colour == "red") {
          element.colour = "green";
        } else if (element.colour == "green") {
          element.colour = "blue";
        } else element.colour = "red";
      }
    });
  },
  false
);

//random colour;
const colours = ["red", "green", "blue"];
function randomColour() {
  return colours[Math.floor(Math.random() * 3)];
}
//random speed between 2 values
function randomSpeed(min, max) {
  return Math.random() * (max - min) + min;
}

// coloured rectangle elements
elements.push({
  colour: "red",
  width: 400,
  height: 1000,
  top: 0,
  left: 0,
});
elements.push({
  colour: "green",
  width: 400,
  height: 1000,
  top: 0,
  left: 400,
});

elements.push({
  colour: "blue",
  width: 400,
  height: 1000,
  top: 0,
  left: 800,
});
let ballOne = new Ball(200, 20, 0, randomSpeed(1.5, 1.7), randomColour(), 60);
let ballTwo = new Ball(600, 20, 0, randomSpeed(1.5, 1.7), randomColour(), 60);
let ballThree = new Ball(
  1000,
  20,
  0,
  randomSpeed(1.5, 1.7),
  randomColour(),
  60
);
let cross1 = new Cross(200, 0, 0, randomSpeed(0.4, 0.5), randomColour(), 80);
obstacles = [ballOne, ballTwo, ballThree];

//Ball
function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}

Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.stroke();
};

Ball.prototype.update = function () {
  this.x += this.velX;
  this.y += this.velY;
};

//Cross
function Cross(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}
Cross.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.moveTo(this.x - 50, this.y);
  ctx.lineTo(this.x - 50 + 50, this.y + 50); //top middle
  ctx.lineTo(this.x - 50 + 100, this.y);
  ctx.lineTo(this.x - 50 + 125, this.y);
  ctx.lineTo(this.x - 50 + 70, this.y + 60); //right middle.
  ctx.lineTo(this.x - 50 + 125, this.y + 110);
  ctx.lineTo(this.x - 50 + 100, this.y + 110);
  ctx.lineTo(this.x - 50 + 50, this.y + 70); //bottom middle.
  ctx.lineTo(this.x - 50, this.y + 110);
  ctx.lineTo(this.x - 50 - 25, this.y + 110);
  ctx.lineTo(this.x - 50 + 30, this.y + 60); //left middle
  ctx.lineTo(this.x - 50 - 25, this.y);
  ctx.lineTo(this.x - 50, this.y);
  ctx.fill();
  ctx.stroke();
};

Cross.prototype.update = function () {
  this.x += this.velX;
  this.y += this.velY;
};

//TODO: Gamestates : menu, pause, gameover

function loop() {
  //background music
  soundLoop.play();
  soundLoop.volume = 0.2;
  //render elements
  elements.forEach(function (element) {
    ctx.fillStyle = element.colour;
    ctx.fillRect(element.left, element.top, element.width, element.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeRect(element.left, element.top, element.width, element.height);
  });
  //render balls

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].draw();
    obstacles[i].update();
  }

  //score
  score.innerHTML = `Score: ${points} `;

  let newBall = new Ball(200, 20, 0, 0.5, randomColour(), 60);

  let newCross = new Cross(0, 20, 0, 0.5, randomColour(), 90);

  elements.forEach(function (element) {
    for (let i = 0; i < obstacles.length; i++) {
      //checks if inside rectangle/canvas.
      if (
        obstacles[i].y > element.top &&
        obstacles[i].y < element.top + element.height &&
        obstacles[i].x > element.left &&
        obstacles[i].x < element.left + element.width
      ) {
        let threshold = Math.floor(obstacles[i].y + obstacles[i].size);
        if (
          //check if colours matching or not matching if a cross when reaching the bottom.
          (obstacles[i].color == element.colour &&
            threshold >= 915 &&
            !Cross.prototype.isPrototypeOf(obstacles[i])) ||
          (Cross.prototype.isPrototypeOf(obstacles[i]) &&
            obstacles[i].color != element.colour &&
            threshold >= 915)
        ) {
          newBall.x = obstacles[i].x;
          newBall.velY = obstacles[i].velY + randomSpeed(0.1, 0.3);
          newCross.x = obstacles[i].x;
          newCross.velY = obstacles[i].velY + randomSpeed(0.1, 0.3);
          obstacles.splice(i, 1);
          //spawns a Cross whenever points is on 5.
          if (points % 5 == 0 && points > 1) {
            obstacles.push(newCross);
          } else {
            obstacles.push(newBall);
          }
          points++;
          // sound effect for point
          success.currentTime = 0;
          success.play();
        }
        if (
          //lose conditions.
          (obstacles[i].color != element.colour && threshold > 920) ||
          (Cross.prototype.isPrototypeOf(obstacles[i]) &&
            obstacles[i].color == element.colour &&
            threshold > 920)
        ) {
          soundLoop.pause();
          soundLoop.currentTime = 0;
          alert(`You Lose. Your score is: ${points}!!
             please refresh the page`);
        }
      }
    }
  });

  requestAnimationFrame(loop);
}

//TODO: responsiveness? could be unnecessary
window.addEventListener("resize", () => {
  elemLeft = elem.offsetLeft;
  elemTop = elem.offsetTop;
});

//removes intro and starts the game loop.
startButton.addEventListener("click", () => {
  intro.style.visibility = "hidden";

  loop();
});
