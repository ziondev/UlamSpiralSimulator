/**
* Simulator of Ulam Spiral with Sieve of Eratosthenes - by Glauber Magalhães | https://github.com/ziondev
* Project repo: https://github.com/ziondev
*/

config = {
  size: 6000,
  pointSize: 10,
  pointDistance: 0,
  primePointColor: "#333",
  pointColor: "#CCC",
  numberOneColor:"red",
  fitWindow: true
}

//Make ulam spiral fit the screen
if(config.fitWindow) {
  var largestSize = (document.body.clientWidth > document.body.clientHeight) ? document.body.clientWidth : document.body.clientHeight;
  config.size = Math.ceil((largestSize / (config.pointSize + config.pointDistance) )*(largestSize / (config.pointSize + config.pointDistance) ));
}

function drawUlamSpiral(natural_numbers) {
  for (var i=0; i<natural_numbers.length; i++) {
    var position = getXYFromUlamSpiralIndex(i);
    if(natural_numbers[i] !== 0) {
      drawPoint(position.x*(config.pointSize + config.pointDistance),position.y*(config.pointSize + config.pointDistance) ,config.primePointColor);
    }else{
      drawPoint(position.x*(config.pointSize + config.pointDistance),position.y*(config.pointSize + config.pointDistance),config.pointColor);
    }
  }

  // Number one is not prime, so highlight it!
  drawPoint(0,0,config.numberOneColor);
}

//I Thank Totty for this part of algorithm
var getXYFromUlamSpiralIndex = function(index){
  if(index === 0){
      return {x: 0, y: 0};
  }
  var i = 0;
  var area;
  var side;
  while(true){
    // i=1 => area=9
    // i=2 => area=25
    i++;
    side = i * 2 + 1;
    area = Math.pow(side, 2);
    // If is outside of this level
    if(index < area){
        break;
    }
  }
  // We are in the level i.
  var level = i;
  var sideCurrLevel = side;
  var areaCurrLevel = area;
  // we have to get the previous side because this is the
  // one we'll subtract from index.
  var prevLevel = level - 1;
  var sidePrevLevel = prevLevel * 2 + 1;
  var areaPrevLevel = Math.pow(sidePrevLevel, 2);
  // Add indexFix because is 0 based.
  var indexFix = 1;
  var currentIndexInLevel = index - areaPrevLevel;
  // 0: right
  // 1: bottom
  // 2: left
  // 3: top
  // Each side starts with 1 offset
  var sides = ['right', 'bottom', 'left', 'top']
  // -1 because of the offset
  var sideIndex = Math.floor((currentIndexInLevel) / (sideCurrLevel - 1));
  var sideName = sides[sideIndex];
  // -1 because of the offset
  var indexInSide = currentIndexInLevel - sideIndex * (sideCurrLevel - 1);
  var x, y;
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
}

function calculateSieve() {
  var natural_numbers = new Array();
  //Create index of numbers
  for(var i = 1; i <= config.size; i++) {
    natural_numbers.push(i);
  }
  //Remove multiples to get all primes: SIEVE
  for(var i = 2; i <= Math.ceil(Math.sqrt(config.size)); i++) {
    for(var j = i; j <= config.size; j+=i) {
      if(j != i) natural_numbers[j-1] = 0;
    }
  }

  drawUlamSpiral(natural_numbers);
}

function drawPoint(x_pos,y_pos,color) {
  var canvas = document.getElementById('ulam_spiral');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle=color;
    ctx.strokeStyle=color;
    ctx.fillRect(x_pos,y_pos,config.pointSize,config.pointSize);
    //ctx.strokeRect(x_pos,y_pos,config.pointSize,config.pointSize);
  }
}

function init() {
  //Make canvas be fullscreen
  canvas = document.getElementById("ulam_spiral");
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  //Center origin to the center of canvas
  var transX = canvas.width * 0.5,
  transY = canvas.height * 0.5;
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.translate(transX, transY);
  }

  calculateSieve();
}

init();