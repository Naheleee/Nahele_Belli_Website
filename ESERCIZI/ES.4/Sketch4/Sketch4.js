// ================= CONFIGURAZIONE =================
let CONFIG = {
  canvasWidth: 500,
  canvasHeight: 500,
  cellSize: 25,
  playerRadius: 6,
  playerSpeed: 3,
  mazeStroke: 1,
  backgroundColor: [255],
  playerColor: [255, 0, 0],
  goalColor: [0, 0, 255],
  screenColor: [255, 255, 255],
  textColor: [0, 0, 0],
  buttonSize: 150,
  buttonBorderColor: [0, 0, 255],
  buttonBorderWeight: 0.5
};

// ================= VARIABILI =================
let cols, rows;
let grid = [];

let player;
let goal;

// Stati del gioco
let state = "start"; // start, playing, end

// Bottoni
let buttonX, buttonY;

// ================= SETUP =================
function setup() {
  createCanvas(CONFIG.canvasWidth, CONFIG.canvasHeight);
  cols = floor(CONFIG.canvasWidth / CONFIG.cellSize);
  rows = floor(CONFIG.canvasHeight / CONFIG.cellSize);

  // Inizializza griglia
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      grid.push(new Cell(i, j));
    }
  }

  // Maze già generato
  generateMazeWithMultiplePaths();

  // Player
  player = new Player(CONFIG.cellSize/2, CONFIG.cellSize/2, CONFIG.playerRadius);

  // Goal
  goal = { x: (cols - 1) * CONFIG.cellSize, y: (rows - 1) * CONFIG.cellSize, size: CONFIG.cellSize };

  // Posizione bottone
  buttonX = width/2 - CONFIG.buttonSize/2;
  buttonY = height/2 - CONFIG.buttonSize/2;
}

// ================= DRAW =================
function draw() {
  if (state === "start") {
    // Schermata iniziale
    background(...CONFIG.screenColor);
    drawButton("Play!");
  } 
  else if (state === "playing") {
    background(...CONFIG.backgroundColor);

    // Disegna maze
    for (let cell of grid) {
      cell.show();
    }

    // Disegna goal
    fill(...CONFIG.goalColor);
    noStroke();
    rect(goal.x, goal.y, goal.size, goal.size);

    // Muove e disegna player
    player.update();
    player.show();

    // Controllo raggiungimento goal
    if (player.x + player.r > goal.x && player.x - player.r < goal.x + goal.size &&
        player.y + player.r > goal.y && player.y - player.r < goal.y + goal.size) {
      state = "end";
    }
  }
  else if (state === "end") {
    // Schermata finale
    background(...CONFIG.screenColor);
    drawButton("Replay!");
  }
}

// ================= DISEGNO BOTTONE =================
function drawButton(label) {
  stroke(...CONFIG.buttonBorderColor);
  strokeWeight(CONFIG.buttonBorderWeight);
  fill(CONFIG.screenColor);
  rect(buttonX, buttonY, CONFIG.buttonSize, CONFIG.buttonSize);

  fill(...CONFIG.textColor);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(32);
  text(label, buttonX + CONFIG.buttonSize/2, buttonY + CONFIG.buttonSize/2);
}

// ================= GESTIONE CLICK =================
function mousePressed() {
  if (mouseX > buttonX && mouseX < buttonX + CONFIG.buttonSize &&
      mouseY > buttonY && mouseY < buttonY + CONFIG.buttonSize) {
    if (state === "start") {
      state = "playing";
    } else if (state === "end") {
      resetGame(); // Rigenera maze invece di reload
    }
  }
}

// ================= RESET DEL GIOCO =================
function resetGame() {
  // Reset griglia
  grid = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      grid.push(new Cell(i, j));
    }
  }

  // Rigenera maze
  generateMazeWithMultiplePaths();

  // Reset player
  player.x = CONFIG.cellSize/2;
  player.y = CONFIG.cellSize/2;

  // Reset goal
  goal.x = (cols - 1) * CONFIG.cellSize;
  goal.y = (rows - 1) * CONFIG.cellSize;

  // Torna a stato di gioco
  state = "playing";
}

