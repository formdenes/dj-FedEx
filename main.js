const w = 150;
const h = 150;
const scale = 2;


let alpha = 180;
let beta = 125;

const minAlpha = 0;
const maxAlpha = 5000;

const minBeta = -250;
const maxBeta = 250;

let outputNumber = 3;
let inputNumber = 4;

let currentShape = 'Random';

const inputs = (shape, x, y, alpha) => {
  switch (shape) {
    case 'Random':
      return [x, y, alpha, Math.sqrt(x * x + y * y)];
      break;
    case 'Circular':
      return [alpha, x, y, (x * x + y * y)];
      break;
    case 'Carpet':
      return [alpha, Math.cos(x), Math.sin(y)]
  }
}

let pixelModel = tf.sequential();

const createModel = () => {
  pixelModel = tf.sequential();

  const hidden1 = tf.layers.dense({

    units: maxBeta,
    inputShape: [inputNumber],

    activation: 'tanh',
    kernelInitializer: tf.initializers.randomNormal({
      mean: 0,
      stddev: beta * (1 / maxBeta),
    }),
  });

  const hidden2 = tf.layers.dense({
    units: maxBeta,

    activation: 'tanh',
    kernelInitializer: tf.initializers.randomNormal({
      mean: 0,
      stddev: beta * (1 / maxBeta),
    }),
  });


  const hidden3 = tf.layers.dense({
    units: maxBeta,

    activation: 'tanh',
    kernelInitializer: tf.initializers.randomNormal({
      mean: 0,
      stddev: beta * (1 / maxBeta),
    }),
  });

  const hidden4 = tf.layers.dense({
    units: maxBeta,
    activation: 'tanh',
    kernelInitializer: tf.initializers.randomNormal({
      mean: 0,
      stddev: beta * (1 / maxBeta),
    }),
  });

  const output = tf.layers.dense({
    units: outputNumber,
    activation: 'tanh',

    kernelInitializer: tf.initializers.randomNormal({
      mean: 0,
      stddev: beta * (1 / maxBeta),
    }),

  });

  pixelModel.add(hidden1);
  pixelModel.add(hidden2);
  pixelModel.add(hidden3);
  pixelModel.add(hidden4);
  pixelModel.add(output);
}

const makeInputs = (inputWidth, inputHeight, shape) => {
  let coordinates = [];
  for (let i = 0; i < inputWidth; i++) {
    for (let j = 0; j < inputHeight; j++) {
      coordinates.push(inputs(currentShape, i, j, alpha))
    }
  }
  return coordinates;
}

const getOutput = () => {
  tf.tidy(() => {
    pixelValues = [];
    createModel();
    const input = tf.tensor2d(makeInputs(w, h, currentShape))
    const outputs = pixelModel.predict(input);
    outputs.data().then(data => {
      const [min, max] = [Math.min(...data), Math.max(...data)];
      pixelValues = data.map((val, index) => {
        return map(val, -1, 1, 0, 255);
      });
      console.log('the memory useage',tf.memory());
    });
  });
}

let pixelValues = [];
let alphaLabel;
let betalLabel;
let alphaDiv;
let betaDiv;



function setup() {
  let header = createP('Neuro Images');
  header.addClass('header');
  createCanvas(w*scale, h*scale);
  bwCheckbox = createCheckbox('B&W', false);
  bwCheckbox.addClass('checkbox');
  bwCheckbox.changed(() => {
    outputNumber = outputNumber === 3 ? 1 : 3;
    getOutput();
  })
  alphaDiv = createDiv();
  alphaDiv.addClass('sliderDiv');
  alphaLabel = createP(`A: ${alpha}`);
  alphaDiv.child(alphaLabel);
  alphaSlider = createSlider(minAlpha,maxAlpha,alpha);
  alphaDiv.child(alphaSlider);
  alphaSlider.changed(() => {
    alpha = alphaSlider.value();
    getOutput();
  });
  betaDiv = createDiv();
  betaDiv.addClass('sliderDiv');
  betaLabel = createP(`B: ${beta}`);
  betaDiv.child(betaLabel);
  betaSlider = createSlider(minBeta,maxBeta, beta);
  betaDiv.child(betaSlider);
  betaSlider.changed(() => {
    beta = betaSlider.value();
    getOutput();
  });
  shapeSelection = createSelect();
  shapeSelection.option('Random');
  shapeSelection.option('Circular');
  shapeSelection.option('Carpet');
  shapeSelection.changed(() => {
    inputNumber = shapeSelection.value() === 'Carpet' ? 3 : 4;
    currentShape = shapeSelection.value();
    getOutput();
  });
  pixelDensity(1/scale);

  getOutput();
  
}

function draw() {
  alphaLabel.html(`A: ${alpha}`);
  betaLabel.html(`B: ${beta}`);
  background(51);
  loadPixels();

  for (let i = 0; i < width * height; i += 1) {
    pixels[i * 4 + 0] = (pixelValues[i * outputNumber + 0 * Math.floor(outputNumber / 3)]);
    pixels[i * 4 + 1] = (pixelValues[i * outputNumber + 1 * Math.floor(outputNumber / 3)]);
    pixels[i * 4 + 2] = (pixelValues[i * outputNumber + 2 * Math.floor(outputNumber / 3)]);
    pixels[i * 4 + 3] = 255;
  }
  updatePixels();
  //  noLoop();
}