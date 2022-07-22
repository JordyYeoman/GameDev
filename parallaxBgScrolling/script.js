window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 800;

  class InputHandler {
    constructor() {
      this.keys = [];
      // Check if keypress is one of the arrow keys AND make sure the keypress isn't already being pressed.
      window.addEventListener("keydown", (e) => {
        if (
          e.key === "ArrowUp" ||
          e.key === "ArrowDown" ||
          e.key === "ArrrowLeft" ||
          (e.key === "ArrowRight" && this.keys.indexOf(e.key) === -1)
        ) {
          // IF the keypress is not already in the keys array, then we can add it.
          this.keys.push(e.key);
        }
      });
      window.addEventListener("keyup", (e) => {
        if (
          e.key === "ArrowUp" ||
          e.key === "ArrowDown" ||
          e.key === "ArrrowLeft" ||
          (e.key === "ArrowRight" && this.keys.indexOf(e.key) === -1)
        ) {
          // Remove the key that is currently being pressed from the array of keys.
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      });
    }
  }

  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameHeight = gameHeight;
      this.gameWidth = gameWidth;
      this.width = 200;
      this.height = 200;
      this.x = 0;
      this.y = this.gameHeight - this.height;
      this.image = document.getElementById("player.png");
      this.frameX = 0;
      this.frameY = 0;
      this.speed = 0;
      this.vy = 0;
      this.weight = 1;
    }
    draw(context) {
      context.fillStyle = "white";
      context.fillRect(this.x, this.y, this.width, this.height);
      context.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update(input) {
      // horizontal movement
      this.x += this.speed;
      if (input.keys.indexOf("ArrowRight") > -1) {
        this.speed = 5;
      } else if (input.keys.indexOf("ArrowLeft") > -1) {
        this.speed = -5;
      } else if (input.keys.indexOf("ArrowUp") > -1) {
        this.vy -= 30;
      } else {
        this.speed = 0;
      }
    }
  }

  const input = new InputHandler();
  const player = new Player(canvas.width, canvas.height);
  player.draw(ctx);
  player.update(input);
  // Game Loop
  function animateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    requestAnimationFrame(animateGame);
  }
  animateGame();
});