// ================= GENERAZIONE MAZE =================
function generateMazeWithMultiplePaths() {
  let stack = [];
  let current = grid[0];
  current.visited = true;

  while (true) {
    let next = current.checkNeighbors();
    if (next) {
      next.visited = true;
      stack.push(current);
      removeWalls(current, next);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else {
      break;
    }
  }

  // Collegamenti extra per almeno due percorsi
  for (let i = 0; i < 10; i++) {
    let cell = random(grid);
    let neighbors = [];
    let top = grid[index(cell.i, cell.j-1)];
    let right = grid[index(cell.i+1, cell.j)];
    let bottom = grid[index(cell.i, cell.j+1)];
    let left = grid[index(cell.i-1, cell.j)];
    if (top) neighbors.push(top);
    if (right) neighbors.push(right);
    if (bottom) neighbors.push(bottom);
    if (left) neighbors.push(left);

    let n = random(neighbors);
    if (n) removeWalls(cell, n);
  }
}

// ================= CLASSE CELL =================
class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;
  }

  checkNeighbors() {
    let neighbors = [];
    let top = grid[index(this.i, this.j - 1)];
    let right = grid[index(this.i + 1, this.j)];
    let bottom = grid[index(this.i, this.j + 1)];
    let left = grid[index(this.i - 1, this.j)];

    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);

    return neighbors.length > 0 ? random(neighbors) : undefined;
  }

  show() {
    let x = this.i * CONFIG.cellSize;
    let y = this.j * CONFIG.cellSize;
    stroke(0);
    strokeWeight(CONFIG.mazeStroke);
    if (this.walls[0]) line(x, y, x + CONFIG.cellSize, y);
    if (this.walls[1]) line(x + CONFIG.cellSize, y, x + CONFIG.cellSize, y + CONFIG.cellSize);
    if (this.walls[2]) line(x + CONFIG.cellSize, y + CONFIG.cellSize, x, y + CONFIG.cellSize);
    if (this.walls[3]) line(x, y + CONFIG.cellSize, x, y);
  }
}

function index(i, j) {
  if (i < 0 || j < 0 || i >= cols || j >= rows) return -1;
  return i + j * cols;
}

function removeWalls(a, b) {
  let x = a.i - b.i;
  if (x === 1) { a.walls[3] = false; b.walls[1] = false; }
  else if (x === -1) { a.walls[1] = false; b.walls[3] = false; }

  let y = a.j - b.j;
  if (y === 1) { a.walls[0] = false; b.walls[2] = false; }
  else if (y === -1) { a.walls[2] = false; b.walls[0] = false; }
}

// ================= CLASSE PLAYER =================
class Player {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.speed = CONFIG.playerSpeed;
  }

  update() {
    let dx = 0;
    let dy = 0;
    if (keyIsDown(87)) dy -= this.speed; // w
    if (keyIsDown(83)) dy += this.speed; // s
    if (keyIsDown(65)) dx -= this.speed; // a
    if (keyIsDown(68)) dx += this.speed; // d

    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    let newX = this.x + dx;
    let newY = this.y + dy;

    if (!this.hitWall(newX, newY)) {
      this.x = newX;
      this.y = newY;
    }

    this.x = constrain(this.x, this.r, CONFIG.canvasWidth - this.r);
    this.y = constrain(this.y, this.r, CONFIG.canvasHeight - this.r);
  }

  show() {
    fill(...CONFIG.playerColor);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }

  hitWall(nx, ny) {
    let i = floor(nx / CONFIG.cellSize);
    let j = floor(ny / CONFIG.cellSize);
    let cell = grid[index(i, j)];
    if (!cell) return false;

    let px = nx;
    let py = ny;
    let buffer = this.r;

    if (cell.walls[0] && py - buffer < j * CONFIG.cellSize) return true;
    if (cell.walls[1] && px + buffer > (i + 1) * CONFIG.cellSize) return true;
    if (cell.walls[2] && py + buffer > (j + 1) * CONFIG.cellSize) return true;
    if (cell.walls[3] && px - buffer < i * CONFIG.cellSize) return true;

    return false;
  }
}
