window.onload = () => {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;
  canvas.height = 800;

  // Handle keyboard inputs
  class InputHandler {
    // keys: never[];
    constructor(game) {
      this.game = game;
      console.log(this.game);
      // Check if keypress is one of the arrow keys AND make sure the keypress isn't already being pressed.
      window.addEventListener('keydown', (e) => {
        if (
          (e.key === 'ArrowUp' ||
            e.key === 'ArrowDown' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight' ||
            e.key === ' ') &&
          this.game.keys.indexOf(e.key) === -1
        ) {
          // IF the keypress is NOT already in the keys array, then we can add it.
          this.game.keys.push(e.key);
        }
      });
      window.addEventListener('keyup', (e) => {
        if (
          e.key === 'ArrowUp' ||
          e.key === 'ArrowDown' ||
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight' ||
          e.key === ' '
        ) {
          // Remove the key that is currently being pressed from the array of keys.
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
      });
    }
  }

  // TODO - Scale image with height of character
  class Player {
    // gameHeight: any;
    // gameWidth: any;
    // width: number;
    // height: number;
    // x: number;
    // y: number;
    // image: HTMLElement | null;
    // frameX: number;
    // frameY: number;
    // speed: number;
    // vy: number;
    // weight: number;
    constructor(game) {
      this.game = game;
      this.gameHeight = game.height;
      this.gameWidth = game.width;
      this.width = 25;
      this.height = 23;
      this.x = 0;
      this.y = this.gameHeight - this.height;
      this.image = document.getElementById('player');
      this.frameX = 0;
      this.frameY = 0;
      this.speed = 0;
      this.vy = 0;
      this.weight = 1;
    }
    draw(context) {
      context.fillStyle = 'white';
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
    update() {
      // Keyboard input
      if (this.game.keys.indexOf('ArrowRight') > -1) {
        this.speed = 5;
      } else if (this.game.keys.indexOf('ArrowLeft') > -1) {
        this.speed = -5;
      } else if (
        (this.game.keys.indexOf('ArrowUp') > -1 ||
          this.game.keys.indexOf(' ') > -1) &&
        this.onGround()
      ) {
        this.vy -= 30;
      } else {
        this.speed = 0;
      }

      // HORIZONTAL MOVEMENT
      this.x += this.speed;
      if (this.x < 0) this.x = 0;
      // Stop character from moving off the screen on the negative X axis
      else if (this.x > this.gameWidth - this.width)
        this.x = this.gameWidth - this.width;

      // VERTICAL MOVEMENT
      this.y += this.vy;
      // If player is not on the ground, apply weight factor (basic gravity)
      if (!this.onGround()) {
        console.log('Not on ground');
        this.vy += this.weight;
      } else {
        this.vy = 0;
      }

      // Stop player from falling through the floor
      if (this.y > this.gameHeight - this.height) {
        this.y = this.gameHeight - this.height;
      }

      // [DEBUG]]
    }
    onGround() {
      return this.y >= this.gameHeight - this.height;
    }
  }

  class Game {
    width;
    height;
    player;
    input;
    keys;
    gameTime;
    timeLimit;
    speed;
    debug;
    constructor(width, height) {
      this.width = width;
      this.height = height;
      // This is the game class instance passed to each of the newly created classes below
      this.player = new Player(this);
      this.input = new InputHandler(this);
      // this.ui = new UI(this);
      this.keys = [];
      // TODO's
      // this.enemies = [];
      // this.particles = [];
      // this.explosions = [];
      // this.enemyTimer = 0;
      // this.enemyInterval = 2000;
      this.gameTime = 0;
      this.timeLimit = 30000;
      this.speed = 1;
      this.debug = false;
    }
    update(deltaTime) {
      this.gameTime += deltaTime;
      this.background.update();
      // this.background.layer4.update();
      this.player.update(deltaTime);
    }
    // Order of rendering the draw method for each class instance matters
    // IE - first layer is the background.
    draw(context) {
      this.background.draw(context);
      // this.ui.draw(context);
      this.player.draw(context);
      // this.background.layer4.draw(context);
    }
    // Rectangle object collision detection
    checkCollision(rect1, rect2) {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      );
    }
  }
  // Create new Game BOI!
  const game = new Game(canvas.width, canvas.height);
  // DELTA TIME - the difference in milliseconds between the timestamp from this loop
  // and timestamp from the previous loop
  let lastTime = 0;
  // Create the game loop
  const animateGame = (timeStamp) => {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.draw(ctx);
    game.update(deltaTime);
    requestAnimationFrame(animateGame);
  };
  animateGame(0);
};
