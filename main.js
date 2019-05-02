function setup() {
  createCanvas(100, 100);
  pixelDensity(1);

}

function draw() {
  const alpha = 0.5;

  const beta = 1.3;

  const pixelModel = tf.sequential();

  const hidden1 = tf.layers.dense({
    units: 32,
    inputShape: [3],
    activation: 'tanh',
  });

  
    const hidden2 = tf.layers.dense({
    units: 32,
    activation: 'tanh',
  });
  
  
  const hidden3 = tf.layers.dense({
    units: 32,
    activation: 'tanh',
  });
  
  const output = tf.layers.dense({
    units: 3,
    activation: 'tanh',
  });
  
  pixelModel.add(hidden1);
  tf.print(hidden1.getWeights())
  console.log(hidden1.getWeights())
  pixelModel.add(hidden2);
  pixelModel.add(hidden3);
  pixelModel.add(output);

  //pixelModel.summary();

  const makeInputs = (width, height) => {
    let coordinates = [];
    for(let i = 0; i < width; i++){
      for(let j = 0; j < height; j++){
        coordinates.push([alpha,j,i,/*  Math.sqrt(i*i + j*j) */]);
      }
    }
    return coordinates;
  }

  const input = tf.tensor2d(
    makeInputs(width,height)
  )

const outputs = pixelModel.predict(input);
tf.print(outputs);

let pixelValues;

outputs.data().then(data => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  console.log('Min', min);
  console.log('Max', max);
  pixelValues = data.map((val, index) => {
    //console.log('nem mappelt', val)
    //console.log(index, Math.floor(map(val,min,max,0,255)))
    return Math.floor(map(val,min,max,0,255))
  });
  //console.log('Greyscale values',pixelValues);
  loadPixels();
  
  for(let i = 0; i < width*height; i++){
      //console.log(`the value is ${Math.floor(pixelValues[i])}`);
      pixels[i*4+0] = Math.floor(pixelValues[i*3+0]);
      pixels[i*4+1] = Math.floor(pixelValues[i*3+1]);
      pixels[i*4+2] = Math.floor(pixelValues[i*3+2]);
      pixels[i*4+3] = 255;
  }
  updatePixels();
  console.log('done');
});
  

  background(51);

  

  noLoop();
}