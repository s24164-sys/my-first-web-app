
let player;
let blocks = [];
let score = 0;
let gameOver = false;
let spawnTimer = 0;
let blockSpeed = 3;

function setup() {
  createCanvas(500, 600);

  player = {
    x: width / 2,
    y: height - 60,
    size: 35,
    speed: 6
  };
}

function draw() {
  background(25, 30, 50);

  // Draw the road
  stroke(80, 90, 115);
  strokeWeight(3);

  for (let y = 0; y < height; y += 50) {
    line(width / 2, y, width / 2, y + 25);
  }

  noStroke();

  if (!gameOver) {
    // Move the player
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      player.x -= player.speed;
    }

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      player.x += player.speed;
    }

    // Keep the player inside the screen
    player.x = constrain(
      player.x,
      player.size / 2,
      width - player.size / 2
    );

    // Create falling blocks
    spawnTimer++;

    let spawnRate = max(20, 50 - floor(score / 5));

    if (spawnTimer >= spawnRate) {
      blocks.push({
        x: random(20, width - 20),
        y: -30,
        size: random(25, 40),
        counted: false
      });

      spawnTimer = 0;
    }

    // Increase difficulty gradually
    blockSpeed = 3 + score * 0.04;

    // Update and draw blocks
    for (let i = blocks.length - 1; i >= 0; i--) {
      let b = blocks[i];

      b.y += blockSpeed;

      fill(255, 75, 85);
      rectMode(CENTER);
      rect(b.x, b.y, b.size, b.size, 6);

      // Collision detection
      let hit = dist(
        player.x,
        player.y,
        b.x,
        b.y
      ) < (player.size + b.size) / 2;

      if (hit) {
        gameOver = true;
      }

      // Score when a block passes the player
      if (!b.counted && b.y > player.y + player.size) {
        score++;
        b.counted = true;
      }

      // Remove blocks that leave the screen
      if (b.y > height + 40) {
        blocks.splice(i, 1);
      }
    }
  } else {
    // Dark overlay on game over
    fill(0, 0, 0, 170);
    rectMode(CORNER);
    rect(0, 0, width, height);

    textAlign(CENTER, CENTER);
    fill(255);
    textSize(38);
    text("GAME OVER", width / 2, height / 2 - 35);

    textSize(20);
    text("Final Score: " + score, width / 2, height / 2 + 10);

    textSize(15);
    text("Press SPACE to play again", width / 2, height / 2 + 55);
  }

  // Draw the player
  fill(65, 210, 255);
  rectMode(CENTER);
  rect(player.x, player.y, player.size, player.size, 8);

  // Draw the score
  fill(255);
  textAlign(LEFT, TOP);
  textSize(22);
  text("Score: " + score, 15, 15);

  // Instructions
  textSize(12);
  fill(190);
  text("Move: ← → or A / D", 15, 45);
}

function keyPressed() {
  if (key === " " && gameOver) {
    score = 0;
    blocks = [];
    spawnTimer = 0;
    blockSpeed = 3;
    gameOver = false;

    player.x = width / 2;
  }
}
