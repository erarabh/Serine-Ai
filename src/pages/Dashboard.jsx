import React, { useState } from 'react';

export default function Dashboard() {
  // In a real system, the clientID would be stored in your client configuration. For now, we hard-code it.
  const [clientId] = useState("CLIENT_ABC123");
  const [websiteURL, setWebsiteURL] = useState('');
  const [embedCode, setEmbedCode] = useState('');

  const handleGenerate = () => {
    // The embed code now loads widget.js instead of chatbot.js.
    const code = `
<script src="https://serine-ai.vercel.app/widget.js" data-client-id="${clientId}" data-website-url="${websiteURL.trim()}"></script>
    `.trim();
    setEmbedCode(code);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Embed Code Generator</h1>
      
      <div className="mb-4">
        <label htmlFor="website-url" className="block mb-2">
          Enter Your Website URL:
        </label>
        <input
          id="website-url"
          type="text"
          value={websiteURL}
          onChange={(e) => setWebsiteURL(e.target.value)}
          placeholder="https://example.com"
          className="border p-2 w-full"
        />
      </div>
      
      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate Embed Code
      </button>

      {embedCode && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Your Embed Code:</h2>
          <textarea
            readOnly
            value={embedCode}
            className="w-full border p-2"
            rows="5"
          ></textarea>
          <p className="mt-2 text-sm text-gray-600">
            Copy and paste this code snippet into your website (e.g., in your test-page.html) to embed the chatbot widget.
          </p>
        </div>
      )}
    </div>
  );
}
