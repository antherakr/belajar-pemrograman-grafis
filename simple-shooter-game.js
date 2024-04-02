
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var player = {
    x: 50,
    y: canvas.height / 2,
    width: 50,
    height: 50, 
    color: "#3498db",
    speed: 5
};

var enemy = {
    x: canvas.width - 80,
    y: canvas.height / 2 - 15,
    size: 40,
    color: "#9b59b6",
    speedY: 2,
    directionY: 1
};

var bullets = [];
var bulletRadius = 6.8; 

var score = 0;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x + player.width, player.y + player.height / 2);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = enemy.color;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 / 5) * i - Math.PI / 2; // Adjust angle to start from the top
        const offsetX = enemy.size * Math.cos(angle);
        const offsetY = enemy.size * Math.sin(angle);
        ctx.lineTo(enemy.x + offsetX, enemy.y + offsetY);
    }
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "red";
    for (var i = 0; i < bullets.length; i++) {
        ctx.beginPath();
        ctx.arc(bullets[i].x, bullets[i].y, bulletRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    ctx.font = "30px Arial";
    ctx.fillStyle = "#2c3e50";
    ctx.fillText("Score: " + score, 10, 50);
}

function update() {
    // Pergerakan vertikal
    if (keys.up && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys.down && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }

    // Pergerakan horizontal
    if (keys.left && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.right && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }

    enemy.y += enemy.speedY * enemy.directionY;

    if (enemy.y < 0 || enemy.y > canvas.height - enemy.size) {
        enemy.directionY *= -1;
    }

    if (enemy.x < canvas.width / 2) {
        enemy.x = canvas.width / 2;
    }

    if (player.x + player.width + 50 > enemy.x) {
        player.x = enemy.x - player.width - 50;
    }

    var newBullets = [];

    bullets.forEach(bullet => {
        bullet.x += 7;

        if (!bullet.hit && isCollision(bullet, enemy)) {
            score++;
            bullet.hit = true;
        } else {
            newBullets.push(bullet);
        }
    });

    bullets = newBullets;
}

function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

var keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

window.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") keys.left = true;
    if (e.key === "ArrowRight") keys.right = true;
    if (e.key === "ArrowUp") keys.up = true;
    if (e.key === "ArrowDown") keys.down = true;
    if (e.key === " ") {
        bullets.push({
            x: player.x + player.width,
            y: player.y + player.height / 2
        });
    }
});

window.addEventListener("keyup", function (e) {
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === "ArrowRigh  t") keys.right = false;
    if (e.key === "ArrowUp") keys.up = false;
    if (e.key === "ArrowDown") keys.down = false;
});

function isCollision(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.size &&
        obj1.x + bulletRadius > obj2.x &&
        obj1.y < obj2.y + obj2.size &&
        obj1.y + bulletRadius > obj2.y
    );
}

gameLoop();