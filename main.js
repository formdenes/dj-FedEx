function setup() {
  createCanvas(256, 256);
  const pixelModel = tf.sequential();

const hidden = tf.layers.dense({
  units: 4,
  inputShape: [2],
  activation: 'sigmoid',
});

const output = tf.layers.dense({
  units: 1,
  activation: 'sigmoid',
});

pixelModel.add(hidden);
pixelModel.add(output);

pixelModel.summary();

const makeInputs = (width, height) => {
  let coordinates = [];
  for(let i = 0; i < width; i++){
    for(let j = 0; j < height; j++){
      coordinates.push([i,j])
    }
  }
  return coordinates;
}

const input = tf.tensor2d(
  makeInputs(256,256)
)

const outputs = pixelModel.predict(input);
tf.print(outputs);

let pixelValues;

outputs.data().then(data => {
  pixelValues = data.map(val => map(val,0,1,0,255));
  console.log('Greyscale values',pixelValues);
});
}




/* let x_vals = [];
let y_vals = [];

let a, b, c, d;
let dragging = false;

const learningRate = 0.2;
const optimizer = tf.train.adam(learningRate); */


/* function loss(pred, labels) {
  return pred.sub(labels).square().mean();
}

function predict(x) {
  const xs = tf.tensor1d(x);
  // y = ax^3 + bx^2 + cx + d
  const ys = xs.pow(tf.scalar(3)).mul(a)
    .add(xs.square().mul(b))
    .add(xs.mul(c))
    .add(d);
  return ys;
} */


/* function mousePressed() {
  dragging = true;
}

function mouseReleased() {
  dragging = false;
} */

function draw() {
  /* if (dragging) {
    let x = map(mouseX, 0, width, -1, 1);
    let y = map(mouseY, 0, height, 1, -1);
    x_vals.push(x);
    y_vals.push(y);
  } else {
    tf.tidy(() => {
      if (x_vals.length > 0) {
        const ys = tf.tensor1d(y_vals);
        optimizer.minimize(() => loss(predict(x_vals), ys));
      }
    });
  }

  background(0);

  stroke(255);
  strokeWeight(8);
  for (let i = 0; i < x_vals.length; i++) {
    let px = map(x_vals[i], -1, 1, 0, width);
    let py = map(y_vals[i], -1, 1, height, 0);
    point(px, py);
  }


  const curveX = [];
  for (let x = -1; x <= 1; x += 0.05) {
    curveX.push(x);
  }

  const ys = tf.tidy(() => predict(curveX));
  let curveY = ys.dataSync();
  ys.dispose();

  beginShape();
  noFill();
  stroke(255);
  strokeWeight(2);
  for (let i = 0; i < curveX.length; i++) {
    let x = map(curveX[i], -1, 1, 0, width);
    let y = map(curveY[i], -1, 1, height, 0);
    vertex(x, y);
  }
  endShape(); */
}