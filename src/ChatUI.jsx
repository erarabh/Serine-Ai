import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'; // For rendering Markdown formatting

export default function ChatUI() {
  // Initialize with a default welcome message
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi, I’m Serine AI. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

// ✅ Save messages helper
const saveMessages = (messages, max = 5) => {
  const lastMessages = messages.length <= max ? messages : messages.slice(-max);
  localStorage.setItem("chatHistory", JSON.stringify(lastMessages));
};

  // On component mount, load the stored chat history (last 5 messages) from localStorage
  useEffect(() => {
    const storedMessages = localStorage.getItem("chatHistory");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

 // ✅ Save on each message update
useEffect(() => {
  saveMessages(messages);
}, [messages]);

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

      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
        }),
      });

      // End timing the API call
      const endTime = performance.now();
      console.log(`API Response Time: ${endTime - startTime}ms`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server returned error:', response.status, errorText);
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
