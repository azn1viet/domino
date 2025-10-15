/* ===== user-session.js ===== */
/* Handles nickname, role (admin/player), bans, and scores.
   Data is stored in localStorage for persistence and can sync to Firebase later.
*/

window.userSession = {
  id: null,
  nickname: null,
  role: "player", // "admin" or "player"
  banned: false,
  score: 0
};

// === Initialize or load existing session ===
function initUserSession() {
  const storedId = localStorage.getItem("userId");
  const storedNick = localStorage.getItem("nickname");
  const storedRole = localStorage.getItem("role");
  const storedScore = localStorage.getItem("score");
  const storedBan = localStorage.getItem("banned");

  // Generate new ID if not exist
  userSession.id = storedId || "user_" + Math.random().toString(36).substr(2, 9);
  userSession.nickname = storedNick || prompt("Enter your nickname:", "Guest_" + Math.floor(Math.random() * 1000));
  userSession.role = storedRole || (userSession.nickname.toLowerCase().includes("admin") ? "admin" : "player");
  userSession.score = storedScore ? parseInt(storedScore) : 0;
  userSession.banned = storedBan === "true";

  // Save to localStorage
  localStorage.setItem("userId", userSession.id);
  localStorage.setItem("nickname", userSession.nickname);
  localStorage.setItem("role", userSession.role);
  localStorage.setItem("score", userSession.score);
  localStorage.setItem("banned", userSession.banned);

  console.log(`%cSession Loaded: ${userSession.nickname} (${userSession.role})`, "color:#4da6ff;");
}

// === Update local score ===
function updateUserScore(amount) {
  userSession.score += amount;
  localStorage.setItem("score", userSession.score);
  console.log(`%cNew Score: ${userSession.score}`, "color:#00aaff;");
}

// === Ban / Unban user locally (can sync to Firebase admin later) ===
function setUserBan(status) {
  userSession.banned = status;
  localStorage.setItem("banned", status);
  console.log(`%cUser ${status ? "banned" : "unbanned"}`, "color:#ff5555;");
}

// === Check if user can play ===
function canUserPlay() {
  if (userSession.banned) {
    alert("You are banned from playing.");
    return false;
  }
  return true;
}

// Initialize session on load
initUserSession();
