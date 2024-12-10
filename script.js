const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20; // Ukuran setiap tile
let tileCountX, tileCountY; // Jumlah tile secara horizontal dan vertikal

let snake = [{ x: 10, y: 10 }]; // Posisi awal ular
let food = { x: 5, y: 5 }; // Posisi awal makanan
let direction = { x: 1, y: 0 }; // Ular bergerak ke kanan
let lastDirection = { x: 1, y: 0 }; // Arah terakhir yang sah
let speed = 150; // Kecepatan game
let gameLoop;

// Menyesuaikan ukuran kanvas dengan layar penuh
function resizeCanvas() {
  canvas.width = Math.floor(window.innerWidth / gridSize) * gridSize;
  canvas.height = Math.floor(window.innerHeight / gridSize) * gridSize;

  tileCountX = canvas.width / gridSize;
  tileCountY = canvas.height / gridSize;

  placeFood(); // Pastikan makanan tetap dalam grid
}

// Memulai permainan
function startGame() {
  resizeCanvas();
  document.addEventListener("keydown", changeDirection); // Kontrol keyboard
  drawGame();
  gameLoop = setInterval(updateGame, speed); // Loop permainan
}

// Perbarui permainan
function updateGame() {
  // Hitung posisi kepala baru ular
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  // Periksa tabrakan dengan dinding atau tubuh
  if (checkCollision(head)) {
    alert("Game Over! Refresh to play again.");
    clearInterval(gameLoop);
    return;
  }

  // Tambahkan kepala baru ke ular
  snake.unshift(head);

  // Periksa apakah ular memakan makanan
  if (head.x === food.x && head.y === food.y) {
    placeFood(); // Tempatkan makanan baru
  } else {
    snake.pop(); // Hapus ekor jika tidak makan
  }

  lastDirection = direction; // Simpan arah terakhir
  drawGame();
}

// Gambar ulang permainan
function drawGame() {
  // Gambar latar belakang
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Gambar ular
  ctx.fillStyle = "#4caf50";
  for (let segment of snake) {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  }

  // Gambar makanan
  ctx.fillStyle = "#ff5722";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// Tempatkan makanan di lokasi acak
function placeFood() {
  food = {
    x: Math.floor(Math.random() * tileCountX),
    y: Math.floor(Math.random() * tileCountY),
  };

  // Hindari makanan muncul di tubuh ular
  while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    food = {
      x: Math.floor(Math.random() * tileCountX),
      y: Math.floor(Math.random() * tileCountY),
    };
  }
}

// Ubah arah berdasarkan input keyboard
function changeDirection(event) {
  const { key } = event;

  // Pastikan ular tidak bisa berbalik arah secara langsung
  if ((key === "ArrowUp" || key === "w") && lastDirection.y === 0) {
    direction = { x: 0, y: -1 };
  } else if ((key === "ArrowDown" || key === "s") && lastDirection.y === 0) {
    direction = { x: 0, y: 1 };
  } else if ((key === "ArrowLeft" || key === "a") && lastDirection.x === 0) {
    direction = { x: -1, y: 0 };
  } else if ((key === "ArrowRight" || key === "d") && lastDirection.x === 0) {
    direction = { x: 1, y: 0 };
  }
}

// Periksa tabrakan
function checkCollision(head) {
  // Tabrakan dengan dinding
  if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
    return true;
  }

  // Tabrakan dengan tubuh ular
  for (let segment of snake) {
    if (segment.x === head.x && segment.y === head.y) {
      return true;
    }
  }

  return false;
}

// Pastikan kanvas diperbarui saat ukuran jendela berubah
window.addEventListener("resize", resizeCanvas);

// Mulai permainan
startGame();
