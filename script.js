const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('ui');

// Game Constants
canvas.width = 400;
canvas.height = 600;
const laneWidth = canvas.width / 3;

let score = 0;
let gameActive = true;

// Player Object
const player = {
    lane: 1,
    width: 50,
    height: 80,
    color: '#0095DD'
};

let obstacles = [];
let obstacleSpeed = 5;
let frameCount = 0;

// Listen for keys
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && player.lane > 0) player.lane--;
    if (e.key === 'ArrowRight' && player.lane < 2) player.lane++;
    if (!gameActive && e.key === ' ') restartGame();
});

function spawnObstacle() {
    const lane = Math.floor(Math.random() * 3);
    obstacles.push({
        x: lane * laneWidth + (laneWidth - 50) / 2,
        y: -100,
        width: 50,
        height: 100,
        color: '#FF4136'
    });
}

function restartGame() {
    score = 0;
    obstacles = [];
    obstacleSpeed = 5;
    gameActive = true;
    scoreElement.innerText = `Score: 0`;
    update();
}

function update() {
    if (!gameActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frameCount++;

    // Draw Lanes
    ctx.strokeStyle = '#444';
    for(let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(i * laneWidth, 0);
        ctx.lineTo(i * laneWidth, canvas.height);
        ctx.stroke();
    }

    // Draw Player
    const playerX = player.lane * laneWidth + (laneWidth - player.width) / 2;
    const playerY = canvas.height - player.height - 20;
    ctx.fillStyle = player.color;
    ctx.fillRect(playerX, playerY, player.width, player.height);

    // Spawn obstacles every 60 frames
    if (frameCount % 60 === 0) {
        spawnObstacle();
        if (obstacleSpeed < 15) obstacleSpeed += 0.1;
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        let o = obstacles[i];
        o.y += obstacleSpeed;
        ctx.fillStyle = o.color;
        ctx.fillRect(o.x, o.y, o.width, o.height);

        // Check for hits
        if (o.y + o.height > playerY && o.y < playerY + player.height &&
            o.x < playerX + player.width && o.x + o.width > playerX) {
            gameActive = false;
            alert("Game Over! Score: " + score + "\nPress SPACE to restart.");
        }

        // Score points
        if (o.y > canvas.height) {
            obstacles.splice(i, 1);
            score++;
            scoreElement.innerText = `Score: ${score}`;
        }
    }

    requestAnimationFrame(update);
}

// Start the loop
update();