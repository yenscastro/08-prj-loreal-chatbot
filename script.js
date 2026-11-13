// Find the parts of the page that the chatbot needs to use.
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Keep every message so the AI can remember the conversation.
let messages = [];

// Tell the AI what kind of questions it should answer.
messages.push({
  role: "system",
  content:
    "You are a L'Oréal beauty advisor. ONLY answer questions about L'Oréal products, beauty routines, makeup, haircare, and fragrances. Politely refuse questions that are unrelated to these topics.",
});

// This is the class worker URL. Replace the example subdomain with your class URL.
const workerUrl = "https://loreal-chatbot.your-subdomain.workers.dev/";

// Add a message to the chat window on either the user or AI side.
const displayMessage = (message, className) => {
  // Create a div so the message can be styled as a chat bubble.
  const messageElement = document.createElement("div");
  messageElement.className = `msg ${className}`;
  messageElement.textContent = message;
  chatWindow.appendChild(messageElement);

  // Scroll to the newest message.
  chatWindow.scrollTop = chatWindow.scrollHeight;
};

// Show a friendly greeting when the chat first opens.
displayMessage("👋 Hello! How can I help you today?", "ai");

// Listen for the user submitting a new question.
chatForm.addEventListener("submit", async (event) => {
  // Stop the form from refreshing the page.
  event.preventDefault();

  // Read the text that the user entered.
  const userText = userInput.value.trim();

  // Do not send an empty message.
  if (!userText) {
    return;
  }

  // Save the user's question in the conversation history.
  messages.push({ role: "user", content: userInput.value });

  // Display the user's message on the right side of the chat.
  displayMessage(userText, "user");

  // Add a clear label above the response area for the latest question.
  const questionElement = document.createElement("div");
  questionElement.className = "user-question-display";
  questionElement.textContent = `Your question: ${userText}`;
  chatWindow.appendChild(questionElement);

  try {
    // Send the full conversation to the class-hosted Cloudflare Worker.
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messages }),
    });

    // Stop if the worker returned an error response.
    if (!response.ok) {
      throw new Error("The chatbot service returned an error.");
    }

    // Read the worker's JSON response.
    const data = await response.json();
    const reply = data.choices[0].message.content;

    // Save the AI's response so it remembers this conversation.
    messages.push({ role: "assistant", content: reply });

    // Display the AI's response on the left side of the chat.
    displayMessage(reply, "ai");
  } catch (error) {
    // Tell the user when the worker cannot be reached.
    displayMessage(
      "Sorry, I could not connect to the beauty advisor right now.",
      "ai",
    );
    console.error("Chatbot request failed:", error);
  }

  // Clear the input so the user can ask another question.
  userInput.value = "";
  userInput.focus();
});
