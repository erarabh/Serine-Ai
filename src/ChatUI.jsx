import { useState } from 'react';

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
      // Updated URL: use relative endpoint so that Vite's proxy takes effect.
      const response = await fetch('/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: updatedMessages.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    })),
  }),
});

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server returned error:', response.status, errorText);
      }

      const data = await response.json();
      const botReply = data?.message || 'No response received.';
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    } catch (err) {
      console.error('❌ API Error:', err);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '⚠️ Error talking to server.' },
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
            {msg.text}
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
