/* ===== ui-controls.js ===== */
/* Connects the UI components (chat, options, sound, seats, etc.) */

window.canPlaySound = true;

// === Initialize all UI interactions ===
function initUIControls() {
  const optionsBtn = document.getElementById("options-button");

  // Options dropdown (quick placeholder example)
  optionsBtn.addEventListener("click", () => {
    alert("Options menu coming soon!");
  });

  // Hook up sound select if it exists in DOM (optional)
  const soundSelect = document.getElementById("sound");
  if (soundSelect) {
    soundSelect.addEventListener("change", e => {
      window.canPlaySound = e.target.value === "On";
      console.log("%cSound " + (canPlaySound ? "ON" : "OFF"), "color:#4da6ff;");
    });
  }

  // Example sound function (clean tone)
  window.playSound = function() {
    if (!canPlaySound) return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.value = 523.25; // C5
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    osc.connect(gain).connect(audioCtx.destination);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.3);
  };

  // Example test: play sound on seat click (optional)
  for (let i = 1; i <= 4; i++) {
    const seat = document.getElementById("P" + i);
    if (seat) {
      seat.addEventListener("click", () => {
        playSound();
      });
    }
  }

  console.log("%cUI Controls Initialized", "color:#4da6ff;");
}

// === Global helper to toggle chat manually ===
window.toggleChat = function() {
  const chatPanelEl = document.getElementById("chat-panel");
  const chatToggle = document.getElementById("chat-toggle");
  toggleChatPanel(chatPanelEl, chatToggle);
};

// Initialize all UI when DOM is ready
window.addEventListener("DOMContentLoaded", initUIControls);
