function setup() {
  createCanvas(125, 125);
  pixelDensity(1);
}

function draw() {
  const alpha = 180;

  const beta = 125;

  const pixelModel = tf.sequential();

  const hidden1 = tf.layers.dense({
    units: 256,
    inputShape: [4],
    activation: 'tanh',
    kernelInitializer: tf.initializers.randomNormal({
      mean: 0,
      stddev: beta * (1 / 256),
    }),
  });

  const hidden2 = tf.layers.dense({
    units: 256,
    activation: 'tanh',
    kernelInitializer: tf.initializers.randomNormal({
      mean: 0,
      stddev: beta * (1 / 256),
    }),
  });

  const hidden3 = tf.layers.dense({
    units: 256,
    activation: 'tanh',
    kernelInitializer: tf.initializers.randomNormal({
      mean: 0,
      stddev: beta * (1 / 256),
    }),
  });

  const hidden4 = tf.layers.dense({
    units: 256,
    activation: 'tanh',
    kernelInitializer: tf.initializers.randomNormal({
      mean: 0,
      stddev: beta * (1 / 256),
    }),
  });

  const output = tf.layers.dense({
    units: 3,
    activation: 'tanh',
    kernelInitializer: tf.initializers.randomNormal({
      mean: 0,
      stddev: beta * (1 / 256),
    }),
  });

  pixelModel.add(hidden1);
  pixelModel.add(hidden2);
  pixelModel.add(hidden3);
  pixelModel.add(hidden4);
  pixelModel.add(output);

  /*   pixelModel.compile({
      optimizer: 'sgd',
      loss: 'meanSquaredError',
    }); */
  //pixelModel.summary();

  const makeInputs = (inputWidth, inputHeight) => {
    let coordinates = [];
    for (let i = 0; i < inputWidth; i++) {
      for (let j = 0; j < inputHeight; j++) {
        coordinates.push([i, j, alpha, Math.sqrt(i * i + j * j)])
      }
    }
    return coordinates;
  }

  const input = tf.tensor2d(
    makeInputs(width, height)
  )

  const outputs = pixelModel.predict(input);
  tf.print(outputs);



  let pixelValues;

  outputs.data().then(data => {
    const [min, max] = [Math.min(...data), Math.max(...data)];
    console.log(min, max);
    pixelValues = data.map((val, index) => {
      /*  console.log('nem mappelt', val)
       console.log(index, map(val, 0, 1, 0, 255)) */
      return map(val, -1, 1, 0, 255);
    });
    //console.log('Greyscale values',pixelValues);
    loadPixels();

    for (let i = 0; i < width * height; i += 1) {

      pixels[i * 4 + 0] = (pixelValues[i * 3 + 0]);
      pixels[i * 4 + 1] = (pixelValues[i * 3 + 1]);
      pixels[i * 4 + 2] = (pixelValues[i * 3 + 2]);
      pixels[i * 4 + 3] = 255;
    }
    updatePixels();
    console.log('done');
  });


  /*   background(51); */



  noLoop();
}