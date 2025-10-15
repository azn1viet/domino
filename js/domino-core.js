/* ===== domino-core.js ===== */
/* Core game logic for seating, board setup, and Firebase updates. */

window.dominoGame = {
  tablePath: "games/domino/rooms/public/tables/table1",
  players: {},
  currentPlayerId: null,
  isSeated: false
};

// === Initialize the table with dummy bots ===
function initDominoTable() {
  const seats = {
    P1: { nickname: "Bot #1", id: "bot1", role: "bot" },
    P2: { nickname: "Bot #2", id: "bot2", role: "bot" },
    P3: { nickname: "Bot #3", id: "bot3", role: "bot" },
    P4: null
  };

  dominoGame.players = seats;
  renderSeats();
  console.log("%cDomino Table Initialized", "color:#4da6ff;");
}

// === Render seat layout ===
function renderSeats() {
  for (let i = 1; i <= 4; i++) {
    const seatEl = document.getElementById("P" + i);
    const seat = dominoGame.players["P" + i];
    if (seat && seat.nickname) {
      seatEl.innerHTML = `P${i}<br><span class="nickname">${seat.nickname}</span>`;
      seatEl.dataset.empty = "false";
      seatEl.style.opacity = 1;
    } else {
      seatEl.innerHTML = `P${i}<br><span class="nickname">Click to Sit</span>`;
      seatEl.dataset.empty = "true";
      seatEl.style.opacity = 0.6;
    }
  }
}

// === Handle seat click ===
function handleSeatClick(position) {
  if (!canUserPlay()) return;
  if (dominoGame.isSeated) {
    alert("You are already seated!");
    return;
  }

  const seat = dominoGame.players[position];
  if (seat && seat.nickname && seat.role !== "bot") {
    alert("Seat already taken!");
    return;
  }

  dominoGame.players[position] = {
    id: userSession.id,
    nickname: userSession.nickname,
    role: userSession.role
  };
  dominoGame.isSeated = true;
  dominoGame.currentPlayerId = userSession.id;

  // Rotate view so player sits South visually
  rotateViewToSouth(position);
  renderSeats();
  updatePlayersToFirebase();
  console.log(`%c${userSession.nickname} took seat ${position}`, "color:#4da6ff;");
}

// === Rotate view to South (player perspective) ===
function rotateViewToSouth(position) {
  const table = document.getElementById("table-area");
  table.dataset.view = position;
  console.log("%cView rotated for player at " + position, "color:#4da6ff;");
}

// === Placeholder: Update players in Firebase ===
function updatePlayersToFirebase() {
  if (!window.firebaseReady) return; // Skip if Firebase not initialized
  try {
    refPlayers.set(dominoGame.players);
    console.log("%cPlayers synced to Firebase", "color:#00ffaa;");
  } catch (err) {
    console.warn("Firebase update skipped (offline mode).");
  }
}

// === Placeholder: Update board state ===
function updateBoard(boardState) {
  if (!window.firebaseReady) return;
  try {
    refBoard.set(boardState);
    console.log("%cBoard updated", "color:#00ffaa;");
  } catch (err) {
    console.warn("Firebase board update skipped (offline mode).");
  }
}

// === Attach click listeners to seats ===
window.addEventListener("DOMContentLoaded", () => {
  initDominoTable();
  for (let i = 1; i <= 4; i++) {
    document.getElementById("P" + i).addEventListener("click", () => handleSeatClick("P" + i));
  }
});
