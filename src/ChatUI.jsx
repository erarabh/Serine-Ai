import { useState } from 'react';
import ReactMarkdown from 'react-markdown'; // For rendering Markdown formatting

export default function ChatUI() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi, I’m Serine AI. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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

      // Fetch call – one immediate attempt and, if it fails, one extra attempt after a brief (300ms) delay.
      let response;
      try {
        response = await fetch(`${API_URL}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text,
            })),
          }),
        });
      } catch (error) {
        console.warn("First fetch attempt failed, retrying after 300ms...");
        await new Promise((res) => setTimeout(res, 300)); // Short delay
        response = await fetch(`${API_URL}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((msg) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text,
            })),
          }),
        });
      }

      // End timing the API call and log the response time.
      const endTime = performance.now();
      console.log(`API Response Time: ${endTime - startTime}ms`);

      // If the response is missing or not OK, log the error and display a fallback message.
      if (!response || !response.ok) {
        const errorText = response ? await response.text() : "No response";
        console.error('❌ Server returned error:', response ? response.status : 'no response', errorText);
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: "I'm sorry, I didn't understand that. Can you rephrase?" }
        ]);
      } else {
        // Process a successful response.
        const data = await response.json();
        const botReply = data?.message || "I'm sorry, I didn't understand that. Can you rephrase?";
        setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
      }
    } catch (err) {
      console.error('❌ API Error:', err);
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
              <ReactMarkdown className="prose prose-sm">
                {msg.text}
              </ReactMarkdown>
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
