import React, { useRef, useEffect } from "react";

const Canvas = (props: any) => {
  const canvasRef = useRef(null);

  const keyPress = document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
      console.log("Space pressed");
    }
    if (e.code === "Enter") {
      console.log("Enter pressed");
    }
  });

  // Create a player class
  class Player {
    game: Game;
    width: number;
    height: number;
    x: number;
    y: number;
    speedY: number;
    isJumping: boolean;
    gravity: number;

    constructor(game: Game) {
      this.game = game;
      this.width = 8;
      this.height = 8;
      this.x = 20;
      this.y = 20;
      this.speedY = -0.01;
      this.isJumping = false;
      this.gravity = 1.5;
      // this.speedX = 0;
      // this.speedY = 0;
      // this.currentFrame = 0;
      // this.time = number;
      // this.gravity = 0.05;
      // this.gravitySpeed = 0;
    }
    update(keypress?: any) {
      if (keypress) {
        this.isJumping = true;
        this.y += 10;
      }
      if (this.y > this.game.height) {
        this.gravity = 0;
        this.speedY = 0;
        this.y = this.game.height - this.height;
        return;
      }
      this.y += this.speedY + this.gravity;
    }
    draw(context: any) {
      context.fillRect(this.x, this.y, this.width, this.height);
    }

    // jump method
    jump() {
      this.x += 1.2;
      this.y += -10;
    }
  }

  class Game {
    width: any;
    height: any;
    player: Player;
    constructor(width: any, height: any) {
      this.width = width;
      this.height = height;
      this.player = new Player(this);
    }

    update() {
      this.player.update();
    }

    draw(context: any) {
      this.player.draw(context);
    }
  }

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const game = new Game(canvas.width, canvas.height);
    let animationFrameId: number;
    //Our draw came here
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      game.update();
      game.draw(ctx);
      // Recursive function to call the render method when window is ready
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      style={{ width: "100%", height: 600, border: "1px solid blue" }}
      ref={canvasRef}
      {...props}
    />
  );
};

export default Canvas;
