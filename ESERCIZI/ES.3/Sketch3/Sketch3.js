let selfieData = [];
let heatmap = []; // matrice 7x24
let currentCol = 0; // colonna corrente da disegnare

function setup() {
    let canvas = createCanvas(920, 450);
    canvas.parent(document.body); // associa il canvas al body dell'iframe
    textAlign(CENTER, CENTER);
    noStroke();

    // inizializza heatmap 7x24
    for (let i = 0; i < 7; i++) {
        heatmap[i] = [];
        for (let j = 0; j < 24; j++) {
            heatmap[i][j] = 0;
        }
    }

    // carica il JSON in locale
    loadLocalJSON();
}

function loadLocalJSON() {
    // leggi il file selfie_data.json nella stessa cartella
    fetch('selfie_data.json')
        .then(response => response.json())
        .then(data => {
            selfieData = data;
            processData(); // processa i dati e disegna la heatmap
        })
        .catch(err => {
            console.error("Errore nel caricamento del JSON:", err);
        });
}

function processData() {
    // popola heatmap
    for (let i = 0; i < selfieData.length; i++) {
        let item = selfieData[i];

        // filtro per tutti i tipi comuni di immagini
        if (!item.filename.match(/\.(jpe?g|JPG|png|gif|bmp|webp|tiff)$/i)) {
            continue; // salta file che non sono immagini
        }

        let d = new Date(item.year, item.month - 1, item.day, item.hour, item.minute, item.second);
        let dayOfWeek = d.getDay(); // 0 = domenica
        let hour = item.hour;
        heatmap[dayOfWeek][hour]++;
    }

    // spostiamo lunedì in alto
    heatmap = [heatmap[1], heatmap[2], heatmap[3], heatmap[4], heatmap[5], heatmap[6], heatmap[0]];
    
    frameRate(30); // opzionale: rallenta l'animazione
}

function draw() {
    background(255);
    let cellW = width / 24;
    let cellH = height / 7;

    // massimo per normalizzare colore
    let maxCount = 0;
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 24; j++) {
            if (heatmap[i][j] > maxCount) maxCount = heatmap[i][j];
        }
    }

    // disegna colonne fino a currentCol
    textSize(12);
    textAlign(CENTER, CENTER);
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j <= currentCol; j++) {
            let val = heatmap[i][j];
            let alphaVal = map(val, 0, maxCount, 15, 200);
            let col = color(0, 0, 255, alphaVal);
            fill(col);
            rect(j * cellW, i * cellH, cellW, cellH);

            // scrivi sempre il numero nella cella in nero
            fill(0);
            text(val, j * cellW + cellW / 2, i * cellH + cellH / 2);
        }
    }

    // passa alla colonna successiva
    if (currentCol < 23) {
        currentCol++;
    }
}
