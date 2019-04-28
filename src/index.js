import React, { Component } from 'react';
import { render } from 'react-dom';


class Spiral extends Component {
  state = {
    size: 6000,
    pointSize: 5,
    pointDistance: 0,
    primePointColor: "#000000",
    pointColor: "#ff9a36",
    numberOneColor:"#ff0000",
    fitWindow: true
  };

  naturalNumbers = [];

  componentDidUpdate() {
    this.naturalNumbers = [];
  }

  getCoordinatesFromIndex = (index) => {
    if(index === 0) {
      return {x: 0, y: 0};
    }
    let i = 0;
    let area;
    let side;
    while(true) {
      i++;
      side = (i * 2) + 1;
      area = Math.pow(side, 2);
      // If is outside of this level
      if(index < area){
        break;
      }
    }
    // We are in the level i.
    let level = i;
    let sideCurrLevel = side;
    // we have to get the previous side because this is the
    // one we'll subtract from index.
    let prevLevel = level - 1;
    let sidePrevLevel = (prevLevel * 2) + 1;
    let areaPrevLevel = Math.pow(sidePrevLevel, 2);
    let currentIndexInLevel = index - areaPrevLevel;
    // 0: right
    // 1: bottom
    // 2: left
    // 3: top
    // Each side starts with 1 offset
    let sides = ['right', 'bottom', 'left', 'top'];
    // -1 because of the offset
    let sideIndex = Math.floor((currentIndexInLevel) / (sideCurrLevel - 1));
    let sideName = sides[sideIndex];
    // -1 because of the offset
    let indexInSide = currentIndexInLevel - sideIndex * (sideCurrLevel - 1);
    let x = null;
    let y = null;
    // Vertical sides
    if(sideName === 'right'){
      x = level;
      // +1 because of the offset
      y = -Math.floor(sideCurrLevel / 2) + indexInSide + 1;
    }else if(sideName === 'left'){
      x = -level;
      // -1 because of the offset
      y = Math.floor(sideCurrLevel / 2) - indexInSide - 1;
    }
    else if(sideName === 'bottom'){
      // +1 because of the offset
      // *-1 because is inverse
      x = -(-Math.floor(sideCurrLevel / 2) + indexInSide + 1);
      y = level;
    }else if(sideName === 'top'){
      // -1 because of the offset
      // *-1 because is inverse
      x = -(Math.floor(sideCurrLevel / 2) - indexInSide - 1);
      y = -level;
    }
    return {x: x, y: y};
  };

  calculateSieve = () => {
    let size = null;
    //Make the spiral fit the screen
    if(this.state.fitWindow) {
      const largestSize = (window.innerWidth > window.innerHeight) ? window.innerWidth : window.innerHeight;
      size = Math.ceil((largestSize / (this.state.pointSize + this.state.pointDistance)) * (largestSize / (this.state.pointSize + this.state.pointDistance)))
    }

    this.naturalNumbers = [];
    //Create index of numbers
    for(let i = 1; i <= (size || this.state.size); i++) {
      this.naturalNumbers.push(i);
    }
    //Remove multiples to get all primes
    for(let i = 2; i <= Math.ceil(Math.sqrt(size || this.state.size)); i++) {
      for(let j = i; j <= (size || this.state.size); j+=i) {
        if(j !== i) this.naturalNumbers[j-1] = 0;
      }
    }
  };

  drawPoint = (context, x_pos, y_pos, color, pointSize) => {
    context.fillStyle = color;
    context.strokeStyle = color;
    context.fillRect(x_pos, y_pos, pointSize, pointSize);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      pointSize: parseInt(this.inputPointSize.value),
      pointDistance: parseInt(this.inputPointDistance.value),
      primePointColor: this.inputPrimePointColor.value,
      pointColor: this.inputPointColor.value,
      numberOneColor: this.inputNumberOneColor.value,
    });
  };

  handleDownloadImage = (event) => {
    console.log(event.target);
    event.target.href = document.getElementsByTagName("canvas")[0].toDataURL();
    event.target.download = 'ulamSpiral.png';
  };

  render() {
    this.calculateSieve();

    let canvas = document.getElementById('ulam_spiral');
    const context = canvas.getContext('2d');
    //Fit canvas to windows
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //Center origin into the middle of screen
    const transX = (canvas.width * 0.5) - this.state.pointSize;
    const transY = canvas.height * 0.5;
    context.translate(transX, transY);
    //Draw each point without saving them to memory
    this.naturalNumbers.map((object, i) => {
      const position = this.getCoordinatesFromIndex(i);
      const pointX = position.x * (this.state.pointSize + this.state.pointDistance);
      const pointY = position.y * (this.state.pointSize + this.state.pointDistance);
      const pointColor = (this.naturalNumbers[i] !== 0) ? this.state.primePointColor : this.state.pointColor;

      this.drawPoint(context, pointX, pointY, pointColor, this.state.pointSize);
    });
    this.drawPoint(context, 0, 0, this.state.numberOneColor, this.state.pointSize);

    return (
      <div>
        <form onSubmit={this.handleSubmit} className="spiral-states">
          <div className="form-group">
            <label htmlFor="point_size">Point Size</label>
            <input type="number"
               defaultValue={this.state.pointSize}
               min={1}
               ref={el => this.inputPointSize = el}
               className="form-control"
               id="point_size"
               required
            />
          </div>
          <div className="form-group">
            <label htmlFor="point_distance">Point Distance</label>
            <input type="number"
               defaultValue={this.state.pointDistance}
               min={0}
               ref={el => this.inputPointDistance = el}
               className="form-control"
               id="point_distance"
               required
            />
          </div>
          <div className="form-group">
            <label htmlFor="prime_color">Prime Color: </label>
            <input type="color"
               defaultValue={this.state.primePointColor}
               ref={el => this.inputPrimePointColor = el}
               id="prime_color"
               required
            />
          </div>
          <div className="form-group">
            <label htmlFor="point_color">Non-Prime Color: </label>
            <input type="color"
               defaultValue={this.state.pointColor}
               ref={el => this.inputPointColor = el}
               id="point_color"
               required
            />
          </div>
          <div className="form-group">
            <label htmlFor="number_one_color">Number One Color: </label>
            <input type="color"
               defaultValue={this.state.numberOneColor}
               ref={el => this.inputNumberOneColor = el}
               id="number_one_color"
               required
            />
          </div>
          <button className="btn btn-block btn-danger">
            <i className="fa fa-refresh" aria-hidden="true"></i> refresh
          </button>
          <a
            type="button"
            className="btn btn-block btn-success btn-fluid"
            onClick={(event) => this.handleDownloadImage(event)}
          >
            <i className="fa fa-download" aria-hidden="true"></i> download image
          </a>

          <hr/>
          <div className="repo">
            <a href="https://github.com/ziondev/UlamSpiralSimulator/issues" target="_blank">
              report bugs
            </a>
            &nbsp;&bull;&nbsp;
            <a href="https://github.com/ziondev/UlamSpiralSimulator" target="_blank">
              source code
            </a>
          </div>
          <hr/>
          <div className="credits">
            made with &hearts; by <a href="https://github.com/glaubermagal" target="_blank">glaubermagal</a>
          </div>
        </form>
      </div>
    );
  }
}

render(<Spiral />, document.getElementById('app'));