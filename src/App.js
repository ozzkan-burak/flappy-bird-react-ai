import React, { Component } from "react";
import {NeuralNetwork} from "./neural/nn";
import './App.css';

const HEIGHT = 500;
const WIDTH = 800;
const PIPE_WIDTH = 60;
const MIN_PIPE_HEIGHT = 40;
const FPS = 120;

class Bird {

  constructor(ctx) {
    this.ctx = ctx;
    this.x = 100;
    this.y = 150;
    this.gravity = 0;
    this.velocity = 0.1;

    this.brain = new NeuralNetwork(2,5,1);
  };

  draw() {
    this.ctx.fillStyle = 'red';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 10, 0, Math.PI * 2, true);
    this.ctx.fill();
  };

  update = () => {
    this.gravity += this.velocity;
    this.gravity = Math.min(4, this.gravity);
    this.y += this.gravity;

    if(this.y < 0) {
      this.y = 0;
    } else if(this.y > HEIGHT) {
      this.y = HEIGHT
    }

    this.think();
  };

  think = () => {

    // inputs:
    // [bird.x, bird.y]
    // [closestPipe.x, pipe.y]
    // [closestPipe.x, pipe.y + pipe.height]

    const inputs = [
      this.x / WIDTH,
      this.y / HEIGHT,
    ];
    
    const output = this.brain.predict(inputs);
    

    console.log(output);
    if(output[0] < 0.5) {
      this.jump();
    }

  }

  jump = () => {
    this.gravity = -4;
  }

}

class Pipe {
  constructor(ctx, height, space) {
    this.ctx = ctx;
    this.isDead = false;
    this.x = WIDTH;
    this.y = height ? HEIGHT - height : 0;
    this.width = PIPE_WIDTH;
    this.height = height || MIN_PIPE_HEIGHT + Math.random() * (HEIGHT - space - MIN_PIPE_HEIGHT * 2);
  };

  draw() {
    const space = 80;

    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    //this.ctx.fillRect(WIDTH, firstPipeHeight + space, PIPE_WIDTH, secondPipeHeight);
  }

  update = () => {
    this.x -= 1;

    if ((this.x + PIPE_WIDTH) < 0) {
      this.isDead = true
    }

  }
}


class App extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.frameCount = 0;
    this.space = 120;
    this.pipes = [];
    this.birds = [];
  }

  componentDidMount() {
    // document.addEventListener('keydown', this.onKeyDown);
    const ctx = this.getCtx();
    this.pipes = this.generatePipes();
    this.birds = [new Bird(ctx)];
    this.lootTest = 'TEST'
    this.loop = setInterval(this.gameLoop, 1000 / FPS);
  };

  //USER ONY MODE
  // onKeyDown = (e) => {
  //   if (e.code === 'Space') {
  //     this.birds[0].jump()
  //   }
  // }

  getCtx = () => this.canvasRef.current.getContext('2d');

  generatePipes = () => {
    const ctx = this.getCtx()
    const firstPipe = new Pipe(ctx, null, 80);
    const secondPipeHeight = HEIGHT - firstPipe.height - this.space;
    const secondPipe = new Pipe(ctx, secondPipeHeight, 80);

    return [firstPipe, secondPipe];
  }

  gameLoop = () => {
    this.update();
    this.draw()
  }

  update = () => {
    this.frameCount = this.frameCount + 1;
    if (this.frameCount % 320 === 0) {
      const pipes = this.generatePipes();
      this.pipes.push(...pipes)
    }

    // update pipe positions
    this.pipes.map(pipe => pipe.update());
    this.pipes = this.pipes.filter(pipe => !pipe.isDead)

    // update bird positions
    this.birds.map(bird => bird.update());

    if(this.isGameOver()){
      // alert('game over')

      // clearInterval(this.loop);
    }
  }

  isGameOver = () => {
    let gameOver = false;
    this.birds.forEach((bird) => {
      this.pipes.forEach((pipe) => {      
      if (bird.y < 0 || bird.y > HEIGHT ||( bird.x > pipe.x && bird.x < pipe.x + pipe.width
          && bird.y > pipe.y && bird.y < pipe.y + pipe.height)) {
          gameOver = true
      };
    });
    });
    return gameOver
  };

  draw = () => {
    const ctx = this.getCtx();
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    this.pipes.map(pipe => pipe.draw());
    this.birds.map(bird => bird.draw())
  }

  render() {
    return (
      <div className="App">
        <canvas id="canvas" ref={this.canvasRef} width={WIDTH} height={HEIGHT}
          style={{ marginTop: '24px', border: '1px solid #c3c3c3' }}
        >

        </canvas>
        <div onClick={()=> this.setState({})}>
          {this.frameCount}
        </div>
      </div>
    );
  };
}

export default App;
