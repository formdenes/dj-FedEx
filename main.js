const w = 100;
const h = 100;

let alpha = 180;

let beta = 125;

const minAlpha = 0;
const maxAlpha = 5000;

const minBeta = -250;
const maxBeta = 250;

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
    units: 3,
    activation: 'tanh',

    kernelInitializer: tf.initializers.randomNormal({
      mean: 0,
      stddev: beta * (1 / maxBeta),
    }),

  });

  pixelModel.add(hidden1);
  /* tf.print(hidden1.getWeights())
  console.log(hidden1.getWeights()) */
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
    createModel();
    const input = tf.tensor2d(makeInputs(w, h))
    const outputs = pixelModel.predict(input);
    //tf.print(outputs);
    outputs.data().then(data => {
      const [min, max] = [Math.min(...data), Math.max(...data)];
      console.log(min, max);
      pixelValues = data.map((val, index) => {
        /*  console.log('nem mappelt', val)
        console.log(index, map(val, 0, 1, 0, 255)) */
        return map(val, -1, 1, 0, 255);
      });
      console.log(pixelValues)
      console.log('the memory useage',tf.memory());
    });
  });
}

let pixelValues = [];



function setup() {
  createP('My realy beautifull drawing')
  createCanvas(w, h);
  alphaSlider = createSlider(minAlpha,maxAlpha,alpha);
  alphaSlider.changed(() => {
    alpha = alphaSlider.value();
    console.log('alpha',alpha);
    getOutput();
  });
  betaSlider = createSlider(minBeta,maxBeta, beta);
  betaSlider.changed(() => {
    beta = betaSlider.value();
    console.log('beta', beta)
    getOutput();
  })
  pixelDensity(1);

  getOutput();
  
}

function draw() {  
  //console.log('Greyscale values',pixelValues);
  background(51);
  loadPixels();

  for (let i = 0; i < width * height; i += 1) {

    pixels[i * 4 + 0] = (pixelValues[i * 3 + 0]);
    pixels[i * 4 + 1] = (pixelValues[i * 3 + 1]);
    pixels[i * 4 + 2] = (pixelValues[i * 3 + 2]);
    pixels[i * 4 + 3] = 255;
    //console.log(i);
  }
  updatePixels();
  //console.log('done');
  


//  noLoop();
}