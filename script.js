// script.js
const authDiv = document.getElementById("auth");
const chatDiv = document.getElementById("chat");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const fileInput = document.getElementById("file-input");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const messagePara = document.getElementById("message");

const socket = io();

let token = "";

loginBtn.addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const data = await response.json();
    token = data.token;
    authDiv.style.display = "none";
    chatDiv.style.display = "block";
    loadMessages();
  } else {
    messagePara.textContent = "Invalid credentials";
  }
});

signupBtn.addEventListener("click", async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    messagePara.textContent = "Signup successful! You can now log in.";
  } else {
    messagePara.textContent = "Error signing up";
  }
});

logoutBtn.addEventListener("click", () => {
  token = "";
  authDiv.style.display = "block";
  chatDiv.style.display = "none";
});

document.getElementById("send-btn").addEventListener("click", () => {
  const messageText = messageInput.value;
  const file = fileInput.files[0];

  if (messageText.trim() === "" && !file) return;

  const data = { sender: "user", content: messageText };

  if (file) {
    const reader = new FileReader();
    reader.onloadend = function () {
      data.imageUrl = reader.result;
      socket.emit("sendMessage", data);
    };
    reader.readAsDataURL(file);
  } else {
    socket.emit("sendMessage", data);
  }

  messageInput.value = "";
  fileInput.value = "";
});

socket.on("receiveMessage", (message) => {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  if (message.imageUrl) {
    const img = document.createElement("img");
    img.src = message.imageUrl;
    messageElement.appendChild(img);
  }

  if (message.content) {
    const textNode = document.createTextNode(
      `${message.sender}: ${message.content}`
    );
    messageElement.appendChild(textNode);
  }

  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

async function loadMessages() {
  // Implement a function to fetch messages from the backend if needed
}
