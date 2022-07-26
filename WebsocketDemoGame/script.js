window.onload = () => {
  // Join the websocket session
  const socket = io('http://localhost:3000');

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;
  canvas.height = 600;
  canvas.width = 600;

  // Handle keyboard inputs
  class InputHandler {
    // keys: never[];
    constructor(game) {
      this.game = game;
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

  class Vector {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.maxSpeed = 5;
    }
    update(x, y) {
      if (this.x > this.maxSpeed) this.x = this.maxSpeed;
      if (this.y > this.maxSpeed) this.y = this.maxSpeed;
      this.x += x;
      this.y += y;
    }
    stop() {
      this.x = 0;
      this.y = 0;
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
      this.radius = 10;
      this.x = this.gameWidth / randomInteger(0, 2);
      this.y = this.gameHeight / randomInteger(0, 2);
      this.direction = new Vector(0, 0);
      this.speed = 1;
      this.maxSpeed = 15;
    }
    draw(context) {
      context.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.stroke();
      // When drawing the player context, relay coordinates to server
      const data = {
        x: this.x,
        y: this.y,
        radius: this.radius,
      };
      socket.emit('start', data);
    }
    update() {
      // Keyboard input
      if (this.game.keys.indexOf('ArrowRight') > -1) {
        this.direction.update(this.speed, 0);
        // console.log('DirectionX: ', this.direction.x);
        if (this.x > this.maxSpeed) return (this.x += this.maxSpeed);
        this.x += this.direction.x;
      }
      if (this.game.keys.indexOf('ArrowLeft') > -1) {
        this.direction.update(-this.speed, 0);
        // console.log('DirectionX: ', this.direction.x);
        if (Math.abs(this.x) > this.maxSpeed) return (this.x += -this.maxSpeed);
        this.x += this.direction.x;
      }
      if (this.game.keys.indexOf('ArrowUp') > -1) {
        this.direction.update(0, -this.speed);
        // console.log('DirectionY: ', this.direction.y);
        if (Math.abs(this.y) > this.maxSpeed) return (this.y += -this.maxSpeed);
        this.y += this.direction.y;
      }
      if (this.game.keys.indexOf('ArrowDown') > -1) {
        this.direction.update(0, this.speed);
        // console.log('DirectionY: ', this.direction.y);
        if (this.y > this.maxSpeed) return (this.y += this.maxSpeed);
        this.y += this.direction.y;
      }
      // If player moves out of bounds - portal to oppposite side of canvas
      if (this.x > this.gameWidth - this.radius) {
        this.x = 0 + this.radius;
      }
      if (this.x < 0 + this.radius) {
        this.x = this.gameWidth - this.radius;
      }
      if (this.y > this.gameHeight - this.radius) {
        this.y = 0 + this.radius;
      }
      if (this.y < 0 + this.radius) {
        this.y = this.gameHeight - this.radius;
      }
      if (this.game.keys.length < 1) {
        this.direction.stop();
      }
      // else if (this.game.keys.indexOf('ArrowLeft') > -1) {
      //   this.speed = -5;
      // } else if (
      //   this.game.keys.indexOf('ArrowUp') > -1 ||
      //   this.game.keys.indexOf(' ') > -1
      // ) {
      //   this.vy -= 30;
      // } else {
      //   this.speed = 0;
      // }
      // HORIZONTAL MOVEMENT
      // this.x += this.speed;
      // [DEBUG]]
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
      this.players = [
        new Player(this),
        new Player(this),
        new Player(this),
        new Player(this),
      ];
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
      this.players.forEach((player) => {
        player.update(deltaTime);
      });
    }
    // Order of rendering the draw method for each class instance matters
    // IE - first layer is the background.
    draw(context) {
      this.players.forEach((player) => {
        player.draw(context);
      });
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

  let button = document.getElementById('addPlayerButton');
  button.addEventListener('click', () => {
    console.log('ADDING PLAYER');
    game?.players.push(new Player(game));
  });

  // Utility method
  function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};
