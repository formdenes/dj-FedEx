const w = 150;
const h = 150;
const scale = 1;


let alpha = 180;
let beta = 125;

const minAlpha = 0;
const maxAlpha = 5000;

const minBeta = -250;
const maxBeta = 250;

let outputNumber = 3;

let pixelModel = tf.sequential();

const createModel = () => {
  pixelModel = tf.sequential();

  const hidden1 = tf.layers.dense({

    units: maxBeta,
    inputShape: [4],

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

const makeInputs = (inputWidth, inputHeight) => {
  let coordinates = [];
  for (let i = 0; i < inputWidth; i++) {
    for (let j = 0; j < inputHeight; j++) {
      coordinates.push([i, j, alpha, Math.sqrt(i * i + j * j)])

    }
  }
  return coordinates;
}

const getOutput = () => {
  tf.tidy(() => {
    pixelValues = [];
    createModel();
    const input = tf.tensor2d(makeInputs(w, h))
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



function setup() {
  createP('My realy beautifull drawing')
  createCanvas(w*scale, h*scale);
  bwCheckbox = createCheckbox('B&W', false);
  bwCheckbox.changed(() => {
    outputNumber = outputNumber === 3 ? 1 : 3;
    getOutput();
  })
  alphaSlider = createSlider(minAlpha,maxAlpha,alpha);
  alphaSlider.changed(() => {
    alpha = alphaSlider.value();
    getOutput();
  });
  betaSlider = createSlider(minBeta,maxBeta, beta);
  betaSlider.changed(() => {
    beta = betaSlider.value();
    getOutput();
  });
  shapeSelection = createSelect();
  shapeSelection.option('Random');
  shapeSelection.option('Circilar');
  shapeSelection.option('Carpet');
  shapeSelection.changed(() => {

  });
  pixelDensity(1/scale);

  getOutput();
  
}

function draw() {
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