function setup() {
  createCanvas(500, 500);
  pixelDensity(1);

}

function draw() {

  const pixelModel = tf.sequential();

  const hidden1 = tf.layers.dense({
    units: 8,
    inputShape: [3],
    activation: 'tanh',
  });
  const hidden2 = tf.layers.dense({
    units: 8,
    activation: 'tanh',
  });

  const output = tf.layers.dense({
    units: 3,
    activation: 'sigmoid',
  });

  pixelModel.add(hidden1);
  pixelModel.add(hidden2);
  pixelModel.add(output);

  //pixelModel.summary();

  const makeInputs = (width, height) => {
    let coordinates = [];
    for(let i = 0; i < width; i++){
      for(let j = 0; j < height; j++){
        coordinates.push([i,j,Math.sqrt(i*i + j*j)])
      }
    }
    return coordinates;
  }

  const input = tf.tensor2d(
    makeInputs(width,height)
  )

const outputs = pixelModel.predict(input);
//tf.print(outputs);

let pixelValues;

outputs.data().then(data => {
  pixelValues = data.map(val => map(val,0,1,0,255));
  //console.log('Greyscale values',pixelValues);
  loadPixels();
  
  for(let i = 0; i < width*height; i++){
      //console.log(`the value is ${Math.floor(pixelValues[i])}`);
      pixels[i*4+0] = Math.floor(pixelValues[i+0]);
      pixels[i*4+1] = Math.floor(pixelValues[i+1]);
      pixels[i*4+2] = Math.floor(pixelValues[i+2]);
      pixels[i*4+3] = Math.floor(pixelValues[i+3]);
  }
  updatePixels();
  console.log('done');
});
  

  background(51);

  

  noLoop();
}