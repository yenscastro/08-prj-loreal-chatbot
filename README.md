# Project 8: L'Oréal Smart Routine & Product Advisor

This project is a beginner-friendly AI chatbot for discovering L'Oréal products and beauty routines. It can answer questions about makeup, skincare, haircare, fragrances, and personalized beauty recommendations.

## Features

- Branded L'Oréal chatbot interface with logo, title, chat bubbles, and responsive layout.
- Friendly greeting when the chat opens.
- Conversation history is kept in the browser so the assistant can remember earlier questions and answers.
- The assistant is instructed to answer only L'Oréal and beauty-related questions.
- User and AI messages are displayed on opposite sides of the chat window.
- AI responses can display `**bold text**` as bold text.
- The latest question is shown above the response area.
- Empty messages are ignored.
- The input is cleared and focused after each request.
- Friendly error message when the chatbot service is unavailable.

## Run the chatbot

### GitHub Codespaces

1. In the GitHub repository, click **Code** and select **Open with Codespaces → New codespace**.
2. Open `index.html` with the Live Preview extension.

The repository includes `.vscode/settings.json` so Live Preview opens `/index.html` by default.

### Local files

This is a plain HTML, CSS, and JavaScript project, so no npm packages or build step are required. Open `index.html` with a local web server or Live Preview. The chatbot needs internet access to call the class-hosted Cloudflare Worker.

## How the API connection works

The browser sends the full conversation to the class-hosted Cloudflare Worker:

```js
{
  messages: [
    { role: "system", content: "..." },
    { role: "user", content: "..." },
    { role: "assistant", content: "..." }
  ]
}
```

The frontend reads the assistant response from:

```js
data.choices[0].message.content
```

The current Worker URL is configured in `script.js`. Students should use the Worker URL provided by their class instead of adding an OpenAI API key to this repository. Never put an API key in frontend code.

## Cloudflare Worker setup

`RESOURCE_cloudflare-worker.js` contains the Worker example. To use it:

1. Create or open a Cloudflare Worker.
2. Copy the contents of `RESOURCE_cloudflare-worker.js` into the Worker editor.
3. Add an encrypted Worker secret named `OPENAI_API_KEY` in the Cloudflare dashboard.
4. Deploy the Worker.
5. Update `workerUrl` in `script.js` with the deployed Worker URL.

The Worker:

- Handles browser CORS and `OPTIONS` preflight requests.
- Receives the frontend `messages` array.
- Sends the conversation to OpenAI using the Chat Completions API.
- Returns the JSON response to the browser.

## Main files

- `index.html` — page structure, branding, chat form, and footer.
- `style.css` — layout, colors, chat bubbles, accessibility styles, and responsive presentation.
- `script.js` — conversation state, API requests, message rendering, and error handling.
- `RESOURCE_cloudflare-worker.js` — Cloudflare Worker reference code.
- `img/loreal-logo.png` — L'Oréal logo used in the header.

Enjoy building your L'Oréal beauty assistant! 💄
