window.onload = () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  // canvas.height = window.innerHeight;
  canvas.height = 800;

  // Handle keyboard inputs
  class InputHandler {
    // keys: never[];
    constructor(game) {
      this.game = game;
      // Check if keypress is one of the arrow keys AND make sure the keypress isn't already being pressed.
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "ArrowUp" ||
            e.key === "ArrowDown" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight" ||
            e.key === " ") &&
          this.game.keys.indexOf(e.key) === -1
        ) {
          // IF the keypress is NOT already in the keys array, then we can add it.
          this.game.keys.push(e.key);
        }
      });
      window.addEventListener("keyup", (e) => {
        if (
          e.key === "ArrowUp" ||
          e.key === "ArrowDown" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === " "
        ) {
          // Remove the key that is currently being pressed from the array of keys.
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
      });
    }
  }

  // Layer class handles the logic for each game background layer object
  class Layer {
    // game: any;
    // image: any;
    // speedModifier: any;
    // width: number;
    // height: number;
    // x: number;
    // y: number;
    constructor(game, image, speedModifier, imageWidth, imageHeight) {
      this.game = game;
      this.image = image;
      this.speedModifier = speedModifier;
      // TODO - Make responsive
      this.width = this.game.width;
      this.height = this.game.height;
      this.x = 0;
      this.y = 0;
      this.imageWidth = imageWidth;
      this.imageHeight = imageHeight;
    }
    update() {
      if (this.image?.id === "layer2") {
      }
      this.x += this.game.speed * this.speedModifier;
      if (this.x > this.imageWidth) this.x = 0;
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.x,
        this.y,
        this.imageWidth,
        this.imageHeight,
        0,
        0,
        this.width,
        this.height
      );
      context.drawImage(
        this.image,
        this.x - this.imageWidth,
        this.y,
        this.imageWidth,
        this.imageHeight,
        0,
        0,
        this.width,
        this.height
      );
    }
  }

  //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

  // Handle all layers to create game world
  // TODO - After a certain interval - switch to new background
  class Background {
    // game: any;
    // image1: HTMLElement | null;
    // image2: HTMLElement | null;
    // image3: HTMLElement | null;
    // image4: HTMLElement | null;
    // layer1: Layer;
    // layer2: Layer;
    // layer3: Layer;
    // layer4: Layer;
    // layers: any[];
    constructor(game) {
      this.game = game;
      this.image1 = document.getElementById("layer1");
      this.image2 = document.getElementById("layer2");
      this.image3 = document.getElementById("layer3");
      this.image4 = document.getElementById("layer4");
      this.image5 = document.getElementById("layer5");
      this.layer1 = new Layer(this.game, this.image1, 0, 384, 216);
      this.layer2 = new Layer(this.game, this.image2, 0.02, 384, 216);
      this.layer3 = new Layer(this.game, this.image3, 0.09, 384, 216);
      this.layer4 = new Layer(this.game, this.image4, 0.15, 384, 216);
      this.layer5 = new Layer(this.game, this.image5, 0.05, 384, 216);
      this.layers = [
        this.layer1,
        this.layer3,
        this.layer2,
        this.layer4,
        this.layer5,
      ];
    }
    update() {
      this.layers.forEach((layer) => layer.update());
    }
    draw(context) {
      this.layers.forEach((layer) => layer.draw(context));
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
      this.width = 24;
      this.height = 24 - 2;
      this.x = getRandomIntFromRange(0, 100);
      // Spawn player 100 pixels above floor when they are generated.
      this.y = this.gameHeight - this.height - this.gameHeight / 4;
      this.image = getRandomSkinFromAllSkins();
      this.frameX = 0;
      this.maxFrame = 10;
      this.fps = 10;
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.frameY = 0;
      this.speed = 0;
      this.vy = 0;
      this.weight = 1;
      // Testing animation states
      this.startFrame = 0;
      // TODO - Change animation direction 1 for right, -1 for left
      this.flipX = 1;
    }
    draw(context) {
      // Save context to apply flipX if necessary
      context.save();
      context.fillStyle = "transparent";
      context.scale(this.flipX, 1);
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
      context.restore();
    }
    update(deltaTime) {
      // ANIMATION
      // Sprite animation
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = this.startFrame;
        else this.frameX++;
        this.frameTimer = this.startFrame;
      } else {
        this.frameTimer += deltaTime;
      }

      // Restore flipX if left key not pressed
      this.flipX = 1;

      // CONTROLS
      // Keyboard input
      if (this.game.keys.indexOf("ArrowRight") > -1) {
        this.startFrame = 3;
        this.maxFrame = 8;
        this.speed = 1.5;
      } else if (this.game.keys.indexOf("ArrowLeft") > -1) {
        this.startFrame = 3;
        this.maxFrame = 8;
        this.speed = -1.5;
        this.flipX = -1;
      } else if (
        (this.game.keys.indexOf("ArrowUp") > -1 ||
          this.game.keys.indexOf(" ") > -1) &&
        this.onGround()
      ) {
        this.vy -= 30;
      } else {
        // When no keyboard input, play idle animation & stop movement
        this.startFrame = 0;
        this.maxFrame = 3;
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
    background;
    player;
    player2;
    players;
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
      this.background = new Background(this);
      this.players = [
        new Player(this),
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
      this.background.update();
      // this.background.layer4.update();
      // Loop over players and update
      this.players.forEach((player) => {
        player.update(deltaTime);
      });
    }
    // Order of rendering the draw method for each class instance matters
    // IE - first layer is the background.
    draw(context) {
      this.background.draw(context);
      // this.ui.draw(context);
      // this.background.layer4.draw(context);
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
};

// Helper methods
const getRandomIntFromRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const skinsArr = ["mort", "doux", "tard", "vita"];

const getRandomSkinFromAllSkins = (skins) => {
  let randomSkinInt = getRandomIntFromRange(0, 3);
  return document.getElementById(skinsArr[randomSkinInt]);
};

// 🤦 Facepalms 🤦
//  - 1. Make sure the image id you are referencing is acutally correct.
//  - 2. Check your math logic to see if prefilled data from Tabnine.
//        for eg, has not done something silly like this.gameHeight - this.gameHeight instead of this.gameHeight - this.height (player height). DOH!
//  - 3. Check following logic after expecting 'X' event to occur, you might be overwriting it in the following lines of code.
