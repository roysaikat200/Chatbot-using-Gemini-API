
function sendMessage() {
  let inputField = document.getElementById("user-input");
  let chatBox = document.getElementById("chat-box");
  let userMessage = inputField.value.trim();

  if (userMessage === "") return;

  // Create user message container
  let userContainer = document.createElement("div");
  userContainer.classList.add("message-container", "user-container");

  // User avatar
  let userAvatar = document.createElement("img");
  userAvatar.src = "static/user.png";  // Make sure this image exists in /static/
  userAvatar.alt = "User Avatar";
  userAvatar.classList.add("avatar");

  // User message bubble
  let userBubble = document.createElement("div");
  userBubble.classList.add("message", "user");
  userBubble.innerHTML = userMessage.replace(/\n/g, "<br>");

  // Append user elements
  userContainer.appendChild(userBubble);
  userContainer.appendChild(userAvatar);
  chatBox.appendChild(userContainer);
  scrollToBottom();

  // Show AI typing bubble
  let botContainer = document.createElement("div");
  botContainer.classList.add("message-container");

  let botAvatar = document.createElement("img");
  botAvatar.src = "static/veronica.png";  // AI avatar
  botAvatar.alt = "Veronica AI";
  botAvatar.classList.add("avatar");

  let botBubble = document.createElement("div");
  botBubble.classList.add("message", "bot");
  botBubble.innerHTML = "<em>Typing...</em>";

  botContainer.appendChild(botAvatar);
  botContainer.appendChild(botBubble);
  chatBox.appendChild(botContainer);
  scrollToBottom();

  inputField.value = "";

  // Fetch AI response from Flask
  fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
  })
  .then(response => response.json())
  .then(data => {
      botBubble.innerHTML = data.response;
      scrollToBottom();
  })
  .catch(error => {
      botBubble.innerHTML = "⚠️ Error: Unable to fetch response!";
      console.error("Error:", error);
  });

  scrollToBottom();
}

function scrollToBottom() {
  let chatBox = document.getElementById("chat-box");
  setTimeout(() => {
      chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });
  }, 100);
}

document.getElementById("user-input").addEventListener("keydown", function(event) {
  if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
  }
});

function clearChat() {
  document.getElementById("chat-box").innerHTML = ""; // Clears the chat
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  
  let button = document.getElementById("toggle-theme");
  if (document.body.classList.contains("dark-mode")) {
      button.innerHTML = "☀️ Light Mode";
  } else {
      button.innerHTML = "🌙 Dark Mode";
  }
}
