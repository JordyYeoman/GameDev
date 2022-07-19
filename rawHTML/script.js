window.addEventListener("load", function () {
  // canvas setup
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 1500;
  canvas.height = 500;

  class InputHandler {
    constructor(game) {
      this.game = game;
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "ArrowUp" || e.key === "ArrowDown") &&
          // Check if keycode is not already in the array
          this.game.keys.indexOf(e.key) === -1
        ) {
          this.game.keys.push(e.key);
          return;
        }
        // space
        if (e.key === " ") {
          this.game.player.shootTop();
          return;
        }
        // 'R' key - reload
        if (e.key === "r") {
          this.game.player.reload();
        }
      });
      window.addEventListener("keyup", (e) => {
        if (this.game.keys.indexOf(e.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
      });
    }
  }

  class Projectile {
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      this.width = 10;
      this.height = 3;
      this.speed = 3;
      this.markedForDeletion = false;
    }
    update() {
      this.x += this.speed;
      if (this.x > this.game.width - 5) {
        this.markedForDeletion = true;
      }
    }
    draw(context) {
      context.fillStyle = "yellow";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Player {
    constructor(game) {
      this.game = game;
      this.width = 50;
      this.height = 80;
      this.x = 20;
      this.y = 100;
      this.speedY = 0.2;
      this.maxSpeed = 2;
      this.projectiles = [];
    }

    update() {
      if (this.game.keys.includes("ArrowUp")) this.speedY = -this.maxSpeed;
      if (this.game.keys.includes("ArrowDown")) this.speedY = this.maxSpeed;
      if (this.game.keys.length < 1) this.speedY = 0;
      this.y += this.speedY;
      // handle projectiles
      this.projectiles.forEach((projectile) => {
        projectile.update();
      });
      this.projectiles = this.projectiles.filter(
        (projectile) => !projectile.markedForDeletion
      );
    }

    draw(context) {
      context.fillStyle = "green";
      context.fillRect(this.x, this.y, this.width, this.height);
      this.projectiles.forEach((projectile) => {
        projectile.draw(context);
      });
    }
    reload() {
      if (this.game.ammo < 5) {
        this.game.ammo = this.game.reloadAmount;
      }
    }

    shootTop() {
      // Check if player still has ammo left
      if (this.game.ammo) {
        this.projectiles.push(
          new Projectile(this.game, this.x + this.width, this.y)
        );
        this.game.ammo--;
      }
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.x = this.game.width;
      this.speedX = Math.random() * -1.5 - 0.5;
      this.markedForDeletion = false;
      this.lives = 5;
      this.score = this.lives;
    }
    update() {
      this.x += this.speedX;
      if (this.x + this.width < 0) this.markedForDeletion = true;
    }
  }

  class Angler1 extends Enemy {
    constructor(game) {
      // Call the parent class constructor (Enemy)
      super(game);
      this.width = 28;
      this.height = 19;
      // Minus height of enemy to prevent it being drawn below the ground
      this.y = Math.random() * (this.game.height * 0.9 - this.height);
    }
    draw(context) {
      // Order of fill style matters
      context.fillStyle = "orange";
      context.fillRect(this.x, this.y, this.width, this.height);
      context.fillStyle = "black";
      context.font = "10px Helvetica";
      context.fillText(
        this.lives,
        this.x + this.width / 2 - 2,
        this.y + this.height / 2 + 4
      );
    }
  }

  // Layer handles logic for each game background layer object
  class Layer {
    constructor(game, image, speedModifier) {
      this.game = game;
      this.image = image;
      this.speedModifier = speedModifier;
      this.width = 1768;
      this.height = 500;
      this.x = 0;
      this.y = 0;
    }
    update() {
      if (this.x <= -this.width) this.x = 0;
      this.x -= this.game.speed * this.speedModifier;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y);
      context.drawImage(this.image, this.x + this.width, this.y);
    }
  }

  // Handle all layers to create game world
  class Background {
    constructor(game) {
      this.game = game;
      this.image1 = document.getElementById("layer1");
      this.image2 = document.getElementById("layer2");
      this.image3 = document.getElementById("layer3");
      this.image4 = document.getElementById("layer4");
      this.layer1 = new Layer(this.game, this.image1, 0.2);
      this.layer2 = new Layer(this.game, this.image2, 0.4);
      this.layer3 = new Layer(this.game, this.image3, 1);
      this.layer4 = new Layer(this.game, this.image4, 1.5);
      this.layers = [this.layer1, this.layer2, this.layer3];
    }
    update() {
      this.layers.forEach((layer) => layer.update());
    }
    draw(context) {
      this.layers.forEach((layer) => layer.draw(context));
    }
  }

  class UI {
    constructor(game) {
      this.game = game;
      this.fontSize = 16;
      this.fontFamily = "Helvetica";
      this.color = "white";
    }
    draw(context) {
      // Save context state to prevent shadows from being applied to all context elements
      context.save();
      // Score
      context.fillStyle = this.color;
      context.shadowOffsetX = 2;
      context.shadowOffsetY = 2;
      context.shadowColor = "black";
      context.font = this.fontSize + "px " + this.fontFamily;
      context.fillText("Score: " + this.game.score, 20, 40);
      // Loop through all ammo and display
      context.fillStyle = this.color;
      for (let a = 0; a < this.game.ammo; a++) {
        context.fillRect(20 + 5 * a, 50, 3, 20);
      }
      // Timer
      context.font = "12px Helvetica";
      const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
      context.fillText("Timer: " + formattedTime, 20, 90);
      // Show game over message
      if (this.game.gameOver) {
        context.textAlign = "center";
        let winningTitle;
        let subTitle;
        if (this.game.score > this.game.winningScore) {
          winningTitle = "You Win!";
          subTitle = "Awesome work homie!";
          console.log("gameScore: ", this.game.score);
          console.log("winningScore: ", this.game.winningScore);
        } else {
          winningTitle = "You Lose Sucka!";
          subTitle = "Try again scrublord!";
        }
        context.font = "50px " + this.fontFamily;
        context.fillText(
          winningTitle,
          this.game.width * 0.5,
          this.game.height * 0.5 - 40
        );
        context.font = "25px " + this.fontFamily;
        context.fillText(
          subTitle,
          this.game.width * 0.5,
          this.game.height * 0.5 + 40
        );
      }
      context.restore();
    }
  }

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      // Pass a reference 'this' to the entire game object
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);
      // Keeps track of all keys 'currently' pressed during the game instance
      this.keys = [];
      this.enemies = [];
      this.particles = [];
      this.explosions = [];
      this.enemyTimer = 0;
      this.enemyInterval = 2000;
      this.ammo = 20;
      this.maxAmmo = 50;
      this.ammoTimer = 0;
      this.ammoInterval = 350;
      this.gameOver = false;
      this.score = 0;
      this.winningScore = 50;
      this.gameTime = 0;
      this.timeLimit = 30000;
      this.speed = 1;
      this.debug = false;
    }
    update(deltaTime) {
      this.gameTime += deltaTime;
      this.background.update();
      this.background.layer4.update();
      this.player.update(deltaTime);
      if (this.ammoTimer > this.ammoInterval) {
        if (this.ammo < this.maxAmmo) this.ammo++;
        this.ammoTimer = 0;
      } else {
        this.ammoTimer += deltaTime;
      }
      // Generate enemies
      this.enemies.forEach((enemy) => {
        enemy.update();
        if (this.checkCollision(this.player, enemy)) {
          enemy.markedForDeletion = true;
        }
        this.player.projectiles.forEach((projectile) => {
          if (this.checkCollision(projectile, enemy)) {
            enemy.lives--;
            projectile.markedForDeletion = true;
            if (enemy.lives <= 0) {
              enemy.markedForDeletion = true;
              this.score += enemy.score;
              if (this.score > this.winningScore) {
                this.gameOver = true;
              }
            }
          }
        });
      });
      // Remove enemies that have been markedForDeletion
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
      // Spawn enemy if time interval is exceeded and game is not over
      if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
    }
    // Order of rendering the draw method for each class instance matters
    // IE - first layer is the background.
    draw(context) {
      this.background.draw(context);
      this.ui.draw(context);
      this.player.draw(context);
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
      this.background.layer4.draw(context);
    }
    addEnemy() {
      this.enemies.push(new Angler1(this));
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

  const game = new Game(canvas.width, canvas.height);
  // DELTA TIME - the difference in milliseconds between the timestamp from this loop
  // and timestamp from the previous loop
  let lastTime = 0;
  // Create the game loop
  const animate = (timeStamp) => {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(animate);
  };
  animate(0);
});
