let currMoleTile;
let currPlantTiles = []; // Allow multiple plants
let score = 0;
let gameOver = false;
let gameStarted = false; // Track if the game has started
let moleInterval, plantInterval, difficultyInterval; // Store intervals
let jumpscareSound = new Audio('./rock.mp3'); // Load the sound file
let plantCount = 1; // Start with one plant
let moleSpeed = 1000; // Initial speed for mole
let plantSpeed = 2000; // Initial speed for plants
let highScore = localStorage.getItem("highScore") || 0; // Get high score from localStorage or default to 0
let backgroundMusic = new Audio('./background music.mp3'); // Load the background music

window.onload = function () {
    document.getElementById("startButton").addEventListener("click", startGame);
    document.getElementById("resetButton").addEventListener("click", resetGame);
    document.getElementById("highScore").innerText = `High Score: ${highScore}`; // Display high score
};

function startGame() {
    if (gameStarted) return; // Prevent starting the game again if already started
    gameStarted = true; // Set the game state to started
    gameOver = false;
    score = 0;
    document.getElementById("score").innerText = score.toString(); // Reset the score

    setGame(); // Initialize the game
    difficultyInterval = setInterval(increaseDifficulty, 10000); // Increase difficulty every 10 seconds

    backgroundMusic.play();
    backgroundMusic.loop = true; // Enable looping for continuous play
}

function setGame() {
    // Clear and set up the grid in HTML
    document.getElementById("board").innerHTML = ""; // Clear previous tiles if any
    for (let i = 0; i < 9; i++) { 
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
        document.getElementById("board").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Set intervals for mole and plant
    moleInterval = setInterval(setMole, moleSpeed); // Call setMole at current moleSpeed
    plantInterval = setInterval(setPlant, plantSpeed); // Call setPlant at current plantSpeed
}

function getRandomTile() {
    // Get a random integer between 0 and 8
    let num = Math.floor(Math.random() * 9);
    return num.toString();
}

function setMole() {
    if (gameOver) return;
    if (currMoleTile) {
        currMoleTile.innerHTML = "";
    }
    let mole = document.createElement("img");
    mole.src = "./monty-mole.png";

    let num = getRandomTile();
    if (currPlantTiles.some(plant => plant.id === num)) {
        return;
    }
    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
}

function setPlant() {
    if (gameOver) return;

    // Clear all current plant tiles
    currPlantTiles.forEach(tile => tile.innerHTML = "");
    currPlantTiles = [];

    let occupiedTiles = new Set();
    if (currMoleTile) {
        occupiedTiles.add(currMoleTile.id); // Prevent plants from overlapping the mole
    }

    // Generate `plantCount` number of plants
    for (let i = 0; i < plantCount; i++) {
        let num;

        // Ensure the plant spawns in an unoccupied tile
        do {
            num = getRandomTile();
        } while (occupiedTiles.has(num));

        occupiedTiles.add(num); // Mark the tile as occupied

        let plantTile = document.getElementById(num);
        let plant = document.createElement("img");
        plant.src = "./piranha-plant.png";

        currPlantTiles.push(plantTile); // Track the plant's tile
        plantTile.appendChild(plant);
    }
}

function selectTile() {
    if (gameOver) return;
    if (this == currMoleTile) {
        score += 5;
        document.getElementById("score").innerText = score.toString(); // Update score in HTML
    } else if (currPlantTiles.includes(this)) {
        document.getElementById("score").innerText = "GAME OVER: " + score.toString(); // Update score in HTML
        gameOver = true;
        clearIntervals(); // Stop mole and plant intervals
    }
}

function resetGame() {
    jumpscareSound.play(); // Play jumpscare sound

    // Show the jumpscare image
    let jumpscare = document.getElementById("jumpscare");
    jumpscare.style.display = "flex";
    //background music
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    // Once the jumpscare animation ends, reset the game
    setTimeout(function () {
        // Check if the current score is greater than the high score
        if (score > highScore) {
            highScore = score; // Update high score
            localStorage.setItem("highScore", highScore); // Store high score in localStorage
            document.getElementById("highScore").innerText = `High Score: ${highScore}`; // Update high score display
        }

        currMoleTile = null;
        currPlantTiles = [];
        score = 0;
        gameOver = false;
        gameStarted = false; // Allow the game to start again
        plantCount = 1; // Reset plant count
        moleSpeed = 1000; // Reset mole speed
        plantSpeed = 2000; // Reset plant speed
        document.getElementById("score").innerText = score.toString(); // Reset score display

        // Clear all tiles
        let tiles = document.getElementById("board").children;
        for (let tile of tiles) {
            tile.innerHTML = "";
        }

        // Hide the jumpscare after reset
        jumpscare.style.display = "none";

        clearIntervals(); // Stop any existing intervals
    }, 3000); // Wait for 3 seconds (duration of the fade-out animation)
}

function clearIntervals() {
    clearInterval(moleInterval); // Stop mole interval
    clearInterval(plantInterval); // Stop plant interval
    clearInterval(difficultyInterval); // Stop difficulty increase
}

function increaseDifficulty() {
    // Increase the number of plants
    plantCount++;

    // Decrease mole and plant intervals for more challenge
    moleSpeed = Math.max(500, moleSpeed - 100); // Minimum speed limit
    plantSpeed = Math.max(1000, plantSpeed - 200);

    // Reset intervals to apply the new speeds
    clearInterval(moleInterval);
    clearInterval(plantInterval);
    moleInterval = setInterval(setMole, moleSpeed);
    plantInterval = setInterval(setPlant, plantSpeed);
}
