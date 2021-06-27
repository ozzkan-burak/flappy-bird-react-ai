import React, { Component } from "react";
import './App.css';

const HEIGHT = 500;
const WIDTH = 800;
const PIPE_WIDTH = 80;
const MIN_PIPE_HEIGHT = 40;
const FPS = 120;

class Pipe {
  constructor(ctx,height, space) {
    this.ctx = ctx
    this.x = WIDTH;
    this.y = height ? HEIGHT - height : 0;
    this.width = PIPE_WIDTH;
    this.height = height || MIN_PIPE_HEIGHT + Math.random() * (HEIGHT - space - MIN_PIPE_HEIGHT * 2);
  };

  draw(){
    const space = 80;
    
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    //this.ctx.fillRect(WIDTH, firstPipeHeight + space, PIPE_WIDTH, secondPipeHeight);
  }

  update = () => {
    this.x -= 1;
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.frameCount = 0;
    this.space = 80;
  }

  componentDidMount() {
    this.pipes = this.generatePipes();
    setInterval(this.gameLoop, 1000 / FPS);
  };

  generatePipes = () => {
    const ctx = this.canvasRef.current.getContext('2d');
    const firstPipe = new Pipe(ctx, null, 80);
    const secondPipeHeight = HEIGHT - firstPipe.height - this.space;
    const secondPipe = new Pipe(ctx, secondPipeHeight, 80);

    return [firstPipe, secondPipe];
  }

  gameLoop = () => {
    this.update();
    this.draw()
  }

  update =() => {
    this.frameCount = this.frameCount + 1;
    if(this.frameCount % 240 === 0){
      const pipes = this.generatePipes();
      this.pipes.push(...pipes)
    }

    this.pipes.map(pipe => pipe.update());
  }

  draw = () => {
    const ctx = this.canvasRef.current.getContext('2d');
    ctx.clearRect(0,0, WIDTH, HEIGHT)
    this.pipes.map(pipe => pipe.draw())
  }

  render() {
    return (
      <div className="App">
        <canvas id="canvas" ref={this.canvasRef} width={WIDTH} height={HEIGHT}
          style={{ marginTop: '24px', border: '1px solid #c3c3c3' }}
        >

        </canvas>
      </div>
    );
  };
}

export default App;
