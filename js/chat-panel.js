/* ===== chat-panel.js ===== */
/* Handles chat sidebar, table creation, and global/local chat. */

window.chatPanel = {
  active: false,
  floodLock: false,
  currentTab: "tables",
  messages: [
    { from: "Bot #1", text: "Ready?" },
    { from: "Bot #2", text: "Let's go!" },
    { from: "Bot #3", text: "Waiting for one more..." }
  ]
};

// === Initialize chat ===
function initChatPanel() {
  const chatToggle = document.getElementById("chat-toggle");
  const chatPanelEl = document.getElementById("chat-panel");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send");
  const messagesDiv = document.getElementById("chat-messages");

  // Load dummy messages
  renderChatMessages();

  // Toggle sidebar
  chatToggle.addEventListener("click", () => toggleChatPanel(chatPanelEl, chatToggle));

  // Swipe from right to open / left to close
  let startX = 0;
  document.addEventListener("touchstart", e => (startX = e.touches[0].clientX));
  document.addEventListener("touchend", e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff < -50 && chatPanel.active) toggleChatPanel(chatPanelEl, chatToggle);
    if (diff > 50 && !chatPanel.active) toggleChatPanel(chatPanelEl, chatToggle);
  });

  // Send message
  sendBtn.addEventListener("click", () => sendChatMessage(chatInput, messagesDiv));
  chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter") sendChatMessage(chatInput, messagesDiv);
  });

  // Tab buttons
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => switchChatTab(btn.dataset.tab));
  });
}

// === Toggle Chat Panel ===
function toggleChatPanel(chatPanelEl, chatToggle) {
  chatPanel.active = !chatPanel.active;
  if (chatPanel.active) {
    chatPanelEl.classList.add("active");
    chatToggle.textContent = ">>";
  } else {
    chatPanelEl.classList.remove("active");
    chatToggle.textContent = "<<";
  }
}

// === Switch Chat Tabs ===
function switchChatTab(tabName) {
  chatPanel.currentTab = tabName;
  console.log(`%cSwitched to tab: ${tabName}`, "color:#4da6ff;");

  const chatMessages = document.getElementById("chat-messages");
  chatMessages.innerHTML = "";

  if (tabName === "tables") {
    chatMessages.innerHTML = `
      <p>Public Tables:</p>
      <button onclick="joinTable('table1')">Table #1</button>
      <button onclick="joinTable('table2')">Table #2</button>
      <button onclick="joinTable('table3')">Table #3</button>`;
  } else if (tabName === "create") {
    chatMessages.innerHTML = `
      <p>Create a new table:</p>
      <button onclick="createNewTable()">Create Table</button>`;
  } else if (tabName === "available") {
    chatMessages.innerHTML = `
      <p>Finding available seat...</p>
      <button onclick="autoJoinAvailable()">Auto Assign</button>`;
  }
}

// === Render Messages ===
function renderChatMessages() {
  const messagesDiv = document.getElementById("chat-messages");
  messagesDiv.innerHTML = chatPanel.messages
    .map(m => `<p><b>${m.from}:</b> ${m.text}</p>`)
    .join("");
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// === Send Message ===
function sendChatMessage(chatInput, messagesDiv) {
  const text = chatInput.value.trim();
  if (!text) return;

  if (chatPanel.floodLock) {
    alert("Please wait a moment before sending again.");
    return;
  }

  const message = { from: userSession.nickname, text };
  chatPanel.messages.push(message);
  renderChatMessages();

  // Simple anti-flood: 2 seconds between messages
  chatPanel.floodLock = true;
  setTimeout(() => (chatPanel.floodLock = false), 2000);

  // Firebase-ready placeholder
  if (window.firebaseReady) {
    try {
      const msgRef = refChat.push();
      msgRef.set(message);
    } catch (err) {
      console.warn("Firebase chat send skipped (offline mode).");
    }
  }

  // Global chat detection
  if (text.startsWith("!")) {
    broadcastGlobalMessage(message);
  }

  chatInput.value = "";
}

// === Placeholder for Global Broadcast ===
function broadcastGlobalMessage(message) {
  console.log("%cGlobal message: " + message.text, "color:#00ffaa;");
  // Future: refGlobalChat.push(message)
}

// === Table Actions ===
function joinTable(tableId) {
  alert(`Joined ${tableId}`);
}

function createNewTable() {
  const newId = "table" + Math.floor(Math.random() * 1000);
  alert(`Created ${newId}`);
}

function autoJoinAvailable() {
  alert("Auto-joined an available table!");
}

// Initialize chat after DOM loads
window.addEventListener("DOMContentLoaded", initChatPanel);
