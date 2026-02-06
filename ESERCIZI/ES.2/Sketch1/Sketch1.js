let cnv;
let letters = [];
let baseSize = 5;           // dimensione standard
let maxSize;                // dimensione massima dell'onda (calcolata)
let influenceRadius;        // larghezza effettiva dell'onda (calcolata)
let waveX = 0;              // posizione corrente dell'onda
let speed;                  // velocità dell'onda (calcolata)
let mouseInfluence;         // raggio di influenza del mouse (calcolato)
let mouseInside = false;    // flag per sapere se il mouse è dentro il canvas

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  textFont("Helvetica");
  textAlign(CENTER, CENTER);
  noCursor();

  createGrid();

  // aggiunge listener quando il mouse entra o esce dal canvas
  cnv.mouseOver(() => mouseInside = true);
  cnv.mouseOut(() => mouseInside = false);
}

function createGrid() {
  letters = [];

  let cols = Math.floor(width / 40);
  let rows = Math.floor(height / 40);

  let spacingX = width / cols;
  let spacingY = height / rows;

  maxSize = Math.min(spacingX, spacingY) * 1.2;
  influenceRadius = width * 0.4;
  speed = width * 0.008;
  mouseInfluence = Math.min(width, height) * 0.2;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      letters.push({
        x: i * spacingX + spacingX / 2,
        y: j * spacingY + spacingY / 2,
        size: baseSize
      });
    }
  }
}

function draw() {
  background("#ffffff");
  fill("blue");

  for (let l of letters) {
    // --- effetto onda ---
    let dx = l.x - waveX;
    let t = constrain(dx / influenceRadius, -1, 1);

    let factor = 0;
    if (abs(t) <= 1) {
      factor = pow(1 - t * t, 2); // picco al centro
    }

    let newSize = baseSize + factor * (maxSize - baseSize);

    // --- effetto mouse ---
    if (mouseInside) {  // applica solo se il mouse è dentro il canvas
      let d = dist(mouseX, mouseY, l.x, l.y);
      if (d < mouseInfluence) {
        let mouseFactor = (1 - d / mouseInfluence);
        newSize += mouseFactor * (maxSize - baseSize);
      }
    }

    textSize(newSize);
    text("N", l.x, l.y);
  }

  // muovi l'onda
  waveX += speed;
  if (waveX > width + influenceRadius) {
    waveX = -influenceRadius;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createGrid();
}





