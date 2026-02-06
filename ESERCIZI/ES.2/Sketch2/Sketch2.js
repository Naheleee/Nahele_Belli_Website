let slider1, slider2;

// ===============================
// SWITCH ON / OFF
// ===============================
let toggle;
let autoAnimate = false;
let t = 0; 
let dir = 1; // direzione animazione avanti / indietro
let slider2Phase = 0; // 0 = iniziale 0->max, 1 = loop avanti/indietro
let speed = 0.005;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(10);
  textAlign(CENTER, CENTER);

  slider1 = createSlider(0, 200, 0);
  slider1.style('width', '200px');
  slider1.position((windowWidth - 200) / 2, 20);

  slider2 = createSlider(-70, 70, 0);
  slider2.style('width', '200px');
  slider2.style('transform', 'rotate(90deg)');
  slider2.style('transform-origin', 'center');
  slider2.position((windowWidth - 130), (windowHeight / 2));

  toggle = createDiv('');
  toggle.position(windowWidth - 80, 20);
  toggle.size(45, 24);
  toggle.style('border', '2px solid blue');
  toggle.style('border-radius', '30px');
  toggle.style('cursor', 'pointer');
  toggle.style('position', 'absolute');

  let knob = createDiv('');
  knob.parent(toggle);
  knob.size(17, 17);
  knob.position(4, 4);
  knob.style('background', 'blue');
  knob.style('border-radius', '50%');
  knob.style('transition', 'transform 0.3s');

  toggle.mousePressed(() => {
    autoAnimate = !autoAnimate;
    knob.style('transform', autoAnimate ? 'translateX(20px)' : 'translateX(0px)');
    if (autoAnimate) {
      slider2Phase = 0;
      t = 0;
      dir = 1;
    }
  });

  // ===============================
  // Attivazione iniziale dello switch
  // ===============================
  autoAnimate = true;
  slider2Phase = 0;
  t = 0;
  dir = 1;
  knob.style('transform', 'translateX(20px)');

  // Styling slider
  slider1.style('-webkit-appearance', 'none');
  slider2.style('-webkit-appearance', 'none');
  slider1.style('height', '2px');
  slider2.style('height', '2px');

  const style = document.createElement('style');
  style.innerHTML = `
    input[type=range]::-webkit-slider-runnable-track { height: 2px; background: blue; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; background: blue; border-radius: 50%; cursor: pointer; margin-top: -5px; }
    input[type=range]::-moz-range-track { height: 2px; background: blue; }
    input[type=range]::-moz-range-thumb { width: 12px; height: 12px; background: blue; border-radius: 50%; cursor: pointer; }
  `;
  document.head.appendChild(style);
}

function draw() {
  background(255);

  if (autoAnimate) {
    if (slider2Phase === 0) {
      // ===============================
      // PRIMA FASE SLIDER2: 0 -> max
      // ===============================
      t += speed; // t cresce da 0 a 1
      if (t >= 1) {
        t = 1;
        slider2Phase = 1; // passa al loop avanti/indietro
        dir = -1; // iniziamo il primo ciclo indietro
      }

      // Slider2 sale da 0 a max
      let eased = bezierPoint(0, 0, 1, 1, t);
      slider2.value(map(eased, 0, 1, 0, Number(slider2.elt.max)));

      // Slider1 continua normalmente
      slider1.value(map(eased, 0, 1, Number(slider1.elt.min), Number(slider1.elt.max)));

    } else {
      // ===============================
      // CICLO LOOP SLIDER1 + SLIDER2
      // ===============================
      t += speed * dir;

      if (t >= 1) { t = 1; dir = -1; }
      if (t <= 0) { t = 0; dir = 1; }

      let eased = bezierPoint(0, 0, 1, 1, t);

      slider1.value(map(eased, 0, 1, Number(slider1.elt.min), Number(slider1.elt.max)));
      slider2.value(map(eased, 0, 1, Number(slider2.elt.min), Number(slider2.elt.max)));
    }
  }

  // ===============================
  // DISEGNO FORMA
  // ===============================
  let s = 300;
  let w1 = slider1.value();
  let hOffset = slider2.value();

  let vertices = [
    [-s * 0.3, -s * 0.5],
    [-s * 0.3, s * 0.5],
    [w1, s * 0.5],
    [w1 + 50, s * 0.4],
    [w1 + 50, s * 0.1],
    [w1, 0],
    [-s * 0.3, 0],
    [w1, -0],
    [w1 + 50, -0.1 * s],
    [w1 + 50, -0.4 * s],
    [w1, -0.5 * s]
  ];

  let cx = 0, cy = 0;
  for (let i = 0; i < vertices.length; i++) {
    cx += vertices[i][0];
    cy += vertices[i][1];
  }
  cx /= vertices.length;
  cy /= vertices.length;

  let groupIndices = [4, 5, 7, 8, 6];
  for (let i = 0; i < groupIndices.length; i++) {
    let idx = groupIndices[i];
    vertices[idx][1] += hOffset;
  }

  translate(width / 2 - cx / 2, height / 2 - cy);

  fill(255);
  stroke("blue");
  strokeWeight(0.5);
  beginShape();
  for (let i = 0; i < vertices.length; i++) vertex(vertices[i][0], vertices[i][1]);
  endShape(CLOSE);

  fill(0, 0, 255, 50);
  stroke("blue");
  strokeWeight(3);
  for (let i = 0; i < vertices.length; i++) ellipse(vertices[i][0], vertices[i][1], 10, 10);

  fill("blue");
  noStroke();
  for (let i = 0; i < vertices.length; i++) text(i, vertices[i][0] - 5, vertices[i][1] - 10);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
