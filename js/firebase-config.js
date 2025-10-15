/* ===== firebase-config.js ===== */
/* Firebase Realtime Database initialization
   Replace the placeholders with your actual Firebase config later.
*/

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* === Firebase Path Shortcuts ===
   Each reference follows your intended structure:
   games/domino/rooms/public/tables/table1
*/
const refGames = db.ref("games");
const refDomino = refGames.child("domino");
const refRooms = refDomino.child("rooms");
const refPublic = refRooms.child("public");
const refTables = refPublic.child("tables");
const refTable1 = refTables.child("table1");

/* === Utility References for Common Actions === */
const refPlayers = refTable1.child("players");
const refChat = refTable1.child("chat");
const refBoard = refTable1.child("board");

/* === Placeholder Data for First Load (optional test mode) ===
   This ensures you have something visible even without Firebase active.
*/
window.firebaseReady = true; // Used in other scripts to check init status

console.log("%cFirebase Config Loaded", "color:#4da6ff; font-weight:bold;");
