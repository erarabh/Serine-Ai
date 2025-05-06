import { useState } from 'react';
import ReactMarkdown from 'react-markdown'; // For rendering Markdown formatting

export default function ChatUI() {
  // Initial chatbot message
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi, I’m Serine AI. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper function to transform bullet list items ("-") to numbered list items.
  function formatBotMarkdown(text) {
    // Split text by newlines
    const lines = text.split("\n");
    let counter = 1;
    // Process each line: if it starts with "-" then replace it with "number. "
    const formattedLines = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith("-")) {
        const content = trimmed.replace(/^-\s*/, "");  // remove the leading dash and whitespace
        return `${counter++}. ${content}`;
      }
      return line;
    });
    return formattedLines.join("\n");
  }

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      // Use relative endpoint so that Vite's proxy takes effect if configured.
      const API_URL = import.meta.env.VITE_API_URL || "https://serine-ai-backend-production.up.railway.app";

      // Start timing the API call
      const startTime = performance.now();

      // Exponential backoff retry function (up to 3 attempts)
      async function fetchWithRetry(url, options, retries = 3) {
        for (let i = 0; i < retries; i++) {
          try {
            const response = await fetch(url, options);
            if (response.ok) {
              return response;
            }
          } catch (error) {
            console.warn(`Fetch attempt ${i + 1} failed.`);
          }
          // Delay increases with each retry (500ms, 1000ms, 1500ms, etc.)
          await new Promise((res) => setTimeout(res, 500 * (i + 1)));
        }
        return null;
      }

      const response = await fetchWithRetry(
        `${API_URL}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text,
            })),
          }),
        },
        3
      );

      // End timing the API call and log the response time.
      const endTime = performance.now();
      console.log(`API Response Time: ${endTime - startTime}ms`);

      // If no successful response was obtained after retries, throw an error.
      if (!response) {
        throw new Error("Failed after multiple attempts.");
      }

      // Check for non-OK status even if response was received.
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server returned error:', response.status, errorText);
      }

      // Process the API response JSON; apply fallback if needed.
      const data = await response.json();
      const botReply = data?.message || "I'm sorry, I didn't understand that. Can you rephrase?";
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    } catch (err) {
      console.error('❌ API Error:', err);
      // Show fallback error message.
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '⚠️ Error talking to server. Please try again later.' },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen bg-gray-50 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Serine AI - Chatbot</h1>
      <div className="space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-[80%] ${
              msg.sender === 'user'
                ? 'bg-blue-100 self-end ml-auto'
                : 'bg-gray-200'
            }`}
          >
            {msg.sender === 'bot' ? (
              // Pass bot text through our formatter before rendering.
              <ReactMarkdown className="prose prose-sm">{formatBotMarkdown(msg.text)}</ReactMarkdown>
            ) : (
              msg.text
            )}
          </div>
        ))}
      </div>
      {loading && <div className="mt-2 text-sm text-gray-500">Thinking...</div>}
      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          placeholder="Type your question..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
