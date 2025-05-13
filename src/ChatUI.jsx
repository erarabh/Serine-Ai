import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { sendChatMessage } from './BotLogic'; // Ensure BotLogic.js is in the same folder

export default function ChatUI() {
  // Use state to store the clientId.
  const [clientId, setClientId] = useState("DEFAULT_CLIENT_ID");

  // On mount, extract the clientId from the URL query.
  useEffect(() => {
    // Extract the "siteid" query parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const extractedClientId = params.get("siteid") || "DEFAULT_CLIENT_ID";
    console.log("Extracted clientId from URL:", extractedClientId);
    setClientId(extractedClientId);
  }, []);

  // Chat UI state and logic
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi, I’m Serine AI. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

													   
  const saveMessages = (msgs, max = 5) => {
    const lastMessages = msgs.length <= max ? msgs : msgs.slice(-max);
    localStorage.setItem("chatHistory", JSON.stringify(lastMessages));
							 
		   
  };

															   
  useEffect(() => {
    const storedMessages = localStorage.getItem("chatHistory");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

															   
  useEffect(() => {
    const saveDelay = setTimeout(() => {
      saveMessages(messages);
    }, 500);
    return () => clearTimeout(saveDelay);
  }, [messages]);

																					
																				  
			   
	   
			  
																					
				   
								   
   

																				
  const storedSessionId = localStorage.getItem("sessionId");

															
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessageObj = { sender: 'user', text: input };

    // Update UI immediately
    setMessages((prev) => [...prev, userMessageObj]);
    const userInput = input;
    setInput('');
    setLoading(true);

    try {
      // Build payload using the extracted clientId from state.
      const payload = {
        clientId, // This should now be the value from the URL (e.g., CLIENT_ABC123)
        sessionId: storedSessionId,
        message: userInput,
      };
      console.log("Sending chat message with payload:", payload);
      const data = await sendChatMessage(payload);
      if (data.sessionId && !storedSessionId) {
        localStorage.setItem("sessionId", data.sessionId);
      }

																					  
      const botReply =
        data?.message || "I'm sorry, I didn't understand that. Can you rephrase?";
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error("Error sending message:", error);
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
              <ReactMarkdown className="prose prose-sm">{msg.text}</ReactMarkdown>
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading) {
              sendMessage();
            }
          }}
          disabled={loading}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          placeholder="Type your question..."
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className={`bg-blue-600 text-white px-4 py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
